import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const SummaryComponent: React.FC = () => {

    const budgetsStore = useSelector((store : any) => store.budgets)
    const bucketsStore = useSelector((store : any) => store.buckets)

    const currentDate = new Date();
    const months = ["Jan.","Feb.","Mar.","Apr.","May","Jun.","Jul.","Aug.","Sep.","Oct.","Nov.","Dec."];

    // get selected month as a string
    const currentMonth = months[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    const remainingBudget = (budgetsStore.spendingBudget - budgetsStore.totalReserved - bucketsStore.totalReserved - budgetsStore.totalActuallySpent).toString();
    const percentageRemaining = Number(remainingBudget)/budgetsStore.spendingBudget*100;

    useEffect(() => {
        /**/
    }, [/*budgets, buckets*/])
    return (
        <>
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col items-center justify-around ml-8">
                    <div className="text-2xl font-bold">Total Available Funds Across Account</div>
                    <div className=" text-6xl text-green-600 font-bold">${ budgetsStore.totalFundsAvailable }</div>
                    <div>{"(accounts + projected earnings - reserved)"}</div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="text-2xl mt-4 font-bold">Left to spend in { currentMonth } { currentYear }</div>
                    <Gauge
                        width={400}
                        height={200}
                        value={percentageRemaining}
                        text={`$${remainingBudget}`}
                        startAngle={-90}
                        endAngle={90}
                        innerRadius="80%"
                        outerRadius="100%"
                        sx={{
                            [`& .${gaugeClasses.valueText}`]: {
                              fontSize: 40,
                              transform: "translate(0px, -20px)",
                            },
                          }}
                        // ...
                    />
                    <div className="bg-slate-200 p-1 px-2 rounded-lg font-bold">of ${ budgetsStore.spendingBudget }</div>
                </div>
                
                <div className="flex flex-col justify-around mr-8">
                    <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold">Monthly Spending Budget</div>
                        <div className="text-lg">${ budgetsStore.spendingBudget }</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold">Allocated</div>
                        <div className="text-lg">${ budgetsStore.totalReserved }</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold">Remaining</div>
                        <div className="text-lg">${ remainingBudget }</div>
                    </div>
                </div>
            </div>
        </>   
    )
}

export default SummaryComponent