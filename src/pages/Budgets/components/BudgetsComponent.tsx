import { Table, Button, ButtonGroup, Icon } from "@trussworks/react-uswds";
import BudgetsRow from "./subComponents/BudgetsRow";
import NewBudgetModal from "./modals/NewBudgetModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedDate } from "../../../util/redux/budgetSlice";

const BudgetsComponent: React.FC = () => {
    const [budgets, setBudgets] = useState([]);

    const budgetsStore = useSelector((store: any) => store.budgets);
    const dispatch = useDispatch();

    const currentDate = new Date();

    // the month and year that the user has selected
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(currentDate.setDate(1)));

    // one month before selected date
    let previousMonthDate = new Date(selectedDate);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

    // one month after selected date
    let nextMonthDate = new Date(selectedDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

    useEffect(() => {
        /* GET budgets
            .then(response => {
                setBudgets(response)
            })
        */
    }, []);

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
                    {budgetsStore.selectedMonthString} {budgetsStore.selectedYear} Budget
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
                        <th>Budget Category</th>
                        <th>Budgeted</th>
                        <th>Actual</th>
                        <th>Remaining</th>
                        <th></th>
                        <th>Actions</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {/* map table rows using budgets data from backend */}
                    {/* budgets.map((budget) => {
                        calculate actual of current row from transactions
                        <BudgetsRow />
                    }) */}
                    <BudgetsRow category="Phone Bill" budgeted={55} actual={0} isReserved={true} notes="" />
                    <BudgetsRow
                        category="Gasoline"
                        budgeted={80}
                        actual={95}
                        isReserved={false}
                        notes="Road trip coming up!"
                    />
                    <BudgetsRow category="Restaurants" budgeted={155} actual={88} isReserved={false} notes="" />
                </tbody>
            </Table>
            <div className="flex flex-col items-center">
                <NewBudgetModal />
            </div>
        </>
    );
};

export default BudgetsComponent;
