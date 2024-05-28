import { Table, Button, ButtonGroup, Icon } from "@trussworks/react-uswds";
import BudgetsRow from "./subComponents/BudgetsRow";
import NewBudgetModal from "./modals/NewBudgetModal";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateBudgets, updateSelectedDate } from "../../../util/redux/budgetSlice";
import { getBudgetsByMonthYear } from "./requests/budgetRequests";
import { BudgetRowProps } from "../../../types/budgetInterfaces";
import { getCategoriesTransactionsMap, getCompleteBudgets } from "./util/transactionsCalculator";
import { Transaction } from "../../../types/models";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../util/redux/hooks";

type SortableKeys = keyof BudgetRowProps;
const defaultKey: SortableKeys = "category";

const BudgetsComponent: React.FC = () => {
    const isSending = useAppSelector((store) => store.simpleFormStatus.isSending);
    const budgetsStore = useAppSelector((store) => store.budgets);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const currentDate = new Date();
    const [sortingOrder, setSortingOrder] = useState<{ key: SortableKeys | null; direction: string }>({
        key: "category",
        direction: "asc"
    });

    // the month and year that the user has selected
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(currentDate.setDate(1)));

    // one month before selected date
    const previousMonthDate = new Date(selectedDate);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

    // one month after selected date
    const nextMonthDate = new Date(selectedDate);
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
            const transformedBudgets: BudgetRowProps[] = await getBudgetsByMonthYear(budgetsStore.monthYear);
            //Based on transformedBudgets, return new completeTransformedBudgets which includes the Actual Spent field
            const completeBudgets = await getCompleteBudgets(transformedBudgets);
            // Sort the budgets before updating the store
            const sortedBudgets = sortBudgets(completeBudgets, sortingOrder.key ?? defaultKey, sortingOrder.direction);
            dispatch(updateBudgets(sortedBudgets));
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

            // Sort the budgets before updating the store
            const sortedBudgets = sortBudgets(completeBudgets, sortingOrder.key ?? "category", sortingOrder.direction);
            dispatch(updateBudgets(sortedBudgets));
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

    const sortBudgets = (budgets: BudgetRowProps[], key: SortableKeys, direction: string) => {
        // using the spread operator so that the state of budgets isn't modified directly
        return [...budgets].sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];

            // the remaining value is not stored in the store like the other values so we handle that exception here
            if (key === "spentAmount") {
                aValue = a.totalAmount - a.spentAmount;
                bValue = b.totalAmount - b.spentAmount;
            }

            if (aValue < bValue) {
                return direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    };

    const sortStoreBudgets = (key: SortableKeys) => {
        let direction = "asc";
        if (sortingOrder.key === key && sortingOrder.direction === "asc") {
            direction = "desc";
        }
        setSortingOrder({ key, direction });
        const sortedBudgets = sortBudgets(budgetsStore.budgets, key, direction);
        dispatch(updateBudgets(sortedBudgets));
    };

    // render an up or down arrow depending on if the sorted category is ascending or descending
    const renderSortArrow = (key: string) => {
        if (sortingOrder.key === key) {
            return sortingOrder.direction === "asc" ? <Icon.ArrowDropUp /> : <Icon.ArrowDropDown />;
        }
        return null;
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
                        <th onClick={() => sortStoreBudgets("category")}>
                            {t("budgets.budget")} {t("budgets.category")}
                            {renderSortArrow("category")}
                        </th>
                        <th onClick={() => sortStoreBudgets("totalAmount")}>
                            {t("budgets.budgeted")}
                            {renderSortArrow("totalAmount")}
                        </th>
                        <th onClick={() => sortStoreBudgets("spentAmount")}>
                            {t("budgets.actual")}
                            {renderSortArrow("spentAmount")}
                        </th>
                        <th onClick={() => sortStoreBudgets("spentAmount")}>
                            {t("budgets.spentAmount")}
                            {renderSortArrow("spentAmount")}
                        </th>
                        <th></th>
                        <th>{t("budgets.actions")}</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {budgetsStore.budgets.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center align-middle">
                                <h1>There are currently no budgets for this month</h1>
                                Click <span className="font-bold text-[#005ea2]">Add New Budget</span> to add a new
                                budget
                            </td>
                        </tr>
                    ) : (
                        budgetsStore.budgets.map((budget: BudgetRowProps) => {
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
                        })
                    )}
                </tbody>
            </Table>
            <div className="flex flex-col items-center">
                <NewBudgetModal />
            </div>
        </>
    );
};

export default BudgetsComponent;
