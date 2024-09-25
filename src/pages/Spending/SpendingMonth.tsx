import { Button, Icon, Table, Select } from "@trussworks/react-uswds";
import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { AxisConfig, legendClasses, useDrawingArea } from "@mui/x-charts";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { styled } from "@mui/material/styles";
//import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import CategoryIcon from "../../components/CategoryIcon";
import { TransactionCategory, Transaction } from "../../types/models";
import { useTranslation } from "react-i18next";
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




const SpendingMonth: React.FC = () => {
    const { t } = useTranslation();
    const { month } = useParams<{ month: Month }>(); //get month parameter from url
    const lowercaseMonth = month?.toLowerCase() as Month; //need to make the month name lowercase
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [weeklyData, setWeeklyData] = useState<{ week: number; spending: number; earning: number }[]>([]);
    const [spendingCategories, setSpendingCategories] = useState<
        {
            displayName: any;
            name: TransactionCategory;
            value: number;
            color: string;
        }[]
    >([]);

    const [currentMonthSpending, setCurrentMonthSpending] = useState(0);
    const [previousMonthSpending, setPreviousMonthSpending] = useState(0);


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

    // capitalize first letter of the month
    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // translated month
    const getTranslatedMonth = (month: Month) => {
        const translatedMonth = t(`${month}`);
        return capitalizeFirstLetter(translatedMonth);
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
                const transactions = await getTransactionByUserId(1);
                setTransactions(transactions);

                const currentMonthIndex = getMonthIndex(lowercaseMonth);

                const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;

                const currentMonthTransactions = transactions.filter(
                    (transaction) => new Date(transaction.date).getMonth() === currentMonthIndex
                );
                const previousMonthTransactions = transactions.filter(
                    (transaction) => new Date(transaction.date).getMonth() === previousMonthIndex
                );

                const currentSpending = currentMonthTransactions.reduce(
                    (sum, transaction) => sum + (transaction.category !== "Income" ? transaction.amount : 0),
                    0
                );
                const previousSpending = previousMonthTransactions.reduce(
                    (sum, transaction) => sum + (transaction.category !== "Income" ? transaction.amount : 0),
                    0
                );

                setCurrentMonthSpending(currentSpending);
                setPreviousMonthSpending(previousSpending);

                const weeklySpending: { [key: number]: number } = {};
                const weeklyEarning: { [key: number]: number } = {};

                setTransactions(currentMonthTransactions);

                //get weekly earning and spending
                currentMonthTransactions.forEach((transaction: Transaction) => {
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
                const weeksInMonth = getAllWeeksInMonth(year, currentMonthIndex);

                //prepare spending and earning data for the bar chart
                const data = weeksInMonth.map((week) => ({
                    week,
                    spending: weeklySpending[week] || 0,
                    earning: weeklyEarning[week] || 0
                }));

                setWeeklyData(data);

                //calculate spending by category
                const categorySpending: { [key in TransactionCategory]?: number } = {};
                const vendorSpending: { [vendorName: string]: number } = {};

                currentMonthTransactions.forEach((transaction: Transaction) => {
                    if (transaction.category !== "Income") {
                        if (!categorySpending[transaction.category]) {
                            categorySpending[transaction.category] = 0;
                        }
                        categorySpending[transaction.category]! += transaction.amount;

                        if (!vendorSpending[transaction.vendorName]) {
                            vendorSpending[transaction.vendorName] = 0;
                        }
                        vendorSpending[transaction.vendorName] += transaction.amount;
                    }
                });

                //prepare category data for pie chart
                const spendingCategories = (Object.keys(categorySpending) as TransactionCategory[]).map((category) => ({
                    name: category,
                    displayName: t(category),
                    value: categorySpending[category]!,
                    color: categoryColors[category]
                }));

                setSpendingCategories(spendingCategories);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, [month, t]);

    //total spending for the month
    const totalSpending = transactions.reduce(
        (sum, transaction) => (transaction.category !== "Income" ? sum + transaction.amount : sum),
        0
    );
    const spendingDifference = currentMonthSpending - previousMonthSpending;
    const percentageChange = previousMonthSpending === 0
        ? "0.00"
        : Math.abs((spendingDifference / previousMonthSpending) * 100).toFixed(2);

    const isSpendingIncreased = spendingDifference > 0;





    //category expenses table
    const categoryExpenses = (
        <>
            <thead>
                <tr>
                    <th scope="col">{t("spending.category")}</th>
                    <th scope="col">{t("spending.percentageOfMonthlySpending")}</th>
                    <th scope="col">{t("spending.amount")}</th>
                </tr>
            </thead>
            <tbody>
                {spendingCategories.map((category) => (
                    <tr key={category.name} style={{ padding: "20px" }}>
                        <th scope="row" style={{ padding: "20px" }}>
                            <CategoryIcon category={category.name} color={category.color} />
                            {category.displayName}
                        </th>
                        <td style={{ padding: "20px" }}>{((category.value / totalSpending) * 100).toFixed(2)}%</td>
                        <td style={{ padding: "20px" }}>${category.value.toFixed(2)}</td>
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

    const Line1 = styled("tspan")(({ }) => ({
        fontSize: 20
    }));

    const Line2 = styled("tspan")(({ }) => ({

        fontSize: 35,
        fontWeight: "bold",
        dy: "1.6em" // controls the spacing between the lines
    }));

    function PieCenterLabel({ totalSpending }: { totalSpending: number }) {
        const { width, height, left, top } = useDrawingArea();
        return (
            <StyledText x={left + width / 2} y={top + height / 2 - 10}>
                <Line1 dy="-1.0em">{t("spending.totalSpentWeek")}</Line1>
                <Line2 x={left + width / 2} dy="1.2em">
                    ${totalSpending.toFixed(2)}
                </Line2>
            </StyledText>
        );
    }

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMonth = event.target.value as Month;
        navigate(`/dashboard/spending/${selectedMonth}`);
    };

    const monthOptions = monthNames.map((month) => ({
        value: month,
        label: getTranslatedMonth(month)
    }));

    return (
        <div className="min-w-screen">
            <div className="flex-1">
                <section className="h-screen">

                    {/* Title for the page */}
                    <div className="mb-6">
                        <h2 id="spending-month-title" className="ml-3 py-4 pt-10 text-bold text-3xl opacity-70">
                            {t(`spending.month.${lowercaseMonth}`)} {t("spending.spending")}
                        </h2>

                        <div id="month-spending" className="flex items-center">
                            <p className="text-5xl pl-2 font-semibold">${currentMonthSpending.toFixed(2)}</p>
                            <div className="flex items-center ml-5">
                                <p
                                    className={`text-2xl font-semibold ${isSpendingIncreased ? "text-red-600" : "text-green-600"
                                        }`}
                                >
                                    {isSpendingIncreased ? (
                                        <Icon.ArrowDropUp className="inline-block mr-1" style={{ fontSize: "2rem" }} />
                                    ) : (
                                        <Icon.ArrowDropDown
                                            className="inline-block mr-1"
                                            style={{ fontSize: "2rem" }}
                                        />
                                    )}
                                    {percentageChange}% {t("spending.from")}{" "}

                                    {t(
                                        `spending.month.${getPreviousMonth(lowercaseMonth)}`)}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Full-width row */}
                    <div className=" p-4 m-2 min-h-[30rem] rounded-xl flex flex-col justify-center items-center shadow-md border-[1px]">
                        <div className="flex items-center justify-between w-full mb-4 pl-6">
                            <div className="flex items-center gap-4 bg-transparent p-4">
                                <Link to="/dashboard/spending" className="mr-3">
                                    <Button id="back-to-spending-btn" type="button" className="ml-3">
                                        {t("spending.backToAnnualSpendingOverview")}
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex items-center gap-4 bg-transparent p-4 pr-10">
                                <Select
                                    id="month-select"
                                    name="month-select"
                                    defaultValue={lowercaseMonth}
                                    onChange={handleMonthChange}
                                    style={{
                                        padding: "0.5rem",
                                        width: "10rem",
                                        backgroundColor: "transparent",
                                        border: "1px solid black",
                                        borderRadius: "4px",
                                        appearance: "none"
                                    }}
                                >
                                    {monthOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {t(`spending.month.${option.label}`)}
                                        </option>
                                    ))}

                                </Select>
                            </div>
                        </div>

                        <div id="spending-month-bar-chart" className="flex items-center mb-2 justify-start w-full">
                            <BarChart
                                xAxis={[
                                    {
                                        scaleType: "band",
                                        data: weeklyData.map((d) => `${t("spending.week")} ${d.week}`),
                                        categoryGapRatio: 0.5
                                    } as AxisConfig<"band">
                                ]}
                                series={[
                                    {
                                        data: weeklyData.map((d) => d.earning),
                                        color: "#cbd5e8",
                                        label: t("spending.earnings")
                                    },
                                    {
                                        data: weeklyData.map((d) => d.spending),
                                        color: "#1f78b4",
                                        label: t("spending.spendings")
                                    }
                                ]}

                                grid={{ horizontal: true }}
                                width={1400}
                                height={400}
                            />
                        </div>


                    </div>

                    {/* Second row with two columns */}
                    <div className="flex">
                        <div className="flex flex-col justify-center items-center flex-3 p-4 m-2 min-h-[40rem] rounded-xl shadow-md border-[1px]">
                            {spendingCategories.length > 0 ? (
                                <div
                                    id="spending-month-pie-chart"
                                    className="relative w-full h-full"
                                    style={{ minHeight: "600px", minWidth: "600px" }}
                                >
                                    <PieChart
                                        series={[
                                            {
                                                data: spendingCategories.map((d) => ({
                                                    label: d.displayName,
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

                                                arcLabelMinAngle: 35,

                                                valueFormatter: (v) => {
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
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SpendingMonth;