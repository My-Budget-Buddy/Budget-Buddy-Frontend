import BudgetsComponent from "../components/BudgetsComponent.tsx";
import SummaryComponent from "../components/SummaryComponent.tsx";
import SavingsBucketComponent from "../components/SavingsBucketsComponent.tsx";

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
