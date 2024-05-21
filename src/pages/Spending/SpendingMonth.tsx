import { Button, Icon, Table, Title } from "@trussworks/react-uswds";
import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { AxisConfig, BarItemIdentifier, legendClasses } from "@mui/x-charts";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import CategoryIcon, { TransactionCategory } from "../../components/CategoryIcon";

//define the type for months
type Month =
    | "january"
    | "february"
    | "march"
    | "april"
    | "may"
    | "june"
    | "july"
    | "august"
    | "september"
    | "october"
    | "november"
    | "december";

//define the type for transactions
type Transaction = {
    transactionId: number;
    userId: number;
    accountId: number;
    vendorName: string;
    amount: number;
    category: TransactionCategory;
    description: string;
    date: string;
};

const SpendingMonth: React.FC = () => {
    const { month } = useParams<{ month: Month }>(); //get month parameter from url
    const lowercaseMonth = month?.toLowerCase() as Month; //need to make the month name lowercase
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [weeklyData, setWeeklyData] = useState<{ week: number; spending: number; earning: number }[]>([]);
    const [spendingCategories, setSpendingCategories] = useState<
        { name: TransactionCategory; value: number; color: string }[]
    >([]);

    //colors for categories
    const categoryColors: { [key in TransactionCategory]: string } = {
        GROCERIES: "#B0C4DE",
        ENTERTAINMENT: "#ADD8E6",
        DINING: "#87CEFA",
        TRANSPORTATION: "#4682B4",
        HEALTHCARE: "#5F9EA0",
        LIVING_EXPENSES: "#0A8AD0",
        SHOPPING: "#AFEEEE",
        INCOME: "#778899",
        MISC: "#D3D3D3"
    };

    //get week number
    const getWeekNumber = (date: Date) => {
        const start = new Date(date.getFullYear(), 0, 1);
        const diff =
            (date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000) /
            86400000;
        return Math.floor(diff / 7) + 1;
    };

    //get the index of a month
    const getMonthIndex = (month: Month) => {
        const months: Month[] = [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december"
        ];
        return months.indexOf(month);
    };

    //generate all weeks for a given month
    const getAllWeeksInMonth = (year: number, monthIndex: number) => {
        const weeks = new Set<number>();
        const date = new Date(year, monthIndex, 1);

        while (date.getMonth() === monthIndex) {
            weeks.add(getWeekNumber(new Date(date)));
            date.setDate(date.getDate() + 1);
        }

        return Array.from(weeks);
    };

    //axios call for all transactions
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get<Transaction[]>(`http://localhost:8083/transactions/user/1`);
                const monthIndex = getMonthIndex(lowercaseMonth);
                const transactions = response.data.filter(
                    (transaction) => new Date(transaction.date).getMonth() === monthIndex
                );
                setTransactions(transactions);

                const weeklySpending: { [key: number]: number } = {};
                const weeklyEarning: { [key: number]: number } = {};

                //get weekly earning and spending
                transactions.forEach((transaction: Transaction) => {
                    const date = new Date(transaction.date);
                    const week = getWeekNumber(date);
                    if (transaction.category === "INCOME") {
                        if (!weeklyEarning[week]) weeklyEarning[week] = 0;
                        weeklyEarning[week] += transaction.amount;
                    } else {
                        if (!weeklySpending[week]) weeklySpending[week] = 0;
                        weeklySpending[week] += transaction.amount;
                    }
                });

                //get all weeks in the current month
                const year = new Date().getFullYear();
                const weeksInMonth = getAllWeeksInMonth(year, monthIndex);

                //prepare spending and earning data for the bar chart
                const data = weeksInMonth.map((week) => ({
                    week,
                    spending: weeklySpending[week] || 0,
                    earning: weeklyEarning[week] || 0
                }));

                setWeeklyData(data);

                //calculate spending by category
                const categorySpending: { [key in TransactionCategory]?: number } = {};
                transactions.forEach((transaction: Transaction) => {
                    if (transaction.category !== "INCOME") {
                        if (!categorySpending[transaction.category]) {
                            categorySpending[transaction.category] = 0;
                        }
                        categorySpending[transaction.category]! += transaction.amount;
                    }
                });

                //prepare category data for pie chart
                const spendingCategories = (Object.keys(categorySpending) as TransactionCategory[]).map((category) => ({
                    name: category,
                    value: categorySpending[category]!,
                    color: categoryColors[category]
                }));

                setSpendingCategories(spendingCategories);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []);

    //total spending for the month
    const totalSpending = transactions.reduce(
        (sum, transaction) => (transaction.category !== "INCOME" ? sum + transaction.amount : sum),
        0
    );

    //category expenses table
    const categoryExpenses = (
        <>
            <thead>
                <tr>
                    <th scope="col">Category</th>
                    <th scope="col">% of Monthly Spending</th>
                    <th scope="col">Amount</th>
                </tr>
            </thead>
            <tbody>
                {spendingCategories.map((category) => (
                    <tr key={category.name}>
                        <th scope="row">
                            <CategoryIcon category={category.name} color={category.color} />
                            {category.name}
                        </th>
                        <td>{((category.value / totalSpending) * 100).toFixed(2)}%</td>
                        <td>${category.value.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </>
    );

    //top three expense categories table
    const topThreeCategories = [...spendingCategories].sort((a, b) => b.value - a.value).slice(0, 3);

    const topExpenses = (
        <>
            <thead>
                <tr>
                    <th scope="col">Category</th>

                    <th scope="col">Amount</th>
                </tr>
            </thead>
            <tbody>
                {topThreeCategories.map((category) => (
                    <tr key={category.name}>
                        <th scope="row">
                            <CategoryIcon category={category.name} color={category.color} />
                            {category.name}
                        </th>
                        <td>${category.value.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </>
    );

    return (
        <div className="min-w-screen">
            <div className="flex-1">
                <section className="h-screen">
                    {/* Title for the page */}
                    <div className="mb-6">
                        <Title className="ml-3">
                            {" "}
                            {lowercaseMonth.charAt(0).toUpperCase() + lowercaseMonth.slice(1)} Spending
                        </Title>
                        <p className="text-6xl font-semibold">${totalSpending.toFixed(2)}</p>
                    </div>

                    <Link to="/dashboard/spending" className="mr-3">
                        <Button type="button" className="ml-3">
                            Back to Annual Spending Overview
                        </Button>
                    </Link>
                    {/* Full-width row */}
                    <div className=" bg-gray-100 p-4 m-2 min-h-[30rem] rounded-md flex justify-center items-center shadow-lg">
                        <BarChart
                            xAxis={[
                                {
                                    scaleType: "band",
                                    data: weeklyData.map((d) => `Week ${d.week}`),
                                    categoryGapRatio: 0.5
                                } as AxisConfig<"band">
                            ]}
                            series={[
                                { data: weeklyData.map((d) => d.earning), color: "#cbd5e8", label: "Earnings" },
                                { data: weeklyData.map((d) => d.spending), color: "#1f78b4", label: "Spendings" }
                            ]}
                            grid={{ horizontal: true }}
                            width={1400}
                            height={400}
                        />
                    </div>
                    {/* Second row with two columns */}
                    <div className="flex">
                        <div className="flex flex-col justify-center items-center flex-3 p-4 m-2 min-h-[35rem] rounded-md border-4 border-gray-100 bg-white shadow-lg">
                            <h2></h2>
                            <div className="relative w-full h-full sm:w-1/2 sm:h-1/2 md:w-3/4 md:h-3/4 lg:w-full lg:h-full">
                                <PieChart
                                    series={[
                                        {
                                            data: spendingCategories.map((d) => ({
                                                label: d.name,
                                                id: d.name,
                                                value: d.value,
                                                icon: CategoryIcon,
                                                color: d.color
                                            })),
                                            innerRadius: "48%",
                                            outerRadius: "95%",
                                            paddingAngle: 1,
                                            cornerRadius: 3,
                                            startAngle: -180,
                                            endAngle: 180,
                                            cx: "50%",
                                            cy: "50%",
                                            arcLabel: (item) => `${item.label}`,

                                            arcLabelMinAngle: 15,

                                            valueFormatter: (v, { dataIndex }) => {
                                                return `$ ${v.value} `;
                                            }
                                        }
                                    ]}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        [`& .${pieArcLabelClasses.root}`]: {
                                            fill: "white",
                                            fontWeight: "bold"
                                        },
                                        [`.${legendClasses.root}`]: {
                                            transform: "translate(2px, 0)"
                                        }
                                    }}
                                />
                            </div>
                            <div className="w-full">
                                <Table bordered={false} className="w-full">
                                    {categoryExpenses}
                                </Table>
                            </div>
                        </div>
                        {/* section for more insights -> top expenses..and?? */}

                        <div className="flex flex-col justify-center items-center flex-1 p-4 m-2 rounded-md border-4 border-gray-100 bg-white shadow-lg">
                            <h2 className="text-2xl mb-4">Top Expenses</h2>
                            <Table bordered={false} className="w-full">
                                {topExpenses}
                            </Table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SpendingMonth;
