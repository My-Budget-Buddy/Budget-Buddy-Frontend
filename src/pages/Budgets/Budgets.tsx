import BudgetsComponent from "./components/BudgetsComponent.tsx";
import SummaryComponent from "./components/SummaryComponent.tsx";
import SavingsBucketComponent from "./components/SavingsBucketsComponent";
import TestComponent from "./components/TestComponent.tsx";

const Budgets: React.FC = () => {
    return (
        <>
            <SummaryComponent />
            <BudgetsComponent />
            <SavingsBucketComponent />
            <TestComponent />
        </>
    );
};

export default Budgets;
