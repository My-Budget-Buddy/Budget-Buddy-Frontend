import BudgetsComponent from "./components/BudgetsComponent.tsx"
import SavingsBucketComponent from "./components/SavingsBucketsComponent"

const Budgets: React.FC = () => {
    return (
        <>
            <BudgetsComponent />
            <SavingsBucketComponent/>
        </>
    )
}

export default Budgets