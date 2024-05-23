import { Table, Button, ButtonGroup, Icon } from "@trussworks/react-uswds";
import BudgetsRow from "./subComponents/BudgetsRow";
import NewBudgetModal from "./modals/NewBudgetModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBudgets, updateSelectedDate } from "../../../util/redux/budgetSlice";
import { getBudgetsByMonthYear } from "./requests/budgetRequests";
import { BudgetRowProps } from "../../../types/budgetInterfaces";
import { getCategoriesTransactionsMap, getCompleteBudgets } from "./util/transactionsCalculator";
import { Transaction } from "../../../types/models";
import { useTranslation } from "react-i18next";

const BudgetsComponent: React.FC = () => {
    const isSending = useSelector((store: any) => store.simpleFormStatus.isSending);
    const budgetsStore = useSelector((store: any) => store.budgets);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const currentDate = new Date();

    // the month and year that the user has selected
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(currentDate.setDate(1)));

    // one month before selected date
    let previousMonthDate = new Date(selectedDate);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

    // one month after selected date
    let nextMonthDate = new Date(selectedDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

    const [transactionsMap, setTransactionsMap] = useState<Map<string, Transaction[]>>(
        new Map<string, Transaction[]>()
    );

    // get a map of the transactions for the selected month whenever the user switches months
    useEffect(() => {
        (async () => {
            const mapObject = await getCategoriesTransactionsMap(budgetsStore.monthYear);
            const mapEntries: readonly (readonly [string, Transaction[]])[] = Object.entries(
                mapObject
            ) as readonly (readonly [string, Transaction[]])[];
            const map = new Map<string, Transaction[]>(mapEntries);
            setTransactionsMap(map);
        })();
    }, [budgetsStore.monthYear]);

    useEffect(() => {}, [budgetsStore]);

    // Updates the redux store with fresh budgets from the database
    useEffect(() => {
        (async () => {
            const transformedBudgets = await getBudgetsByMonthYear(budgetsStore.monthYear);
            //Based on transformedBudgets, return new completeTransformedBudgets which includes the Actual Spent field
            const completeBudgets = await getCompleteBudgets(transformedBudgets);
            dispatch(updateBudgets(completeBudgets));
        })();
    }, [isSending]);

    // resets the redux budgets then updates it whenever a new month is selected.
    // the reset is necessary so that the previously selected month's budgets are not display on screen if there are no existing budgets on the new month
    useEffect(() => {
        dispatch(updateBudgets([]));
        (async () => {
            const transformedBudgets = await getBudgetsByMonthYear(budgetsStore.monthYear);
            //Based on transformedBudgets, return new completeTransformedBudgets which includes the Actual Spent field
            const completeBudgets = await getCompleteBudgets(transformedBudgets);
            dispatch(updateBudgets(completeBudgets));
        })();
    }, [budgetsStore.monthYear]);

    const selectPreviousMonth = () => {
        const selectedMonthYear = {
            selectedMonth: previousMonthDate.getMonth(),
            selectedYear: previousMonthDate.getFullYear()
        };
        dispatch(updateSelectedDate(selectedMonthYear));
        setSelectedDate(new Date(previousMonthDate));
    };

    const selectNextMonth = () => {
        const selectedMonthYear = {
            selectedMonth: nextMonthDate.getMonth(),
            selectedYear: nextMonthDate.getFullYear()
        };
        dispatch(updateSelectedDate(selectedMonthYear));
        setSelectedDate(new Date(nextMonthDate));
    };

    return (
        <>
            <div className="flex w-full">
                <h1 className="font-bold mr-4">
                    {budgetsStore.selectedMonthString} {budgetsStore.selectedYear} {t("budgets.budget")}
                </h1>
                <ButtonGroup>
                    <Button type="button" onClick={selectPreviousMonth}>
                        <Icon.NavigateBefore /> {budgetsStore.months[previousMonthDate.getMonth()]}{" "}
                        {previousMonthDate.getFullYear()}
                    </Button>
                    {/* disable the next month button if it is more than one month past the current month */}
                    {selectedDate > currentDate ? (
                        <Button type="button" onClick={selectNextMonth} disabled>
                            {budgetsStore.months[nextMonthDate.getMonth()]} {nextMonthDate.getFullYear()}{" "}
                            <Icon.NavigateNext />
                        </Button>
                    ) : (
                        <Button type="button" onClick={selectNextMonth}>
                            {budgetsStore.months[nextMonthDate.getMonth()]} {nextMonthDate.getFullYear()}{" "}
                            <Icon.NavigateNext />
                        </Button>
                    )}
                </ButtonGroup>
            </div>

            <Table className="w-full">
                <thead>
                    <tr>
                        <th>
                            {t("budgets.budget")} {t("budgets.category")}
                        </th>
                        <th>{t("budgets.budgeted")}</th>
                        <th>{t("budgets.actual")}</th>
                        <th>{t("budgets.remaining")}</th>
                        <th></th>
                        <th>{t("budgets.actions")}</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {/* map table rows using budgets data from backend */}
                    {/* budgets.map((budget) => {
                        calculate actual of current row from transactions
                        <BudgetsRow />
                    }) */}
                    {budgetsStore.budgets.map((budget: BudgetRowProps) => {
                        return (
                            <BudgetsRow
                                key={budget.id}
                                id={budget.id}
                                category={budget.category}
                                totalAmount={budget.totalAmount}
                                isReserved={budget.isReserved}
                                actual={budget.spentAmount}
                                notes={budget.notes}
                                transactions={transactionsMap.get(budget.category)}
                            />
                        );
                    })}
                </tbody>
            </Table>
            <div className="flex flex-col items-center">
                <NewBudgetModal />
            </div>
        </>
    );
};

export default BudgetsComponent;
