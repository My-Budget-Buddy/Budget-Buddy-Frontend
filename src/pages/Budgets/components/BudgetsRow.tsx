interface BudgetsRowProps {
    category: string;
    budgeted: number;
    actual: number;
}

const BudgetsRow: React.FC<BudgetsRowProps> = ({ category, budgeted, actual }) => {

    return(
        <tr>
            <td>{category}</td>
            <td>${budgeted}</td>
            <td>${actual}</td>
            <td>${budgeted-actual}</td>
        </tr>
    )
}

export default BudgetsRow