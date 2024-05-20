
import { Table, Button, ButtonGroup, Icon } from '@trussworks/react-uswds'
import BudgetsRow from './subComponents/BudgetsRow'
import NewBudgetModal from './modals/NewBudgetModal'

import { useEffect, useState } from 'react';

const BudgetsComponent: React.FC = () => {

    const [budgets, setBudgets] = useState([]);

    const currentDate = new Date();
    const months = ["Jan.","Feb.","Mar.","Apr.","May","Jun.","Jul.","Aug.","Sep.","Oct.","Nov.","Dec."];

    // the month and year that the user has selected
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(currentDate.setDate(1)));

    // one month before selected date
    let previousMonthDate = new Date(selectedDate);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

    // one month after selected date
    let nextMonthDate = new Date(selectedDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

    // get selected month as a string
    const selectedMonth = months[selectedDate.getMonth()];
    const selectedYear = selectedDate.getFullYear();
    
    useEffect(() => {
        /* GET budgets
            .then(response => {
                setBudgets(response)
            })
        */
    }, [])


    const selectPreviousMonth = () => {
        setSelectedDate(new Date(previousMonthDate));
    }

    const selectNextMonth = () => {
        setSelectedDate(new Date(nextMonthDate));
    }

    return (
        <>
            {/* May 2024 Budget ------  PreviousMonthButton -- NextMonthButton */}
            <div className='flex w-full'>
                <h1 className='font-bold mr-4'>{selectedMonth} {selectedYear} Budget</h1>
                <ButtonGroup>
                    <Button type='button' onClick={selectPreviousMonth}><Icon.NavigateBefore /> {months[previousMonthDate.getMonth()]} {previousMonthDate.getFullYear()}</Button>
                    {/* disable the next month button if it is more than one month past the current month */}
                    {   
                        selectedDate > currentDate ?
                        <Button type='button' onClick={selectNextMonth} disabled>{months[nextMonthDate.getMonth()]} {nextMonthDate.getFullYear()} <Icon.NavigateNext/></Button>
                        : <Button type='button' onClick={selectNextMonth}>{months[nextMonthDate.getMonth()]} {nextMonthDate.getFullYear()} <Icon.NavigateNext/></Button>
                    }
                </ButtonGroup>
            </div>

        

            <Table className='w-full'>
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
                    <BudgetsRow category='Phone Bill' budgeted={55} actual={0} isReserved={true} notes='' />
                    <BudgetsRow category='Gasoline' budgeted={80} actual={95} isReserved={false} notes='Road trip coming up!' />
                    <BudgetsRow category='Restaurants' budgeted={155} actual={88} isReserved={false} notes='' />
                </tbody>
            </Table>

            <div className='flex flex-col items-center'>
                <NewBudgetModal />
            </div>
            

        </>
    )
}

export default BudgetsComponent