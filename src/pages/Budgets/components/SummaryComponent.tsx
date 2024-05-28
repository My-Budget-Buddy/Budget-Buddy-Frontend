import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { useEffect, useState } from "react";
import EditSpendingBudgetModal from "./modals/EditSpendingBudgetModal";
import { useAppSelector } from "../../../util/redux/hooks";
import { updateBudgets, updateSpendingBudget } from "../../../util/redux/budgetSlice";
import { useDispatch } from "react-redux";
import { getSpendingBudget, getTotalFundsAvailable } from "./requests/summaryRequests";
import { BudgetRowProps } from "../../../types/budgetInterfaces";
import { updateBuckets } from "../../../util/redux/bucketSlice";
import { getBuckets } from "./requests/bucketRequests";
import { getBudgetsByMonthYear } from "./requests/budgetRequests";
import { getCompleteBudgets } from "./util/transactionsCalculator";
import { getCurrentMonthYear } from "../../../util/util";
import { updateUserId } from "../../../util/redux/userSlice";

type CustomComponentProps = {
    hideAdditionalInfo?: boolean;
};

const SummaryComponent: React.FC<CustomComponentProps> = ({ hideAdditionalInfo }) => {
    const budgets = useAppSelector((store) => store.budgets);
    const buckets = useAppSelector((store) => store.buckets);
    const dispatch = useDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);
    const [totalFundsAvailable, setTotalFundsAvailable] = useState(0);
    const selectedMonthString = budgets.selectedMonthString;
    const selectedYear = budgets.selectedYear;

    const remainingBudget = (
        budgets.spendingBudget -
        budgets.totalReserved -
        buckets.totalReserved -
        budgets.totalActuallySpent
    ).toString();
    const percentageRemaining = (Number(remainingBudget) / budgets.spendingBudget) * 100;

    //Make a fetch request for budget and buckets, and total in accounts on load. Results in duplicate fetch requests as each component also does that, but simple for now. Consider skipping the initial calls from budgets and buckets.
    useEffect(() => {
        (async () => {
            const transformedBuckets = await getBuckets();
            dispatch(updateBuckets(transformedBuckets));
            const transformedBudgets: BudgetRowProps[] = await getBudgetsByMonthYear(getCurrentMonthYear());
            //Based on transformedBudgets, return new completeTransformedBudgets which includes the Actual Spent field
            const completeBudgets = await getCompleteBudgets(transformedBudgets);
            dispatch(updateBudgets(completeBudgets));

            const totalReserved = Math.round((budgets.totalReserved + buckets.totalReserved) * 100) / 100;

            const grossFundsAvailable = await getTotalFundsAvailable();
            setTotalFundsAvailable(Math.round((grossFundsAvailable - totalReserved) * 100) / 100);
            //Also, dispatch userId.
            // TODO Move this to a more sensible location.
            // TODO See if backend is able to provide the required data. Scrap if not.
            dispatch(updateUserId(1));
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const spendingBudget = await getSpendingBudget(getCurrentMonthYear());
            console.log("spending budget:", spendingBudget);
            //Based on transformedBudgets, return new completeTransformedBudgets which includes the Actual Spent field
            dispatch(updateSpendingBudget(spendingBudget));
        })();
    }, [isSending]);

    return (
        <>
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col items-center justify-around ml-8" hidden={hideAdditionalInfo}>
                    <div className="text-2xl font-bold">Total Available Funds Across Account</div>
                    <div className=" text-6xl text-green-600 font-bold">${totalFundsAvailable}</div>
                    <div>{"(accounts - reserved)"}</div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="text-2xl mt-4 font-bold">
                        Left to spend in {selectedMonthString} {selectedYear}
                    </div>
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
                                transform: "translate(0px, -20px)"
                            }
                        }}
                        // ...
                    />
                    <div className="bg-slate-200 p-1 px-2 rounded-lg font-bold">of ${budgets.spendingBudget}</div>
                </div>

                <div className="flex flex-col justify-around mr-8" hidden={hideAdditionalInfo}>
                    <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold">
                            {selectedMonthString} {selectedYear} Spending Budget <EditSpendingBudgetModal />
                        </div>
                        <div className="text-lg">${budgets.spendingBudget}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold">Allocated</div>
                        <div className="text-lg">${budgets.totalReserved}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold">Remaining</div>
                        <div className="text-lg">${remainingBudget}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SummaryComponent;
