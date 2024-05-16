import { Title } from "@trussworks/react-uswds";
import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { AxisConfig } from "@mui/x-charts";

const Spending: React.FC = () => {

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



    return (
        <div className="flex">
            <div className="flex-1">
                <section className="overflow-auto h-screen">
                    <Title className="ml-3">Spending Overview</Title>{" "}
                    {/* Title for the page */}
                    {/* Full-width row */}
                    <div className="bg-blue-300 p-4 m-2 min-h-[30rem] rounded-md flex justify-center items-center">
                        <h2>Full Width Component</h2>

                        <BarChart
                            xAxis={[{ scaleType: 'band', data: categories, categoryGapRatio: 0.5 } as AxisConfig<'band'>,
                            ]}
                            series={[
                                { data: earnedValues, color: '#cbd5e8', label: 'Earned' },
                                { data: spendingValues, color: '#1f78b4', label: 'Spendings' }

                            ]}
                            grid={{ horizontal: true }}
                            width={1000}
                            height={300}
                        />
                    </div>
                    {/* Second row with two columns */}
                    <div className="flex">
                        <div className="flex justify-center items-center flex-3 bg-green-300 p-4 m-2 min-h-[30rem] rounded-md ">
                            <h2>Large Pie Chart</h2>
                            {/* More content here */}
                        </div>
                        <div className="flex justify-center items-center flex-1 bg-yellow-300 p-4 m-2 rounded-md">
                            <h2>Text or Info</h2>
                            {/* More content here */}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Spending;
