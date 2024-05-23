import { Button, Icon, Table, Title } from "@trussworks/react-uswds";
import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { AxisConfig, BarItemIdentifier, legendClasses, useDrawingArea } from "@mui/x-charts";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import CategoryIcon from "../../components/CategoryIcon";
import { TransactionCategory, Transaction } from "../../types/models";

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
        [TransactionCategory.GROCERIES]: "#B0C4DE",
        [TransactionCategory.ENTERTAINMENT]: "#ADD8E6",
        [TransactionCategory.DINING]: "#87CEFA",
        [TransactionCategory.TRANSPORTATION]: "#4682B4",
        [TransactionCategory.HEALTHCARE]: "#5F9EA0",
        [TransactionCategory.LIVING_EXPENSES]: "#0A8AD0",
        [TransactionCategory.SHOPPING]: "#AFEEEE",
        [TransactionCategory.INCOME]: "#778899",
        [TransactionCategory.MISC]: "#D3D3D3"
    };

    //-----MONTH ROUTING---
    const monthNames: Month[] = [
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

    const getPreviousMonth = (month: Month) => {
        const index = monthNames.indexOf(month);
        return index === 0 ? monthNames[11] : monthNames[index - 1];
    };

    const getNextMonth = (month: Month) => {
        const index = monthNames.indexOf(month);
        return index === 11 ? monthNames[0] : monthNames[index + 1];
    };

    const previousMonth = getPreviousMonth(lowercaseMonth);
    const nextMonth = getNextMonth(lowercaseMonth);

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
                    if (transaction.category === "Income") {
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
                    if (transaction.category !== "Income") {
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
    }, [month]);

    //total spending for the month
    const totalSpending = transactions.reduce(
        (sum, transaction) => (transaction.category !== "Income" ? sum + transaction.amount : sum),
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
                    <tr key={category.name} style={{ padding: "20px" }}>
                        <th scope="row" style={{ padding: "20px" }}>
                            <CategoryIcon category={category.name} color={category.color} />
                            {category.name}
                        </th>
                        <td style={{ padding: "20px" }}>{((category.value / totalSpending) * 100).toFixed(2)}%</td>
                        <td style={{ padding: "20px" }}>${category.value.toFixed(2)}</td>
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

    //for text in the center of the pie chart
    const StyledText = styled("text")(({ theme }) => ({
        fill: theme.palette.text.primary,
        textAnchor: "middle",
        dominantBaseline: "central"
    }));

    const Line1 = styled("tspan")(({ theme }) => ({
        fontSize: 20
    }));

    const Line2 = styled("tspan")(({ theme }) => ({
        fontSize: 35,
        fontWeight: "bold",
        dy: "1.6em" // controls the spacing between the lines
    }));

    function PieCenterLabel({ totalSpending }: { totalSpending: number }) {
        const { width, height, left, top } = useDrawingArea();
        return (
            <StyledText x={left + width / 2} y={top + height / 2 - 10}>
                <Line1 dy="-1.0em">TOTAL SPENT</Line1>
                <Line2 x={left + width / 2} dy="1.2em">
                    ${totalSpending.toFixed(2)}
                </Line2>
            </StyledText>
        );
    }

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

                    {/* Full-width row */}
                    <div className=" bg-gray-100 p-4 m-2 min-h-[30rem] rounded-md flex flex-col justify-center items-center shadow-lg">
                        <div className="flex items-center mb-4 justify-start w-full">
                            <Link to="/dashboard/spending" className="mr-3">
                                <Button type="button" className="ml-3">
                                    Back to Annual Spending Overview
                                </Button>
                            </Link>
                            <Link to={`/dashboard/spending/${previousMonth}`} className="mr-3">
                                <Button type="button" className="ml-3">
                                    Previous Month
                                </Button>
                            </Link>
                            <Link to={`/dashboard/spending/${nextMonth}`} className="mr-3">
                                <Button type="button" className="ml-3">
                                    Next Month
                                </Button>
                            </Link>
                        </div>
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
                        <div className="flex flex-col justify-center items-center flex-3 p-4 m-2 min-h-[40rem] rounded-md border-4 border-gray-100 bg-white shadow-lg">
                            <h2></h2>
                            <div className="relative w-full h-full sm:w-1/2 sm:h-1/2 md:w-3/4 md:h-3/4 lg:w-full lg:h-full lg:-m-4">
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
                                    slotProps={{
                                        legend: { hidden: true }
                                    }}
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
                                >
                                    <PieCenterLabel totalSpending={totalSpending} />
                                </PieChart>
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
