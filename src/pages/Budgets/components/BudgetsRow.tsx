import { Checkbox } from "@trussworks/react-uswds";
import CategoryModal from "./CategoryModal";

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
            <td>${budgeted}</td>
            <td>${actual}</td>
            <td>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row">
                        { remaining > 0 ? <div className='text-green-600'>${remaining}</div> : <div className='text-red-600'>${remaining}</div> }
                        <Checkbox id={category} name="is-reserved-checkbox" label='Mark as reserved' className="ml-4" defaultChecked={ isReserved } onChange={() => {}}/>
                    </div>
                    <CategoryModal category={category} budgeted={ budgeted } isReserved={ isReserved } notes={ notes } />
                </div>
            </td>
        </tr>
    )
}

export default BudgetsRow