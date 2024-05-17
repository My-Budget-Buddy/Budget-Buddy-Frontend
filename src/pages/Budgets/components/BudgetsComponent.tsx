import { Table, Button, ButtonGroup } from '@trussworks/react-uswds'
import BudgetsRow from './subComponents/BudgetsRow'
import NewBudgetModal from './modals/NewBudgetModal'
import { useEffect, useState } from 'react';

const BudgetsComponent: React.FC = () => {

    const [Budgets, setBudgets] = useState([]);

    useEffect(() => {
        /* GET budgets
            .then(response => {
                setBudgets(response)
            })
        */
    }, [])

    return (
        <>
            {/* May 2024 Budget ------  PreviousMonthButton -- NextMonthButton */}
            <div className='flex flex-row w-full'>
                <h1 className='font-bold mr-4'>May 2023 Budget</h1>
                <ButtonGroup>
                    <Button type='button'>Apr. 2024</Button> 
                    <Button type='button'>Jun. 2024</Button>
                </ButtonGroup>

            </div>
            <NewBudgetModal />

            <Table className='w-full'>
                <thead>
                    <tr>
                        <th>Budget Category</th>
                        <th>Budgeted</th>
                        <th>Actual</th>
                        <th>Remaining</th>
                    </tr>
                </thead>

                <tbody>
                    {/* map table rows using budgets data from backend */}
                    {/* budgets.map((budget) => {
                        <BudgetsRow />
                    }) */}
                    <BudgetsRow category='Phone Bill' budgeted={55} actual={0} isReserved={true} notes='' />
                    <BudgetsRow category='Gasoline' budgeted={80} actual={95} isReserved={false} notes='Road trip coming up!' />
                    <BudgetsRow category='Restaurants' budgeted={155} actual={88} isReserved={false} notes='' />
                </tbody>
            </Table>
            <div className='flex flex-col'>
                <NewBudgetModal />
            </div>
        </>
    )
}

export default BudgetsComponent