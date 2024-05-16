import CategoryModal from "./CategoryModal";

interface BudgetsRowProps {
    category: string;
    budgeted: number;
    reserve: boolean;
    actual: number;
    notes: string;
}

const BudgetsRow: React.FC<BudgetsRowProps> = ({ category, budgeted, reserve, actual, notes }) => {

    const remaining = budgeted - actual;

    return(
        <tr>
            <td>{category}</td>
            <td>${budgeted}</td>
            <td>${actual}</td>
            <td>
                <div className="flex flex-row justify-between">
                    { remaining > 0 ? <div className='text-green-600'>${remaining}</div> : <div className='text-red-600'>${remaining}</div>}
                    <CategoryModal category={category} budgeted={ budgeted } reserve={ reserve } notes={ notes } />
                </div>
            </td>
        </tr>
    )
}

export default BudgetsRow