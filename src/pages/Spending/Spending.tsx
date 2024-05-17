import { Icon, Table, Title } from "@trussworks/react-uswds";
import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { AxisConfig, legendClasses } from "@mui/x-charts";
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Tooltip } from '@mui/material';

const Spending: React.FC = () => {

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

    const calculateIconPosition = (startAngle: number, endAngle: number, radius: number, cx: number, cy: number) => {
        const angle = (startAngle + endAngle) / 2;
        const radians = (angle * Math.PI) / 180;
        const x = cx + radius * Math.cos(radians);
        const y = cy + radius * Math.sin(radians);
        return { x, y };
    };


    const [spendingCategories, setSpendingCategories] = useState([]);

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
    const [spendingData, setSpendingData] = useState({
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


    const [earnedData, setEarnedData] = useState({
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
        //fetch from backend here
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
                    <th scope="row"> <Icon.LocalGroceryStore style={{ color: 'green', fontSize: '1.4rem', marginRight: '0.8rem' }}/>Groceries</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.Youtube style={{ color: 'black', fontSize: '1.4rem', marginRight: '0.8rem' }} /> Entertainment</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.Restaurant style={{ color: 'black', fontSize: '1.4rem', marginRight: '0.8rem' }} /> Dining</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row"> <Icon.DirectionsCar style={{ color: 'black', fontSize: '1.4rem', marginRight: '0.8rem' }}  /> Transportation</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.MedicalServices style={{ color: 'blue', fontSize: '1.4rem', marginRight: '0.8rem' }}  />Healthcare</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.Home style={{ color: 'green', fontSize: '1.4rem', marginRight: '0.8rem' }}  /> Living Expenses</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.Clothes style={{ color: 'green', fontSize: '1.4rem', marginRight: '0.8rem' }}  /> Shopping</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row"> <Icon.TrendingUp style={{ color: 'green', fontSize: '1.4rem', marginRight: '0.8rem' }}  /> Investments</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.MoreHoriz style={{ color: 'green', fontSize: '1.4rem', marginRight: '0.8rem' }}  />  Miscellaneous</th>
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
                    {/* Title for the page */}
                    {/* Full-width row */}
                    <div className="bg-blue-300 p-4 m-2 min-h-[30rem] rounded-md flex justify-center items-center">


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
                        />
                    </div>
                    {/* Second row with two columns */}
                    <div className="flex">
                        
                        <div className="flex flex-col justify-center items-center flex-3 p-4 m-2 min-h-[55rem] rounded-md shadow-xl border-4 border-indigo-500/50">
                            <h2></h2>



                            <PieChart
                                series={[
                                    {
                                        data: mockcategories.map((d) => ({
                                            label: d.name,
                                            id: d.name,
                                            value: d.value,
                                            icon: categoryIcons[d.name]
                                        })),
                                        innerRadius: 75,
                                        outerRadius: 150,
                                        paddingAngle: 1,
                                        cornerRadius: 3,
                                        startAngle: -180,
                                        endAngle: 180,
                                        cx: 350,
                                        cy: 150,
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
                        <div className="flex justify-center items-center flex-1 bg-yellow-300 p-4 m-2 rounded-md">
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
