import { Icon, Table, Title, Button} from "@trussworks/react-uswds";
import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { AxisConfig, legendClasses } from "@mui/x-charts";
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import axios from 'axios';
import { Link } from "react-router-dom";

const SpendingMonth: React.FC = () => {

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
        'Living Expenses': '#d7f5a4', 
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
    const [spendingData, setSpendingData] = useState({
        january: 0,
        february: 0,
        march: 0,
        april: 0,
      
    });


    const [earnedData, setEarnedData] = useState({
        january: 0,
        february: 0,
        march: 0,
        april: 0,
        
       
    });

    useEffect(() => {
      
        const fetchData = async () => {
            const spending = {
                january: 4000,
                february: 3000,
                march: 5000,
                april: 2000,
               
                
            };
            const earned = {
                january: 8000,
                february: 7500,
                march: 9000,
                april: 6500,
             
              
            };
            setSpendingData(spending);
            setEarnedData(earned);
        };
        fetchData();
    }, []);


    const handleItemClick = (event: any, params: { data: any; dataIndex: any; }) => {
        const { data, dataIndex } = params;
        const month = data[dataIndex].month;
        console.log(`Clicked on month: ${month}`);
        // You can add more logic here to display details about the clicked month
        alert(`Details for ${month}`);
    };



/*
    //fetch from backend here
    useEffect(() => {
      
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:8083/transactions/user/{userId}');
                const fetchedTransactions = response.data;
                setTransactions(fetchedTransactions);


                const spending = {
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

                const earned = {
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
            
           fetchedTransactions.forEach(transaction => {                                 //iterate over each transaction
                    const month = new Date(transaction.transaction_date).getMonth();   //extract month from transaction date
                    const amount = transaction.transaction_amount;
                    if (transaction.transaction_category === 'INCOME') {                //if the transaction category is income, add to earned
                        earned[Object.keys(earned)[month]] += amount;
                    } else {                                                                //otherwise, add to spending
                        spending[Object.keys(spending)[month]] += amount;
                    }
                });
            

            setSpendingData(spending);
            setEarnedData(earned);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    fetchTransactions();
    }, []);
    */


    // bar chart
    const chartData = [
        { month: 'Week 1', spending: spendingData.january, earned: earnedData.january },
        { month: 'Week 2', spending: spendingData.february, earned: earnedData.february },
        { month: 'Week 3', spending: spendingData.march, earned: earnedData.march },
        { month: 'Week 4', spending: spendingData.april, earned: earnedData.april },
      
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
                    <th scope="row"> <Icon.LocalGroceryStore style={{ color: '#90c8f4', fontSize: '1.4rem', marginRight: '0.8rem' }} />Groceries</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.Youtube style={{ color: '#f7e748', fontSize: '1.4rem', marginRight: '0.8rem' }} /> Entertainment</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.Restaurant style={{ color: '#6ed198', fontSize: '1.4rem', marginRight: '0.8rem' }} /> Dining</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row"> <Icon.DirectionsCar style={{ color: '#af98f9', fontSize: '1.4rem', marginRight: '0.8rem' }} /> Transportation</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.MedicalServices style={{ color: '#fd6d6d', fontSize: '1.4rem', marginRight: '0.8rem' }} />Healthcare</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.Home style={{ color: '#d7f5a4', fontSize: '1.4rem', marginRight: '0.8rem' }} /> Living Expenses</th>
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
                    <th scope="row"> <Icon.TrendingUp style={{ color: '#f7b7e5', fontSize: '1.4rem', marginRight: '0.8rem' }} /> Investments</th>
                    <td>
                        test
                    </td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <th scope="row">  <Icon.MoreHoriz style={{ color: '#dce2e1', fontSize: '1.4rem', marginRight: '0.8rem' }} />  Miscellaneous</th>
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
                    <Title className="ml-3"> Month Name Overview</Title>{" "}
                    <Link to="/dashboard/spending" className="mr-3">
                    <Button type="button" className="ml-3">Back</Button>
                    </Link>
                    {/* Title for the page */}
                    {/* Full-width row */}
                    <div className="bg-gray-100 p-4 m-2 min-h-[10rem] rounded-md flex justify-center items-center">


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

export default SpendingMonth;
