import { Button, Icon, Table, Title } from "@trussworks/react-uswds";
import React, { useEffect, useState } from "react";
import { AxisConfig, useDrawingArea } from "@mui/x-charts";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { styled } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";
import { Link, useNavigate } from "react-router-dom";
import CategoryIcon, { categoryIcons } from "../../components/CategoryIcon";
import { TransactionCategory, Transaction } from "../../types/models";
import { useTranslation } from "react-i18next";

//import axios from "axios";

import { getTransactionByUserId } from "../../utils/transactionService";

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

// define the type for spending categories

type SpendingCategory = {
    displayName: any;
    name: TransactionCategory;
    value: number;
    color: string;
    icon: React.ElementType;
};



const Spending: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [mostPopularVendors, setMostPopularVendors] = useState<{ vendorName: string; amount: number }[]>([]);
    const [spendingCategories, setSpendingCategories] = useState<SpendingCategory[]>([]);
    const [currentWeekSpending, setCurrentWeekSpending] = useState<number>(0);
    const [previousWeekSpending, setPreviousWeekSpending] = useState<number>(0);
    const [currentWeekDeposits, setCurrentWeekDeposits] = useState<number>(0);
    const [previousWeekDeposits, setPreviousWeekDeposits] = useState<number>(0);
    const [currentYearSpending, setCurrentYearSpending] = useState<number>(0);

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
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const transactions = await getTransactionByUserId(1);
                setTransactions(transactions);

                const now = new Date();
                const startOfThisWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                const startOfLastWeek = new Date(new Date(startOfThisWeek).setDate(startOfThisWeek.getDate() - 7));
                const startOfThisYear = new Date(new Date().getFullYear(), 0, 1);

                let thisWeekSpending = 0;
                let lastWeekSpending = 0;
                let thisWeekDeposits = 0;
                let lastWeekDeposits = 0;
                let thisYearSpending = 0;

                transactions.forEach((transaction) => {
                    const transactionDate = new Date(transaction.date);
                    const amount = transaction.amount;

                    if (transactionDate >= startOfThisYear && transaction.category !== "Income") {
                        thisYearSpending += amount; // Total spending this year
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

                setSpendingData(updatedSpendingData);
                setEarnedData(updatedEarnedData);
                setSpendingCategories(spendingCategories);
                setMostPopularVendors(popularVendors);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, [t]);

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
                    {/* <div className="mb-4 ml-3"> */}
                    <Title>{t("spending.title")}</Title>
                    {/* <h2 className="text-[2.3rem] mb-10 pt-2 text-bold">{t("spending.title")}</h2> */}
                    {/* <h2 className="text-2xl text-light">Your total spending this year is</h2>
                        <p className="text-4xl font-semibold">${totalSpent.toFixed(2)}</p> */}
                    {/* </div> */}
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
                            <div key={index} id="spending-header-cards" className="flex-1 p-6 rounded-xl shadow-md border-[1px] flex">
                                <div className="flex-1 flex items-center">
                                    <div>
                                        <card.icon
                                            className={`text-white ${card.bgColor} rounded-xl p-[5px] text-4xl`} data-testid={`icon-${index}`}
                                        />
                                        <p className="text-bold pt-5 text-3xl" data-testid={`price-${index}`}>${card.price.toLocaleString()}</p>
                                        <p className="text-light pt-1 text-xl" data-testid={`details-${index}`}>{card.details}</p>
                                    </div>
                                </div>
                                <div className="flex items-start justify-end">
                                    <span

                                        className={`text-2xl font-light ${card.percentage >= 0 ? "text-green-500" : "text-red-500"
                                            }`}
                                        data-testid={`percentage-${index}`}
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

                    {/* Full-width row */}
                    <div className="p-4 mt-4 m-0 min-h-[30rem] rounded-xl flex flex-col justify-center items-center shadow-md border-[1px]">
                        <div className="mb-4 ml-3 flex w-full justify-between items-center">
                            <h2 className="text-3xl p-5 pl-8 text-bold">{t("spending.graphTitle")}</h2>
                            <div>
                                <Link to="/dashboard/spending/May" className="mr-3 pr-8">
                                    <Button id="see-current-month-button" type="button" className="ml-3">
                                        {t("spending.seeCurrentMonth")}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div id="spending-earnings-graph" className="flex items-center mb-2 justify-start w-full">
                            <LineChart
                                xAxis={[
                                    { scaleType: "band", data: categories, categoryGapRatio: 0.5 } as AxisConfig<"band">
                                ]}

                                series={[
                                    {
                                        data: earnedValues,
                                        color: "#BCC3CB",
                                        label: t("spending.earned")
                                        // area: true,
                                        //stack: "total"
                                    },
                                    {
                                        data: spendingValues,
                                        color: "#1f78b4",
                                        label: t("spending.spendings")
                                        //area: true,
                                        //stack: "total"
                                    }
                                ]}
                                grid={{ horizontal: true }}
                                width={1400}
                                height={400}
                            //onItemClick={handleItemClick} //this lets you click on the bars
                            />
                        </div>
                    </div>

                    {/* Second row with two columns */}
                    <div className="flex pt-1 gap-3">
                        <div className="flex flex-col justify-center items-center flex-2 p-2 m-0 mt-2 min-h-[40rem] rounded-xl shadow-md border-[1px] w-full sm:w-2/3 md:w-1/2 lg:w-1/2 ">
                            {spendingCategories.length > 0 ? (

                                <div id="spending-pie-chart" className="relative w-full h-full ml-12" style={{ minHeight: "610px", minWidth: "610px" }}>

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

                        <div id="top-categories-purchases-vendors" className="flex flex-col justify-center mt-3 gap-x-4 items-center flex-1 w-10/12 min-h-[30rem] sm:w-1/3 md:w-1/2 lg:w-full  ">
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
