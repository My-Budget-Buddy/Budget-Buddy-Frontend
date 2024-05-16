import BudgetsComponent from "./components/BudgetsComponent.tsx"
import SummaryComponent from "./components/SummaryComponent.tsx"

const Budgets: React.FC = () => {
    return (
        <>
            <SummaryComponent />
            <BudgetsComponent />
        </>
    )
}

export default Budgets