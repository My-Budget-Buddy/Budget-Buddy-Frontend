import { Button, Icon, Table, Title } from "@trussworks/react-uswds";
import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { AxisConfig, BarItemIdentifier, legendClasses } from "@mui/x-charts";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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

const Spending: React.FC = () => {
    const navigate = useNavigate();
    const [showTooltip, setShowTooltip] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [spendingCategories, setSpendingCategories] = useState<
        { name: TransactionCategory; value: number; color: string }[]
    >([]);

    //colors for each category
    const categoryColors: { [key in TransactionCategory]: string } = {
        GROCERIES: "#90c8f4",
        ENTERTAINMENT: "#e5d23a",
        DINING: "#6ed198",
        TRANSPORTATION: "#af98f9",
        HEALTHCARE: "#fd6d6d",
        LIVING_EXPENSES: "#5a7ffa",
        SHOPPING: "#fe992b",
        INCOME: "#f7b7e5",
        MISC: "#dce2e1"
    };

    /*
    //mock data
    const mockcategories = [
        { name: "Groceries", value: 300 },
        { name: "Entertainment", value: 150 },
        { name: "Dining", value: 200 },
        { name: "Transportation", value: 100 },
        { name: "Healthcare", value: 80 },
        { name: "Living Expenses", value: 1000 },
        { name: "Shopping", value: 120 },
        { name: "Investments", value: 50 },
        { name: "Miscellaneous", value: 50 }
    ];

    
        //mock data
        useEffect(() => {
          
            const fetchData = async () => {
                const spending = {
                    january: 4000,
                    february: 3000,
                    march: 5000,
                    april: 2000,
                    may: 4500,
                    june: 3000,
                    july: 5000,
                    august: 4000,
                    september: 450,
                    october: 5000,
                    november: 4000,
                    december: 6000,
                };
                const earned = {
                    january: 8000,
                    february: 7500,
                    march: 9000,
                    april: 6500,
                    may: 8500,
                    june: 7000,
                    july: 8000,
                    august: 8500,
                    september: 9000,
                    october: 9500,
                    november: 8000,
                    december: 10000,
                };
                setSpendingData(spending);
                setEarnedData(earned);
            };
            fetchData();
        }, []);
    
    */

    //starting state for spending data. set all months to zero
    const [spendingData, setSpendingData] = useState<Record<Month, number>>({
        january: 0,
        february: 0,
        march: 0,
        april: 0,
        may: 0,
        june: 0,
        july: 0,
        august: 0,
        september: 0,
        october: 0,
        november: 0,
        december: 0
    });

    //starting state for earned data. set all months to zero
    const [earnedData, setEarnedData] = useState<Record<Month, number>>({
        january: 0,
        february: 0,
        march: 0,
        april: 0,
        may: 0,
        june: 0,
        july: 0,
        august: 0,
        september: 0,
        october: 0,
        november: 0,
        december: 0
    });

    //fetch from backend with axios
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get<Transaction[]>("http://localhost:8083/transactions/user/1");
                console.log(response.data);
                const transactions = response.data;
                setTransactions(transactions);
                console.log("Fetched transactions:", transactions);
                const updatedSpendingData: Record<Month, number> = { ...spendingData };
                const updatedEarnedData: Record<Month, number> = { ...earnedData };

                const categorySpending: { [key in TransactionCategory]?: number } = {};

                //process each transaction
                transactions.forEach((transaction: Transaction) => {
                    const monthIndex = new Date(transaction.date).getMonth();
                    const amount = transaction.amount;
                    const monthKeys: Month[] = [
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
                    const monthKey = monthKeys[monthIndex];

                    //if the category is INCOME, update earned data
                    //else update spending data and the spending categories
                    if (transaction.category === "INCOME") {
                        updatedEarnedData[monthKey] += amount;
                    } else {
                        updatedSpendingData[monthKey] += amount;

                        if (!categorySpending[transaction.category]) {
                            categorySpending[transaction.category] = 0;
                        }
                        categorySpending[transaction.category]! += amount;
                    }
                });

                //map category spending to an array with colors
                const spendingCategories = (Object.keys(categorySpending) as TransactionCategory[]).map((category) => ({
                    name: category,
                    value: categorySpending[category]!,
                    color: categoryColors[category]
                }));

                console.log("Updated spending data:", updatedSpendingData);
                console.log("Updated earned data:", updatedEarnedData);

                setSpendingData(updatedSpendingData);
                setEarnedData(updatedEarnedData);
                setSpendingCategories(spendingCategories);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []);

    // calculate total spending
    const totalSpent = Object.values(spendingData).reduce((acc, curr) => acc + curr, 0);

    // prepare data for the bar chart
    const chartData = [
        { month: "January", spending: spendingData.january, earned: earnedData.january },
        { month: "February", spending: spendingData.february, earned: earnedData.february },
        { month: "March", spending: spendingData.march, earned: earnedData.march },
        { month: "April", spending: spendingData.april, earned: earnedData.april },
        { month: "May", spending: spendingData.may, earned: earnedData.may },
        { month: "June", spending: spendingData.june, earned: earnedData.june },
        { month: "July", spending: spendingData.july, earned: earnedData.july },
        { month: "August", spending: spendingData.august, earned: earnedData.august },
        { month: "September", spending: spendingData.september, earned: earnedData.september },
        { month: "October", spending: spendingData.october, earned: earnedData.october },
        { month: "November", spending: spendingData.november, earned: earnedData.november },
        { month: "December", spending: spendingData.december, earned: earnedData.december }
    ];

    const categories = chartData.map((d) => d.month);
    const spendingValues = chartData.map((d) => d.spending);
    const earnedValues = chartData.map((d) => d.earned);

    //category expenses table
    const categoryExpenses = (
        <>
            <thead>
                <tr>
                    <th scope="col">Category</th>
                    <th scope="col">% of Annual Spending</th>
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
                        <td>{((category.value / spendingValues.reduce((a, b) => a + b, 0)) * 100).toFixed(2)}%</td>
                        <td>${category.value.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </>
    );

    //click on the bar in the bar chart to go to a specific month
    const handleItemClick = (event: React.MouseEvent<SVGElement>, barItemIdentifier: BarItemIdentifier) => {
        const { dataIndex } = barItemIdentifier;
        const month = categories[dataIndex];
        navigate(`/dashboard/spending/${month}`);
    };

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
                    {/* <Title className="ml-3">Spending Overview</Title> */}

                    <div className="mb-6">
                        <Title className="ml-3">Spending Overview</Title>
                        <p className="text-6xl font-semibold">${totalSpent.toFixed(2)}</p>
                    </div>

                    <Link to="/dashboard/spending/May" className="mr-3">
                        <Button type="button" className="ml-3">
                            See Current Month
                        </Button>
                    </Link>
                    <span
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        className="relative"
                    >
                        <Icon.Help style={{ color: "#74777A", fontSize: "1.7rem", marginRight: "0.8rem" }} />
                        {/* render tooltip conditionally */}
                        {showTooltip && (
                            <div className="absolute left-8 top-0 bg-gray-200 p-2 rounded shadow-md w-60">
                                Click on any bar in the chart to view detailed spending for that month.
                            </div>
                        )}
                    </span>
                    {/* Full-width row */}
                    <div className="p-4 m-2 min-h-[30rem] rounded-md flex justify-center items-center border-4 border-gray-100 bg-white shadow-lg">
                        <BarChart
                            xAxis={[
                                { scaleType: "band", data: categories, categoryGapRatio: 0.5 } as AxisConfig<"band">
                            ]}
                            series={[
                                { data: earnedValues, color: "#cbd5e8", label: "Earned" },
                                { data: spendingValues, color: "#1f78b4", label: "Spendings" }
                            ]}
                            grid={{ horizontal: true }}
                            width={1400}
                            height={400}
                            onItemClick={handleItemClick} //this lets you click on the bars
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

                                            arcLabelMinAngle: 20,

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

export default Spending;
