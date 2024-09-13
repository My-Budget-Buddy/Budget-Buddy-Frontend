import { Button, Icon, Table, Title, Select } from "@trussworks/react-uswds";
import React, { useEffect, useState } from "react";
import { AxisConfig, useDrawingArea } from "@mui/x-charts";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { styled } from "@mui/material/styles";
import { LineChart, lineElementClasses, markElementClasses } from "@mui/x-charts/LineChart";
import { Link, useNavigate } from "react-router-dom";
import CategoryIcon, { categoryIcons } from "../../components/CategoryIcon";
import { TransactionCategory, Transaction } from "../../types/models";
import { useTranslation } from "react-i18next";
import axios from "axios";
//import { getTransactionByUserId } from "../../utils/transactionService";

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

//define the type for spending categories
type SpendingCategory = {
    displayName: any;
    name: TransactionCategory;
    value: number;
    color: string;
    icon: React.ElementType;
};


//define type for year dropdown options
type YearOption = {
    value: number;
    label: string;
};



//main spending component
const Spending: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // ---set up state variables----
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [mostPopularVendors, setMostPopularVendors] = useState<{ vendorName: string; amount: number }[]>([]);
    const [spendingCategories, setSpendingCategories] = useState<SpendingCategory[]>([]);
    const [currentWeekSpending, setCurrentWeekSpending] = useState<number>(0);
    const [previousWeekSpending, setPreviousWeekSpending] = useState<number>(0);
    const [currentWeekDeposits, setCurrentWeekDeposits] = useState<number>(0);
    const [previousWeekDeposits, setPreviousWeekDeposits] = useState<number>(0);
    const [currentYearSpending, setCurrentYearSpending] = useState<number>(0);

    const [predictions2024, setPredictions2024] = useState<Transaction[]>([]);  // stores predicted transactions for the year 2024
    const [predictions2025, setPredictions2025] = useState<Transaction[]>([]);  // stores predicted transactions for the year 2025
    const [viewingNextYear, setViewingNextYear] = useState(false);  // toggle for switching between current and next year view
    const [selectedYear, setSelectedYear] = useState<number>(2024);  // stores the selected year for filtering transaction data

    //initial data structure for monthly spending. set each month to zero
    const initialData: Record<Month, number> = {
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
        december: 0,
    };

    const [spendingData2022, setSpendingData2022] = useState<Record<Month, number>>({ ...initialData });
    const [spendingData2023, setSpendingData2023] = useState<Record<Month, number>>({ ...initialData });
    const [spendingData2024, setSpendingData2024] = useState<Record<Month, number>>({ ...initialData });

    // array of years for the dropdown menu
    const years = [2022, 2023, 2024];

    // dropdown options for selecting a year
    const yearOptions: YearOption[] = years.map((year) => ({
        value: year,
        label: year.toString(),
    }));

    //colors for each category
    const categoryColors: { [key in TransactionCategory]: string } = {
        [TransactionCategory.GROCERIES]: "#4F81BD", // Cool Blue
        [TransactionCategory.ENTERTAINMENT]: "#1E3A8A", // Dark Blue
        [TransactionCategory.DINING]: "#4BC0C0", // Cool Teal
        [TransactionCategory.TRANSPORTATION]: "#60A5FA", // Light Blue
        [TransactionCategory.HEALTHCARE]: "#6B7280", // Cool Gray
        [TransactionCategory.LIVING_EXPENSES]: "#1e4d4d", // Sea Green
        [TransactionCategory.SHOPPING]: "#87CEEB", // Sky Blue
        [TransactionCategory.INCOME]: "#9CA3AF", // Medium Gray
        [TransactionCategory.MISC]: "#CBD5E1" // Light Gray Blue
    };

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

    // ----AXIOS CALL------
    //fetch from backend with axios

    const fetchTransactions = async () => {
        try {
            // const response = await axios.get<Transaction[]>("http://localhost:8083/transactions/user/1");
            // const transactions = response.data;

            // const transactions = await getTransactionByUserId(1);

            // -----fetch synthetic transactions from the flask api endpoint----
            const response = await axios.get<Transaction[]>("http://localhost:5000/api/transactions");

            //store fetched transactions
            const transactions = response.data;

            // make copies of the current spending data for 2022, 2023, and 2024
            const updatedSpendingData2022 = { ...spendingData2022 };
            const updatedSpendingData2023 = { ...spendingData2023 };
            const updatedSpendingData2024 = { ...spendingData2024 };

            console.log("First transaction in API response:", transactions[0]);  // log first transaction for debugging
            setTransactions(transactions);

            // define current date, start of this week, start of last week, start of current year
            const now = new Date();
            const startOfThisWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            const startOfLastWeek = new Date(new Date(startOfThisWeek).setDate(startOfThisWeek.getDate() - 7));
            const startOfThisYear = new Date(new Date().getFullYear(), 0, 1);

            let thisWeekSpending = 0;
            let lastWeekSpending = 0;
            let thisWeekDeposits = 0;
            let lastWeekDeposits = 0;
            let thisYearSpending = 0;

            transactions.forEach((transaction: Transaction) => {
                const transactionDate = new Date(transaction.date);
                const amount = transaction.amount;
                const year = transactionDate.getFullYear(); // get the transaction year
                const monthIndex = transactionDate.getMonth(); // transaction month as an index

                // map month to their corresponding names
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

                // update spending data based on the year of the transaction
                if (year === 2022) {
                    if (transaction.category !== "Income") {
                        updatedSpendingData2022[monthKey] += amount;
                    }
                } else if (year === 2023) {
                    if (transaction.category !== "Income") {
                        updatedSpendingData2023[monthKey] += amount;
                    }
                } else if (year === 2024) {
                    if (transaction.category !== "Income") {
                        updatedSpendingData2024[monthKey] += amount;
                    }
                }

                // update spending for the current year if it's not an income transaction
                if (transactionDate >= startOfThisYear && transaction.category !== "Income") {
                    thisYearSpending += amount; // total spending this year
                }

                if (transactionDate >= startOfThisWeek) {
                    if (transaction.category === "Income") {
                        thisWeekDeposits += amount;
                    } else {
                        thisWeekSpending += amount;
                    }
                } else if (transactionDate >= startOfLastWeek && transactionDate < startOfThisWeek) {
                    if (transaction.category === "Income") {
                        lastWeekDeposits += amount;
                    } else {
                        lastWeekSpending += amount;
                    }
                }



            });

            setCurrentWeekSpending(thisWeekSpending);
            setPreviousWeekSpending(lastWeekSpending);
            setCurrentWeekDeposits(thisWeekDeposits);
            setPreviousWeekDeposits(lastWeekDeposits);
            setCurrentYearSpending(thisYearSpending);

            const updatedSpendingData: Record<Month, number> = { ...spendingData };
            const updatedEarnedData: Record<Month, number> = { ...earnedData };

            const categorySpending: { [key in TransactionCategory]?: number } = {};

            const vendorSpending: { [vendorName: string]: number } = {};

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
                if (transaction.category === "Income") {
                    updatedEarnedData[monthKey] += amount;
                } else {
                    updatedSpendingData[monthKey] += amount;

                    if (!categorySpending[transaction.category]) {
                        categorySpending[transaction.category] = 0;
                    }
                    categorySpending[transaction.category]! += amount;

                    if (!vendorSpending[transaction.vendorName]) {
                        vendorSpending[transaction.vendorName] = 0;
                    }
                    vendorSpending[transaction.vendorName] += amount;
                }
            });

            //map category spending to an array with colors
            const spendingCategories = (Object.keys(categorySpending) as TransactionCategory[]).map((category) => ({
                name: category,
                displayName: t(category),
                value: categorySpending[category]!,
                color: categoryColors[category],
                icon: categoryIcons[category]
            }));



            //to get the top five vendors
            const popularVendors = Object.keys(vendorSpending)
                .map((vendorName) => ({
                    vendorName,
                    amount: vendorSpending[vendorName]
                }))
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5);

            setSpendingData2022(updatedSpendingData2022);
            setSpendingData2023(updatedSpendingData2023);
            setSpendingData2024(updatedSpendingData2024);
            setEarnedData(updatedEarnedData);
            setSpendingCategories(spendingCategories);
            setMostPopularVendors(popularVendors);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    // handle year change from the dropdown
    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const year = Number(event.target.value);
        setSelectedYear(year); // update selected year
    };

    // toggle between viewing current year and next year
    const handleToggleYearView = () => {
        setViewingNextYear(!viewingNextYear);
        setSelectedYear(selectedYear === 2024 ? 2025 : 2024);
    };



    // effect to fetch transactions when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchTransactions();  // fetch transactions and update state
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchData();  // call fetchdata when the component loads
    }, []);   // empty dependency array means this effect runs once when the component mounts





    // fetch predictions based on transactions
    const fetchPredictions = async () => {
        console.log("Raw Transaction Structure:", transactions[0]);  // log the first transaction to see its structure

        try {
            // filter out any undefined transactions to ensure clean data
            const filteredTransactions = transactions.filter(transaction => transaction !== undefined);
            console.log("Filtered Transactions:", filteredTransactions);

            // map the filtered transactions to the correct format (same structure as Transaction type)
            const formattedTransactions: Transaction[] = filteredTransactions.map(transaction => ({
                transactionId: transaction.transactionId,
                userId: transaction.userId,
                accountId: transaction.accountId,
                vendorName: transaction.vendorName,
                amount: transaction.amount,
                description: transaction.description,
                category: transaction.category,
                date: transaction.date,
            }));

            console.log("Formatted Transactions:", formattedTransactions);

            // send a post request to the flask api to get spending predictions
            const response = await axios.post("http://localhost:5000/api/forecast", {
                transactions: formattedTransactions,  // send the formatted transactions as part of the request
            });

            // update the state with predictions for 2024 and 2025 from the api response
            setPredictions2024(response.data.predictions_2024);
            setPredictions2025(response.data.predictions_2025);

        } catch (error) {
            console.error("Error fetching predictions:", error);
        }
    };



    // effect to fetch predictions when transactions are updated and selected year is 2024 or 2025
    useEffect(() => {
        if (transactions.length > 0 && (selectedYear === 2024 || selectedYear === 2025)) {
            fetchPredictions();  // only fetch predictions if transactions are set and the selected year is 2024 or 2025!!!
        }
    }, [transactions, selectedYear]);  // runs when transactions or selectedYear changes





    // prepare chart data dynamically based on the selected year
    const prepareChartData = () => {
        // use the month type to ensure consistency in month names
        const months: Month[] = [
            "january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"
        ];
        let chartData: { month: string, spending: number | null, predicted: number | null }[] = [];
        // generate chart data for the year 2024
        if (selectedYear === 2024) {
            chartData = months.map((month, index) => ({
                month: t(`spending.month.${month}`),

                // actual data for jan to aug
                spending: index < 8 ? spendingData2024[month] : null,

                // show predicted data from september onwards
                predicted: index >= 8 ? predictions2024.find(prediction => new Date(prediction.date).getMonth() === index)?.amount ?? null : null
            }));
        } else if (selectedYear === 2025) {
            // data for 2025 (only predicted data)
            chartData = months.map((month, index) => ({
                month: t(`spending.month.${month}`),
                spending: null,  //no actual spending for 2025 yet
                predicted: predictions2025[index]?.amount || null,  // predicted data for each month
            }));
        } else if (selectedYear === 2023) {
            // 2023 data actual spending
            chartData = months.map((month) => ({
                month: t(`spending.month.${month}`),
                spending: spendingData2023[month],  // access actual spending data for each month
                predicted: null,
            }));
        } else if (selectedYear === 2022) {
            // 2022 data
            chartData = months.map((month) => ({
                month: t(`spending.month.${month}`),
                spending: spendingData2022[month],
                predicted: null,
            }));
        }

        return chartData;
    };

    // prepare chart data based on the selected year
    const lineGraph = prepareChartData();
    const monthCategories = lineGraph.map((d) => d.month);  // extract month names for the x-axis
    const actualData = lineGraph.map((d) => d.spending);     // extract actual spending data for the line graph
    const predictedData = lineGraph.map((d) => d.predicted);   // extract predicted spending data for the line graph












    const calculatePercentageChange = (current: number, previous: number) => {
        if (previous === 0) return 0; // handle division by zero
        return ((current - previous) / previous) * 100;
    };

    const spendingWeekChange = calculatePercentageChange(currentWeekSpending, previousWeekSpending);
    const depositsWeekChange = calculatePercentageChange(currentWeekDeposits, previousWeekDeposits);

    // -----BAR CHART------
    // prepare data for the bar chart
    const chartData = [
        { month: t("spending.month.january"), spending: spendingData.january, earned: earnedData.january },
        { month: t("spending.month.february"), spending: spendingData.february, earned: earnedData.february },
        { month: t("spending.month.march"), spending: spendingData.march, earned: earnedData.march },
        { month: t("spending.month.april"), spending: spendingData.april, earned: earnedData.april },
        { month: t("spending.month.may"), spending: spendingData.may, earned: earnedData.may },
        { month: t("spending.month.june"), spending: spendingData.june, earned: earnedData.june },
        { month: t("spending.month.july"), spending: spendingData.july, earned: earnedData.july },
        { month: t("spending.month.august"), spending: spendingData.august, earned: earnedData.august },
        { month: t("spending.month.september"), spending: spendingData.september, earned: earnedData.september },
        { month: t("spending.month.october"), spending: spendingData.october, earned: earnedData.october },
        { month: t("spending.month.november"), spending: spendingData.november, earned: earnedData.november },
        { month: t("spending.month.december"), spending: spendingData.december, earned: earnedData.december }
    ];


    const categories = chartData.map((d) => d.month);
    const spendingValues = chartData.map((d) => d.spending);
    const earnedValues = chartData.map((d) => d.earned);

    // ---CALCULATIONS----
    // calculate total spending
    const totalSpent = Object.values(spendingData).reduce((acc, curr) => acc + curr, 0);
    const topThreeCategories = [...spendingCategories].sort((a, b) => b.value - a.value).slice(0, 3);
    const topThreeTotal = topThreeCategories.reduce((sum, category) => sum + category.value, 0);
    const topThreePercentage = totalSpent === 0 ? "0.00" : ((topThreeTotal / totalSpent) * 100).toFixed(2);
    // ----TABLES-----
    //category expenses table
    const categoryExpenses = (
        <>
            <thead>
                <tr>
                    <th scope="col" className="px-4 py-3">
                        {t("spending.category")}
                    </th>
                    <th scope="col" className="px-4 py-3">
                        {t("spending.percentageOfAnnualSpending")}
                    </th>
                    <th scope="col" className="px-4 py-3">
                        {t("spending.amount")}
                    </th>
                </tr>
            </thead>
            <tbody>
                {spendingCategories.map((category) => (
                    <tr key={category.name} style={{ padding: "15px" }}>
                        <th scope="row" style={{ padding: "15px" }}>
                            <CategoryIcon category={category.name} color={category.color} />
                            {category.displayName}
                        </th>
                        <td style={{ padding: "15px" }}>
                            {((category.value / spendingValues.reduce((a, b) => a + b, 0)) * 100).toFixed(2)}%
                        </td>
                        <td style={{ padding: "15px" }}>${category.value.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </>
    );

    //to get the top three purchases
    const topThreePurchases = [...transactions].sort((a, b) => b.amount - a.amount).slice(0, 3);

    // ----GRAPH CUSTOMIZATIONS----

    //for text in the center of the pie chart
    const StyledText = styled("text")(({ theme }) => ({
        fill: theme.palette.text.primary,
        textAnchor: "middle",
        dominantBaseline: "central"
    }));

    const Line1 = styled("tspan")(({ }) => ({
        fontSize: 20
    }));

    const Line2 = styled("tspan")(({ }) => ({

        fontSize: 35,
        fontWeight: "bold",
        dy: "1.6em" // controls the spacing between the lines
    }));

    function PieCenterLabel({ totalSpent }: { totalSpent: number }) {
        const { width, height, left, top } = useDrawingArea();
        return (
            <StyledText x={left + width / 2} y={top + height / 2 - 10}>
                <Line1 dy="-1.0em">{t("spending.totalSpent")}</Line1>
                <Line2 x={left + width / 2} dy="1.2em">
                    ${totalSpent.toLocaleString()}
                </Line2>
            </StyledText>
        );
    }

    return (
        <div className="min-w-screen">
            <div className="flex-1">
                <section className="h-screen ">
                    {/* Title for the page */}
                    <Title>{t("spending.title")}</Title>
                    <div className="flex justify-between gap-x-4 w-full m-0">
                        {[
                            {
                                details: t("spending.spentThisWeek"),
                                price: currentWeekSpending,
                                percentage: spendingWeekChange,
                                icon: Icon.AttachMoney,
                                bgColor: "bg-red-500"
                            },
                            {
                                details: t("spending.depositedThisWeek"),
                                price: currentWeekDeposits,
                                percentage: depositsWeekChange,
                                icon: Icon.CreditCard,
                                bgColor: "bg-green-500"
                            },
                            {
                                details: t("spending.totalSpent"),
                                price: currentYearSpending,
                                percentage: 0,
                                icon: Icon.Api,
                                bgColor: "bg-blue-500"
                            }
                        ].map((card, index) => (
                            <div key={index} className="flex-1 p-6 rounded-xl shadow-md border-[1px] flex">
                                <div className="flex-1 flex items-center">
                                    <div>
                                        <card.icon
                                            className={`text-white ${card.bgColor} rounded-xl p-[5px] text-4xl`}
                                        />
                                        <p className="text-bold pt-5 text-3xl">${card.price.toLocaleString()}</p>
                                        <p className="text-light pt-1 text-xl">{card.details}</p>
                                    </div>
                                </div>
                                <div className="flex items-start justify-end">
                                    <span

                                        className={`text-2xl font-light ${card.percentage >= 0 ? "text-green-500" : "text-red-500"
                                            }`}

                                    >
                                        {card.percentage >= 0 ? (
                                            <Icon.ArrowDropUp
                                                className="inline-block mb-1"
                                                style={{ fontSize: "2rem" }}
                                            />
                                        ) : (
                                            <Icon.ArrowDropDown
                                                className="inline-block mb-1"
                                                style={{ fontSize: "2rem" }}
                                            />
                                        )}
                                        {Math.abs(card.percentage).toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* full width row for chart container */}
                    <div className={`p-4 mt-4 m-0 min-h-[30rem] rounded-xl flex flex-col justify-center items-center shadow-md border-[1px] ${selectedYear === 2025 ? 'bg-slate-900' : 'bg-white'}`}>
                        <div className="mb-4 ml-3 flex w-full justify-between items-center">

                            {/* set the graph title and color based on the selected year */}
                            <h2 className={`text-3xl p-5 pl-8 text-bold ${selectedYear === 2025 ? 'text-white' : 'text-black'}`}>
                                {selectedYear === 2025
                                    ? "Projected Spending for 2025"
                                    : `Spending for ${selectedYear}`}
                            </h2>

                            <div className="flex items-center gap-6 bg-transparent p-4 pr-5">
                                {/* show "See Current Month" button if not 2025 */}
                                {selectedYear !== 2025 && (
                                    <Link to="/dashboard/spending/May" >
                                        <Button type="button" >
                                            {t("spending.seeCurrentMonth")}
                                        </Button>
                                    </Link>
                                )}

                                {/* show year dropdown if not 2025 */}
                                {selectedYear !== 2025 && (
                                    <Select
                                        id="year-select"
                                        name="year-select"
                                        value={selectedYear}
                                        onChange={handleYearChange}
                                        style={{
                                            padding: "0.5rem",
                                            width: "10rem",
                                            backgroundColor: "transparent",
                                            border: "1px solid black",
                                            borderRadius: "4px",
                                            appearance: "none",
                                            marginTop: "-1.5px", //push dropdown up a little bit
                                        }}
                                    >
                                        {yearOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Select>
                                )}

                                {/* button to toggle between years */}
                                {/* change button color if on year 2025 */}
                                <Button
                                    type="button"
                                    style={{
                                        backgroundColor: viewingNextYear ? "white" : "black",
                                        color: viewingNextYear ? "black" : "white",
                                        border: viewingNextYear ? "1px solid white" : "1px solid black",
                                    }}
                                    onClick={handleToggleYearView}
                                >
                                    {viewingNextYear ? "Back to 2024 Spending" : "View 2025 Predictions"}
                                </Button>

                            </div>
                        </div>


                        <div className="flex items-center mb-2 justify-start w-full">
                            <LineChart
                                xAxis={[
                                    { scaleType: "band", data: monthCategories, categoryGapRatio: 0.5 } as AxisConfig<"band">
                                ]}


                                series={[
                                    {
                                        data: selectedYear === 2024 ? actualData.slice(0, 9) : actualData,  // only actual data until August for 2024, or full year for other years
                                        label: 'Actual Spending',
                                        id: 'actualId',  // ID for data series to apply styles
                                        color: '#1F4B99'
                                    },
                                    {
                                        data: selectedYear === 2024 ? predictedData : selectedYear === 2025 ? predictedData : [],  // predicted data for 2024 and 2025
                                        label: 'Projected Spending',
                                        id: 'predictedId',
                                        color: selectedYear === 2025 ? '#66CDAA' : '#FF8C00', // Use lighter color for predictions in 2025
                                    }
                                ]}
                                grid={{
                                    horizontal: true //horizonatal grid lines
                                }}
                                width={1400}
                                height={450}

                                slotProps={{
                                    legend: {
                                        hidden: selectedYear === 2025,  // hide legend if year 2025
                                    }
                                }}
                                sx={{
                                    [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
                                        strokeWidth: 2,  // stroke width for all lines
                                    },
                                    '.MuiLineElement-series-predictedId': {
                                        strokeDasharray: '5 5',  // dashed line for predicted data
                                        strokeWidth: 12,  // stroke width for predicted data
                                    },
                                    '.MuiLineElement-series-actualId': {
                                        strokeDasharray: '0',  // solid line for actual data
                                        strokeWidth: 6,
                                    },
                                    [`.${markElementClasses.root}:not(.${markElementClasses.highlighted})`]: {
                                        fill: '#fff',  // fill color for non-highlighted marks
                                    },
                                    [`& .${markElementClasses.highlighted}`]: {
                                        stroke: 'none',  // remove stroke for highlighted marks
                                    },
                                    '& .MuiChartsAxis-label': {
                                        fontSize: '25px', // font size for axis labels
                                        fill: selectedYear === 2025 ? 'white' : 'black', // white label color for 2025
                                    },
                                    '& .MuiChartsTick-label': {
                                        fontSize: '25px', // font size for tick labels
                                        fill: selectedYear === 2025 ? 'white' : 'black', // white tick label color for 2025
                                    },
                                    // grid line color based on the selected year????
                                    '& .MuiChartsAxis-root': {
                                        stroke: selectedYear === 2025 ? 'white' : 'gray',
                                    },
                                    // custom styling for the grid lines
                                    '& .MuiChartsGrid-root line': {
                                        stroke: selectedYear === 2025 ? '#4B4B4B' : '#d3d3d3', // color of the grid lines
                                        strokeWidth: selectedYear === 2025 ? 1.5 : 1.5, // thickness of the grid lines
                                    },


                                }}
                            />


                            {/* <LineChart
                                xAxis={[
                                    { scaleType: "band", data: monthCategories, categoryGapRatio: 0.5 } as AxisConfig<"band">
                                ]}
                                series={[
                                    {
                                        data: actualData,
                                        color: "#1f78b4", // Adjust color as needed
                                        label: t("spending.actual"),
                                    },
                                    {
                                        data: predictedData,
                                        color: "#FF6384", // Adjust color as needed
                                        label: selectedYear === 2025 ? t("spending.predicted2025") : t("spending.predicted"),
                                    },
                                ]}
                                grid={{ horizontal: true }}
                                width={1400}
                                height={400}
                            /> */}





                        </div>
                    </div>

                    {/* Second row with two columns */}
                    <div className="flex pt-1 gap-3">
                        <div className="flex flex-col justify-center items-center flex-2 p-2 m-0 mt-2 min-h-[40rem] rounded-xl shadow-md border-[1px] w-full sm:w-2/3 md:w-1/2 lg:w-1/2 ">
                            {spendingCategories.length > 0 ? (

                                <div className="relative w-full h-full ml-12" style={{ minHeight: "610px", minWidth: "610px" }}>

                                    <PieChart
                                        series={[
                                            {
                                                data: spendingCategories.map((d) => ({
                                                    label: d.displayName,
                                                    id: d.name,
                                                    value: d.value,
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
                                                arcLabelMinAngle: 35,
                                                valueFormatter: (v) => `$ ${v.value.toLocaleString()}`
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
                                            }
                                        }}
                                    >
                                        <PieCenterLabel totalSpent={totalSpent} />
                                    </PieChart>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full h-full text-xl">
                                    {t("spending.no-data")}
                                    <Button
                                        type="button"
                                        onClick={() => navigate("/dashboard/transactions")}
                                        className="mt-4"
                                    >
                                        {t("transactions.add-transaction")}
                                    </Button>
                                </div>
                            )}
                            <div className="w-full">
                                <Table bordered={false} className="w-full">
                                    {categoryExpenses}
                                </Table>
                            </div>
                        </div>
                        {/* section for more insights -> top expenses..and?? */}

                        <div className="flex flex-col justify-center mt-3 gap-x-4 items-center flex-1 w-10/12 min-h-[30rem] sm:w-1/3 md:w-1/2 lg:w-full  ">
                            {/* Top Categories components */}
                            <div className="w-full m-1 p-4 rounded-xl shadow-md border-[0.5px] border-l-8 border-gray-500 bg-white text-gray-800">
                                <p className="text-xl">
                                    {t("spending.topCategories")}{" "}
                                    <span className="font-bold text-2xl mx-2">{topThreePercentage}%</span>{" "}
                                    {t("spending.spendingYear")}.
                                </p>
                            </div>

                            {[...spendingCategories]
                                .sort((a, b) => b.value - a.value)
                                .slice(0, 1)
                                .map((category, index) => (
                                    <div
                                        key={index}
                                        className="w-full m-2 p-7 rounded-xl shadow-md border-[1px] flex items-center"
                                        style={{ backgroundColor: category.color }}
                                    >
                                        <div className="flex flex-col items-start">
                                            <div className="flex items-center">
                                                <div className="flex items-center justify-center w-10 h-10 border text-white rounded-full text-xl font-bold mr-3">
                                                    1
                                                </div>
                                                <p className="text-white text-bold text-2xl mt-2 mb-1">
                                                    {" "}
                                                    {t("spending.top-category")}
                                                </p>
                                            </div>

                                            <p className="text-white flex-wrap mt-2 max-w-[90%] text-light pt-1 text-xl">
                                                {" "}
                                                {t("spending.youSpent")}{" "}
                                                <span className="text-2xl font-bold">{category.displayName}</span>{" "}
                                                {t("spending.thisYear")}.
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <category.icon className="text-white rounded-xl p-[5px] text-5xl" />
                                            <p className="text-white text-bold pt-5 text-3xl">
                                                ${category.value.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                            <div className="flex justify-between gap-x-4 w-full m-2">
                                {[...spendingCategories]
                                    .sort((a, b) => b.value - a.value)
                                    .slice(1, 3)
                                    .map((category, index) => (
                                        <div
                                            key={index}
                                            className="flex-1 p-6 rounded-xl shadow-md border-[1px] flex"
                                            style={{ backgroundColor: category.color }}
                                        >
                                            <div className="flex-1 flex items-center justify-between">
                                                <div>
                                                    <category.icon className="text-white rounded-xl p-[5px] text-4xl" />
                                                    <p className="text-white text-bold pt-5 text-3xl">
                                                        ${category.value.toLocaleString()}
                                                    </p>
                                                    <p className="text-white text-light pt-1 text-xl">
                                                        {category.displayName}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-center w-10 h-10 border text-white rounded-full text-2xl font-bold ml-4 mb-20">
                                                    {index + 2}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <div className="flex flex-col md:flex-row justify-between w-full min-h-[30rem] gap-x-4 m-2">
                                {/* Top Purchases Section */}
                                <div className="flex flex-col justify-center items-center flex-1 p-4 m-2 rounded-xl shadow-md border-[1px] w-full ">
                                    <div className="flex flex-col gap-y-7 w-full">
                                        <h2 className="text-xl text-center">
                                            {" "}
                                            {t("spending.topPurchases")}
                                        </h2>
                                        {topThreePurchases.map((expense, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 m-2 bg-blue-100 rounded-xl shadow-md border-[1px]"
                                            >
                                                <div className="flex items-center">
                                                    <div className="flex items-center justify-center w-10 h-10 text-black rounded-full text-1xl border font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <div className="ml-4 ">
                                                        <p className="text-xl">
                                                            {new Date(expense.date).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-lg ">{expense.vendorName}</p>
                                                        <p className="text-2xl font-semibold">
                                                            ${expense.amount.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Most Popular Vendors Section */}
                                <div className="flex flex-col justify-center items-center flex-1 p-4 m-3 w-full rounded-xl shadow-md border-[1px]  ">
                                    <div className="flex items-center mb-4">
                                        <h2 className="text-2xl text-[#0A5CBA] mr-2">
                                            {" "}
                                            {t("spending.top-vendors")}
                                        </h2>
                                        <div className="relative group"></div>
                                    </div>

                                    <div className="flex flex-col w-full gap-4">
                                        {mostPopularVendors.slice(0, 4).map((vendor, index) => (
                                            <div
                                                key={vendor.vendorName}
                                                className="flex items-center justify-between p-4 m-2 rounded-full shadow-md border-[1px] bg-white text-[#0A5CBA]  w-full"
                                            >
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <p className="text-xl font-bold">{vendor.vendorName}</p>
                                                        <p className="text-lg">${vendor.amount.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-center w-10 h-10 bg-[#0A5CBA] text-white  rounded-full text-xl font-bold ml-4">
                                                    {index + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div >
        </div >
    );
};

export default Spending;
