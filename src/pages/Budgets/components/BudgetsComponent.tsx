import { Table, Button, ButtonGroup } from '@trussworks/react-uswds'
import BudgetsRow from './BudgetsRow'
import NewCategoryModal from './NewCategoryModal'

const BudgetsComponent: React.FC = () => {
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
            <NewCategoryModal />

            <Table bordered={true} className='w-full'>
                <thead>
                    <tr>
                        <th className='flex flex-row items-center'>Budget Category </th>
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
                    <BudgetsRow category='Phone Bill' budgeted={55} actual={0}/>
                    <BudgetsRow category='Gasoline' budgeted={80} actual={33}/>
                </tbody>
            </Table>
        </>
    )
}

export default BudgetsComponent