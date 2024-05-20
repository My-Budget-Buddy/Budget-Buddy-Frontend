import { Button, Icon, Table, Title } from "@trussworks/react-uswds";
import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { AxisConfig, BarItemIdentifier, legendClasses } from "@mui/x-charts";
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

type Month = 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december';

type Transaction = {
    transactionId: number;
    userId: number;
    accountId: number;
    vendorName: string;
    amount: number;
    category: string;
    description: string;
    date: string;
};

const Spending: React.FC = () => {
    const navigate = useNavigate();

    const categoryIcons: { [key: string]: JSX.Element } = {
        'Groceries': <Icon.LocalGroceryStore style={{ color: 'green', fontSize: '1.4rem' }} />,
        'Entertainment': <Icon.Youtube style={{ color: 'black', fontSize: '1.4rem' }} />,
        'Dining': <Icon.Restaurant style={{ color: 'black', fontSize: '1.4rem' }} />,
        'Transportation': <Icon.DirectionsCar style={{ color: 'black', fontSize: '1.4rem' }} />,
        'Healthcare': <Icon.MedicalServices style={{ color: 'blue', fontSize: '1.4rem' }} />,
        'Living Expenses': <Icon.Home style={{ color: 'green', fontSize: '1.4rem' }} />,
        'Shopping': <Icon.Clothes style={{ color: 'green', fontSize: '1.4rem' }} />,
        'Investments': <Icon.TrendingUp style={{ color: 'green', fontSize: '1.4rem' }} />,
        'Miscellaneous': <Icon.MoreHoriz style={{ color: 'green', fontSize: '1.4rem' }} />,
    };

    const categoryColors: { [key: string]: string } = {
        'Groceries': '#90c8f4',
        'Entertainment': '#f7e748',
        'Dining': '#6ed198',
        'Transportation': '#af98f9',
        'Healthcare': '#fd6d6d',
        'Living Expenses': '#5a7ffa',
        'Shopping': '#fe992b',
        'Investments': '#f7b7e5',
        'Miscellaneous': '#dce2e1',
    };


    const [spendingCategories, setSpendingCategories] = useState([]);

    const [transactions, setTransactions] = useState([]);

    const mockcategories = [
        { name: 'Groceries', value: 300 },
        { name: 'Entertainment', value: 150 },
        { name: 'Dining', value: 200 },
        { name: 'Transportation', value: 100 },
        { name: 'Healthcare', value: 80 },
        { name: 'Living Expenses', value: 1000 },
        { name: 'Shopping', value: 120 },
        { name: 'Investments', value: 50 },
        { name: 'Miscellaneous', value: 50 },
    ];


    //starting state
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
        december: 0,
    });


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
        december: 0,
    });
    
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
    
    
    const handleItemClick = (event: React.MouseEvent<SVGElement>, barItemIdentifier: BarItemIdentifier) => {
        const { dataIndex } = barItemIdentifier;
        const month = categories[dataIndex];
        navigate(`/dashboard/spending/${month}`);
    };



/*
    //fetch from backend here
    useEffect(() => {

        const fetchTransactions = async () => {
            try {
                const response = await axios.get<Transaction[]>('http://localhost:8083/transactions/user/1');
                console.log(response.data);
                const transactions = response.data;
                console.log('Fetched transactions:', transactions);
                const updatedSpendingData: Record<Month, number> = { ...spendingData };
                const updatedEarnedData: Record<Month, number> = { ...earnedData };

                transactions.forEach((transaction: Transaction) => {
                    const monthIndex = new Date(transaction.date).getMonth();
                    const amount = transaction.amount;
                    const monthKeys: Month[] = [
                        'january', 'february', 'march', 'april', 'may', 'june',
                        'july', 'august', 'september', 'october', 'november', 'december'
                    ];
                    const monthKey = monthKeys[monthIndex];

                    if (transaction.category === 'INCOME') {
                        updatedEarnedData[monthKey] += amount;
                    } else {
                        updatedSpendingData[monthKey] += amount;
                    }
                });

                console.log('Updated spending data:', updatedSpendingData);
                console.log('Updated earned data:', updatedEarnedData);


                setSpendingData(updatedSpendingData);
                setEarnedData(updatedEarnedData);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

*/

    // bar chart
    const chartData = [
        { month: 'January', spending: spendingData.january, earned: earnedData.january },
        { month: 'February', spending: spendingData.february, earned: earnedData.february },
        { month: 'March', spending: spendingData.march, earned: earnedData.march },
        { month: 'April', spending: spendingData.april, earned: earnedData.april },
        { month: 'May', spending: spendingData.may, earned: earnedData.may },
        { month: 'June', spending: spendingData.june, earned: earnedData.june },
        { month: 'July', spending: spendingData.july, earned: earnedData.july },
        { month: 'August', spending: spendingData.august, earned: earnedData.august },
        { month: 'September', spending: spendingData.september, earned: earnedData.september },
        { month: 'October', spending: spendingData.october, earned: earnedData.october },
        { month: 'November', spending: spendingData.november, earned: earnedData.november },
        { month: 'December', spending: spendingData.december, earned: earnedData.december },
    ];

    const categories = chartData.map(d => d.month);
    const spendingValues = chartData.map(d => d.spending);
    const earnedValues = chartData.map(d => d.earned);


    const categoryExpenses = (
        <>
            <thead>
                <tr>
                    <th scope="col">Category</th>
                    <th scope="col">% Spend</th>
                    <th scope="col">Change</th>
                    <th scope="col">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row"> <Icon.LocalGroceryStore style={{ color: '#389ad7', fontSize: '1.4rem', marginRight: '0.8rem' }} />Groceries</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.Youtube style={{ color: '#ecb704', fontSize: '1.4rem', marginRight: '0.8rem' }} /> Entertainment</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.Restaurant style={{ color: '#36b248', fontSize: '1.4rem', marginRight: '0.8rem' }} /> Dining</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row"> <Icon.DirectionsCar style={{ color: '#5a40b8', fontSize: '1.4rem', marginRight: '0.8rem' }} /> Transportation</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.MedicalServices style={{ color: '#de1f1f', fontSize: '1.4rem', marginRight: '0.8rem' }} />Healthcare</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.Home style={{ color: '#3054bd', fontSize: '1.4rem', marginRight: '0.8rem' }} /> Living Expenses</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.Clothes style={{ color: '#fe992b', fontSize: '1.4rem', marginRight: '0.8rem' }} /> Shopping</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row"> <Icon.TrendingUp style={{ color: '#d024a4', fontSize: '1.4rem', marginRight: '0.8rem' }} /> Investments</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.MoreHoriz style={{ color: '#a6a5a6', fontSize: '1.4rem', marginRight: '0.8rem' }} />  Miscellaneous</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
            </tbody>
        </>
    )

    const topExpenses = (
        <>
            <thead>
                <tr>
                    <th scope="col">Category</th>
                    <th scope="col">% Spend</th>
                    <th scope="col">Change</th>
                    <th scope="col">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">Groceries</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">Entertainment</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">Miscellaneous</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
            </tbody>
        </>
    )



    return (
        <div className="min-w-screen">
            <div className="flex-1">
                <section className="h-screen">
                    <Title className="ml-3">Spending Overview</Title>{" "}
                    <Link to="/dashboard/spending/${month}" className="mr-3">
                        <Button type="button" className="ml-3">See Current Month</Button>
                    </Link>
                    {/* Title for the page */}
                    {/* Full-width row */}
                    <div className="p-4 m-2 min-h-[30rem] rounded-md flex justify-center items-center border-4 border-gray-200">


                        <BarChart
                            xAxis={[{ scaleType: 'band', data: categories, categoryGapRatio: 0.5 } as AxisConfig<'band'>,
                            ]}
                            series={[
                                { data: earnedValues, color: '#cbd5e8', label: 'Earned' },
                                { data: spendingValues, color: '#1f78b4', label: 'Spendings' }

                            ]}
                            grid={{ horizontal: true }}
                            width={1400}
                            height={400}
                            onItemClick={handleItemClick}
                        />
                    </div>
                    {/* Second row with two columns */}
                    <div className="flex">

                        <div className="flex flex-col justify-center items-center flex-3 p-4 m-2 min-h-[55rem] rounded-md border-4 border-gray-200">
                            <h2></h2>



                            <PieChart
                                series={[
                                    {
                                        data: mockcategories.map((d) => ({
                                            label: d.name,
                                            id: d.name,
                                            value: d.value,
                                            icon: categoryIcons[d.name],
                                            color: categoryColors[d.name],
                                        })),
                                        innerRadius: 95,
                                        outerRadius: 180,
                                        paddingAngle: 1,
                                        cornerRadius: 3,
                                        startAngle: -180,
                                        endAngle: 180,
                                        cx: 200,
                                        cy: 180,
                                        arcLabel:
                                            (item) => `${item.label}: ${item.value}`,

                                        arcLabelMinAngle: 45,


                                        valueFormatter: (v, { dataIndex }) => {
                                            const { name } = mockcategories[dataIndex];
                                            return `$ ${v.value} `;

                                        },
                                    }
                                ]}

                                sx={{
                                    [`& .${pieArcLabelClasses.root}`]: {
                                        fill: 'white',
                                        fontWeight: 'bold',
                                    },
                                    [`.${legendClasses.root}`]: {
                                        transform: 'translate(2px, 0)',
                                    },
                                }}
                            />




                            <div className="w-full">
                                <Table bordered={false} className="w-full">{categoryExpenses}</Table>
                            </div>
                        </div>
                        <div className="flex justify-center items-center flex-1 p-4 m-2 rounded-md border-4 border-gray-200">
                            <h2></h2>
                            <Table bordered={false} className="w-full">{topExpenses}</Table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Spending;
