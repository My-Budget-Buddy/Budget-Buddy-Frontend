import BudgetsComponent from "../components/budgets/BudgetsComponent.tsx";
import SummaryComponent from "../components/SummaryComponent.tsx";
import SavingsBucketComponent from "../components/budgets/SavingsBucketsComponent.tsx";

const Budgets: React.FC = () => {
    return (
        <>
            <SummaryComponent />
            <BudgetsComponent />
            <SavingsBucketComponent />
        </>
    );
};

export default Budgets;
