import { Checkbox, Icon } from "@trussworks/react-uswds";
import EditBudgetModal from "./EditBudgetModal";
import DeleteBudgetModal from "./DeleteBudgetModal";
import BudgetDetailsModal from "./BudgetDetailsModal";

interface BudgetsRowProps {
    category: string;
    budgeted: number;
    isReserved: boolean;
    actual: number;
    notes: string;
}

const BudgetsRow: React.FC<BudgetsRowProps> = ({ category, budgeted, isReserved, actual, notes }) => {

    const remaining = budgeted - actual;

    // The amount of money that will be reserved if the box is checked. It will always be greater than or equal to 0
    const reservedValue = remaining >= 0 ? remaining : 0;

    return(
        <tr>
            <td>{category}</td>
            <td>$ {budgeted}</td>
            <td>$ {actual}</td>
            <td>
                    <div className="flex flex-row items-center">
                        { remaining > 0 ? <div className='text-green-600 font-bold'>$ {remaining}</div> : <div className='text-red-600 font-bold'>$ {remaining}</div> }
                        
                    </div>
            </td>

            <td>
                <Checkbox id={category} name="is-reserved-checkbox" label='Mark as reserved' className="ml-6 pb-3" defaultChecked={ isReserved } onChange={() => {}}/>
            </td>

            <td>
                <EditBudgetModal category={category} budgeted={ budgeted } isReserved={ isReserved } notes={ notes }/>
                <DeleteBudgetModal />
            </td>

            <td>
                <div className="flex justify-end">
                    <BudgetDetailsModal category={category} budgeted={ budgeted } actual={ actual } remaining={ remaining } isReserved={ isReserved } notes={ notes } />
                </div>
            </td>
        </tr>
    )
}

export default BudgetsRow