// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Button, Icon, Table, Title } from "@trussworks/react-uswds";
import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { AxisConfig, BarItemIdentifier, DefaultizedPieValueType, legendClasses, useDrawingArea } from "@mui/x-charts";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { styled } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CategoryIcon, { categoryIcons } from "../../components/CategoryIcon";
import { TransactionCategory, Transaction } from "../../types/models";
import { useTranslation } from 'react-i18next';

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
//this is for icons on the pie chart
//but it's not working. so maybe go back to the way it was before
type SpendingCategory = {
    name: TransactionCategory;
    value: number;
    color: string;
    icon: React.ElementType;
};

const Spending: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showTooltip, setShowTooltip] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [mostPopularVendors, setMostPopularVendors] = useState<{ vendorName: string; amount: number }[]>([]);
    const [spendingCategories, setSpendingCategories] = useState<SpendingCategory[]>([]);

    //colors for each category
    const categoryColors: { [key in TransactionCategory]: string } = {
        [TransactionCategory.GROCERIES]: "#90c8f4",
        [TransactionCategory.ENTERTAINMENT]: "#e5d23a",
        [TransactionCategory.DINING]: "#6ed198",
        [TransactionCategory.TRANSPORTATION]: "#af98f9",
        [TransactionCategory.HEALTHCARE]: "#fd6d6d",
        [TransactionCategory.LIVING_EXPENSES]: "#5a7ffa",
        [TransactionCategory.SHOPPING]: "#fe992b",
        [TransactionCategory.INCOME]: "#f7b7e5",
        [TransactionCategory.MISC]: "#dce2e1"
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
                const response = await axios.get<Transaction[]>("http://localhost:8083/transactions/user/1");
                console.log(response.data);
                const transactions = response.data;
                setTransactions(transactions);
                console.log("Fetched transactions:", transactions);
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
    }, []);

    // -----BAR CHART------
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

    // ---CALCULATIONS----
    // calculate total spending
    const totalSpent = Object.values(spendingData).reduce((acc, curr) => acc + curr, 0);
    const topThreeCategories = [...spendingCategories].sort((a, b) => b.value - a.value).slice(0, 3);
    const topThreeTotal = topThreeCategories.reduce((sum, category) => sum + category.value, 0);
    const topThreePercentage = ((topThreeTotal / totalSpent) * 100).toFixed(2);

    // ----TABLES-----
    //category expenses table
    const categoryExpenses = (
        <>
            <thead>
                <tr>
                    <th scope="col" className="px-4 py-3">
                        Category
                    </th>
                    <th scope="col" className="px-4 py-3">
                        % of Annual Spending
                    </th>
                    <th scope="col" className="px-4 py-3">
                        Amount
                    </th>
                </tr>
            </thead>
            <tbody>
                {spendingCategories.map((category) => (
                    <tr key={category.name} style={{ padding: "15px" }}>
                        <th scope="row" style={{ padding: "15px" }}>
                            <CategoryIcon category={category.name} color={category.color} />
                            {category.name}
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

    //top three expense categories table
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

    //to get the top three purchases
    const topThreePurchases = [...transactions].sort((a, b) => b.amount - a.amount).slice(0, 3);
    const topPurchaseTotal = topThreePurchases.reduce((sum, expense) => sum + expense.amount, 0);
    const topPurchasePercentage = ((topPurchaseTotal / totalSpent) * 100).toFixed(2);

    // top three purchases table
    const topPurchases = (
        <>
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Vendor</th>
                    <th scope="col">Amount</th>
                </tr>
            </thead>
            <tbody>
                {topThreePurchases.map((expense) => (
                    <tr>
                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                        <td>{expense.vendorName}</td>
                        <td>${expense.amount.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </>
    );

    //top 5 vendors table
    const popularVendorsTable = (
        <>
            <thead>
                <tr>
                    <th scope="col">Vendor</th>
                    <th scope="col">Amount</th>
                </tr>
            </thead>
            <tbody>
                {mostPopularVendors.map((vendor) => (
                    <tr key={vendor.vendorName}>
                        <th scope="row">{vendor.vendorName}</th>
                        <td>${vendor.amount.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </>
    );

    // ----GRAPH CUSTOMIZATIONS----
    //click on the bar in the bar chart to go to a specific month
    const handleItemClick = (event: React.MouseEvent<SVGElement>, barItemIdentifier: BarItemIdentifier) => {
        const { dataIndex } = barItemIdentifier;
        const month = categories[dataIndex];
        navigate(`/dashboard/spending/${month}`);
    };

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

    function PieCenterLabel({ totalSpent }: { totalSpent: number }) {
        const { width, height, left, top } = useDrawingArea();
        return (
            <StyledText x={left + width / 2} y={top + height / 2 - 10}>
                <Line1 dy="-1.0em">TOTAL SPENT</Line1>
                <Line2 x={left + width / 2} dy="1.2em">
                    ${totalSpent.toFixed(2)}
                </Line2>
            </StyledText>
        );
    }

    //put icons in the pie chart instead of word label
    //THIS ISN'T WORKING!!!!!! TRY AGAIN LATER.
    const calculateCentroid = (startAngle: any, endAngle: any, innerRadius: any, outerRadius: any) => {
        const angle = (startAngle + endAngle) / 2;
        const radians = (angle * Math.PI) / 180;
        const x = ((outerRadius + innerRadius) / 2) * Math.cos(radians);
        const y = ((outerRadius + innerRadius) / 2) * Math.sin(radians);
        return { x, y };
    };

    const CustomLabel = ({
        x,
        y,
        icon: IconComponent,
        label
    }: {
        x: number;
        y: number;
        icon: React.ElementType;
        label: string;
    }) => (
        <foreignObject x={x} y={y} width="100" height="30">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconComponent style={{ marginRight: 4 }} />
                <span>{label}</span>
            </div>
        </foreignObject>
    );

    const calculateAngles = (data: SpendingCategory[]) => {
        let startAngle = 0;
        return data.map((d: { value: any }) => {
            const value = d.value;
            const angle = (value / totalSpent) * 360;
            const endAngle = startAngle + angle;
            const result = { ...d, startAngle, endAngle }; //this ensures that name, value, color and icon are retained
            startAngle = endAngle;
            return result;
        });
    };

    const dataWithAngles = calculateAngles(spendingCategories);

    return (
        <div className="min-w-screen mt-10">
            <div className="flex-1">
                <section className="h-screen ">
                    {/* Title for the page */}
                    {/* <div className="mb-4">
                        <Title className="ml-3">Spending Overview</Title>
                        <p className="text-6xl font-semibold">${totalSpent.toFixed(2)}</p>
                    </div> */}


                    <div className="mb-4 ml-3">
                        <h2 className="text-[2.3rem] mb-10 pt-2 text-bold">{t('spending.title')}</h2>
                        {/* <h2 className="text-2xl text-light">Your total spending this year is</h2>
                        <p className="text-4xl font-semibold">${totalSpent.toFixed(2)}</p> */}
                    </div>

                    <div className="flex justify-between gap-x-4 w-full m-2">
                        {[
                            { details: t('spending.spentThisWeek'), price: 4523.77, percentage: 5.2, icon: Icon.AttachMoney, bgColor: "bg-red-500" },
                            { details: t('spending.depositedThisWeek'), price: 6233.21, percentage: -3.4, icon: Icon.CreditCard, bgColor: "bg-green-500" },
                            { details: t('spending.spentThisYear'), price: 43224.27, percentage: 10.1, icon: Icon.Api, bgColor: "bg-blue-500" }
                        ].map((card, index) => (
                            <div key={index} className="flex-1 p-6 rounded-xl shadow-md border-[1px] flex">
                                <div className="flex-1 flex items-center">
                                    <div>
                                        <card.icon className={`text-white ${card.bgColor} rounded-xl p-[5px] text-4xl`} />
                                        <p className="text-bold pt-5 text-3xl">${card.price.toLocaleString()}</p>
                                        <p className="text-light pt-1 text-xl">{card.details}</p>
                                    </div>
                                </div>
                                <div className="flex items-start justify-end">
                                    <span className={`text-2xl font-light ${card.percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {card.percentage >= 0 ? (
                                            <Icon.ArrowDropUp className="inline-block mb-1" style={{ fontSize: "2rem" }} />
                                        ) : (
                                            <Icon.ArrowDropDown className="inline-block mb-1" style={{ fontSize: "2rem" }} />
                                        )}
                                        {Math.abs(card.percentage)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>



                    {/* Full-width row */}
                    <div className="p-4 mt-4 m-2 min-h-[30rem] rounded-xl flex flex-col justify-center items-center shadow-md border-[1px]">
                        <div className="mb-4 ml-3 flex w-full justify-between items-center">
                            <h2 className="text-3xl p-5 pl-8 text-bold">Spendings</h2>
                            <div>
                                <span
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                    className="relative"
                                >
                                    <Icon.Help style={{ color: "#74777A", fontSize: "1.7rem", marginRight: "0.8rem" }} />
                                    {/* render tooltip conditionally */}
                                    {showTooltip && (
                                        <div className="absolute left-8 top-0 bg-gray-200 p-2 rounded shadow-md w-60">
                                            {t('spending.clickBarForDetails')}
                                        </div>
                                    )}
                                </span>
                                <Link to="/dashboard/spending/May" className="mr-3 pr-8">
                                    <Button type="button" className="ml-3">
                                        {t('spending.seeCurrentMonth')}
                                    </Button>
                                </Link>

                            </div>
                        </div>
                        <div className="flex items-center mb-2 justify-start w-full">
                            <LineChart
                                xAxis={[
                                    { scaleType: "band", data: categories, categoryGapRatio: 0.5 } as AxisConfig<"band">
                                ]}

                                series={[
                                    {
                                        data: earnedValues,
                                        color: "#BCC3CB",
                                        label: "Earned"
                                        // area: true,
                                        //stack: "total"
                                    },
                                    {
                                        data: spendingValues,
                                        color: "#1f78b4",
                                        label: "Spendings"
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
                        <div className="flex flex-col justify-center items-center flex-2 p-4 m-2 min-h-[40rem] rounded-xl shadow-md border-[1px]">
                            <h2></h2>
                            <div className="relative w-full h-full sm:w-1/2 sm:h-1/2 md:w-3/4 md:h-3/4 lg:w-full lg:h-full lg:-m-2">
                                <PieChart
                                    series={[
                                        {
                                            data: spendingCategories.map((d) => ({
                                                label: d.name,
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

                                            arcLabelMinAngle: 20,

                                            valueFormatter: (v) => `$ ${v.value}`
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
                                {/*
                                {dataWithAngles.map((d, index) => {
                                    const { x, y } = calculateCentroid(d.startAngle, d.endAngle, 48, 95);
                                    return (
                                        <CustomLabel
                                            key={index}
                                            x={x}
                                            y={y}
                                    icon={d.icon}   
                                            label={`${((d.value / totalSpent) * 100).toFixed(0)}%`}
                                        />
                                    );
                                })}
                                */}
                            </div>
                            <div className="w-full">
                                <Table bordered={false} className="w-full">
                                    {categoryExpenses}
                                </Table>
                            </div>
                        </div>
                        {/* section for more insights -> top expenses..and?? */}

                        <div className="flex flex-col justify-center items-center flex-1 w-10/12 min-h-[30rem] ">
                            {/* Top Purchases Table */}

                            <div className="flex flex-col justify-center items-center flex-1  p-4 m-2 rounded-xl shadow-lg border-[1px] w-full">
                                <h2 className="text-2xl mb-2">{t('spending.topThreePurchases')}</h2>
                                <h2 className="mb-3 text-4x1  text-center">
                                    {t('spending.topThreePurchases')}
                                    <span className="text-3xl font-bold text-blue-600">
                                        {" "}
                                        {topPurchasePercentage}%{" "}
                                    </span>{" "}
                                    of your spending this year.
                                </h2>
                                <Table bordered={false} className="w-full">
                                    {topPurchases}
                                </Table>
                            </div>

                            {/* Top Categories Table */}

                            <div className="flex flex-col justify-center items-center flex-1 p-4 m-2 rounded-xl shadow-lg border-[1px] w-full">
                                <h2 className="text-2xl mb- mt-1">{t('spending.topThreeCategories')}</h2>
                                <h2 className="mb-3 text-4x1  text-center">
                                    Your top 3 spending categories accounted for
                                    <span className="text-3xl font-bold text-blue-600"> {topThreePercentage}% </span> of
                                    your spending this year.
                                </h2>

                                <Table bordered={false} className="w-full">
                                    {topExpenses}
                                </Table>
                            </div>

                            {/* Most Popular Vendors Table */}

                            <div className="flex flex-col justify-center items-center flex-1 p-4 m-3 rounded-xl shadow-lg border-[1px] w-full">
                                <h2 className="text-2xl mb-2 mt-1">Top Spending Locations</h2>
                                <Table bordered={false} className="w-full">
                                    {popularVendorsTable}
                                </Table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Spending;
