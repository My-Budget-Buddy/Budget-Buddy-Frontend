import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { useEffect, useState } from "react";
import EditSpendingBudgetModal from "./modals/EditSpendingBudgetModal";
import { useAppSelector } from "../../../util/redux/hooks";
import { updateBudgets, updateSpendingBudget } from "../../../util/redux/budgetSlice";
import { useDispatch } from "react-redux";
import { createMonthlySummary, getMonthlySummary } from "./requests/summaryRequests";
import { BudgetRowProps } from "../../../types/budgetInterfaces";
import { updateBuckets } from "../../../util/redux/bucketSlice";
import { getBuckets } from "./requests/bucketRequests";
import { getBudgetsByMonthYear } from "./requests/budgetRequests";
import { getCompleteBudgets } from "./util/transactionsCalculator";
import { updateUserId } from "../../../util/redux/userSlice";
import { formatCurrency } from "../../../util/helpers";
import { useTranslation } from "react-i18next";
import { getTotalAvailableFunds } from "./requests/accountRequests";
import { Icon, Title } from "@trussworks/react-uswds";

type CustomComponentProps = {
    hideAdditionalInfo?: boolean;
};

type MonthlySummary = {
    summaryId: number;
    userId?: string | null;
    projectedIncome?: number;
    monthYear?: string;
    totalBudgetAmount?: number;
};

const SummaryComponent: React.FC<CustomComponentProps> = ({ hideAdditionalInfo }) => {
    const { t } = useTranslation();
    const budgets = useAppSelector((store) => store.budgets);
    const buckets = useAppSelector((store) => store.buckets);
    const dispatch = useDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);
    const [showTooltip, setShowTooltip] = useState(false);
    const [totalFundsAvailable, setTotalFundsAvailable] = useState(0);
    const [monthlySummary, setMonthlySummary] = useState<MonthlySummary>({
        summaryId: 0,
        userId: null,
        totalBudgetAmount: 0
    });
    const selectedMonthString = budgets.selectedMonthString;
    const selectedYear = budgets.selectedYear;

    const remainingBudget = (budgets.spendingBudget - budgets.totalReserved - budgets.totalActuallySpent).toString();
    const percentageRemaining = (Number(remainingBudget) / budgets.spendingBudget) * 100;

    let gaugeColor = "#52b202";

    if (percentageRemaining > 70) {
        gaugeColor = "#52b202";
    } else if (percentageRemaining > 35) {
        gaugeColor = "#90EE90";
    } else if (percentageRemaining > 15) {
        gaugeColor = "#FFA500";
    } else {
        gaugeColor = "#b20202";
    }

    //Make a fetch request for budget and buckets, and total in accounts on load. Results in duplicate fetch requests as each component also does that, but simple for now. Consider skipping the initial calls from budgets and buckets.
    useEffect(() => {
        (async () => {
            const transformedBuckets = await getBuckets();
            dispatch(updateBuckets(transformedBuckets));
            const transformedBudgets: BudgetRowProps[] = await getBudgetsByMonthYear(budgets.monthYear);
            //Based on transformedBudgets, return new completeTransformedBudgets which includes the Actual Spent field
            const completeBudgets = await getCompleteBudgets(transformedBudgets);
            dispatch(updateBudgets(completeBudgets));

            const totalReserved = buckets.totalReserved;
            const grossFundsAvailable = await getTotalAvailableFunds();
            setTotalFundsAvailable(grossFundsAvailable - totalReserved);
            // TODO Move this to a more sensible location.
            // TODO See if backend is able to provide the required data. Scrap if not.
            dispatch(updateUserId(1));
        })();
    }, [buckets.totalReserved]);

    useEffect(() => {
        (async () => {
            let monthlySummary = await getMonthlySummary(budgets.monthYear);

            // Create a new monthlySummary for the month if one doesn't already exist
            if (monthlySummary === undefined) {
                const newMonthlySummary = {
                    userId: 1,
                    projectedIncome: 0,
                    monthYear: budgets.monthYear,
                    totalBudgetAmount: 0
                };
                monthlySummary = await createMonthlySummary(newMonthlySummary);
            }
            //Based on transformedBudgets, return new completeTransformedBudgets which includes the Actual Spent field
            setMonthlySummary(monthlySummary);
            dispatch(updateSpendingBudget(monthlySummary.totalBudgetAmount));
        })();
    }, [isSending, budgets.monthYear]);

    return (
        <>
            <div className="flex flex-row justify-between w-full" id="summary-component">
                <div className="flex flex-col items-center" hidden={hideAdditionalInfo}>
                    <div className="text-2xl font-bold flex flex-row items-center">
                        <Title>{t("budgets.total-funds")}</Title>
                        <span
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            className="relative text-sm"
                        >
                            <Icon.Help className="mt-4" />
                            {/* Render tooltip conditionally */}
                            {showTooltip && (
                                <div className="absolute left-8 top-0 bg-gray-200 p-2 rounded shadow-md w-80 text-sm">
                                    {"This is the total money you have across your checking and savings accounts, minus any debts and money reserved from your Savings Buckets."}
                                </div>
                            )}
                        </span>
                    </div>
                    <div style={{ color: totalFundsAvailable >= 0 ? "green" : "red" }} className="flex h-full items-center text-6xl font-bold">
                        {formatCurrency(totalFundsAvailable)}
                    </div>
                    <div></div>
                </div>

                <div className="flex flex-col items-center">
                    <Title>{t("budgets.left-to-spend")} {selectedMonthString} {selectedYear}</Title>
                    <Gauge
                        width={400}
                        height={200}
                        value={percentageRemaining >= 0 ? percentageRemaining : 0}
                        text={formatCurrency(remainingBudget)}
                        startAngle={-90}
                        endAngle={90}
                        innerRadius="80%"
                        outerRadius="100%"
                        sx={{
                            [`& .${gaugeClasses.valueText}`]: {
                                fontSize: 40,
                                transform: "translate(0px, -20px)"
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                                fill: gaugeColor
                            }
                        }}
                    // ...
                    />
                    <div className="bg-slate-200 p-1 px-2 rounded-lg font-bold">
                        {t("budgets.of")} {formatCurrency(budgets.spendingBudget)}
                    </div>
                </div>

                <div className="flex flex-col items-center" hidden={hideAdditionalInfo}>

                    <div className="flex flex-col items-center">
                        <Title>{selectedMonthString} {selectedYear} {t("budgets.spending-budget")}{" "}
                            <EditSpendingBudgetModal
                                summaryId={monthlySummary.summaryId}
                                totalBudgetAmount={monthlySummary.totalBudgetAmount}
                            />
                        </Title>
                        <div id="Spending-Budget-Div" className="text-lg">{formatCurrency(budgets.spendingBudget)}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold">{t("budgets.allocated")}</div>
                        <div className="text-lg">{formatCurrency(budgets.totalReserved)}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold">{t("budgets.remaining")}</div>
                        <div className="text-lg">{formatCurrency(remainingBudget)}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SummaryComponent;
