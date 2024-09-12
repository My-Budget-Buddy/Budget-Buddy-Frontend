import BudgetsComponent from "./components/BudgetsComponent.tsx";
import SummaryComponent from "./components/SummaryComponent.tsx";
import SavingsBucketComponent from "./components/SavingsBucketsComponent";
import { useEffect } from "react";
import fxDirector from "../../overlay/fxDirector.ts";

const Budgets: React.FC = () => {


    useEffect(() => {
        setTimeout(() => {
            fxDirector.startTutorial()
        }, 1000);
    }

    )

    return (
        <>
            <SummaryComponent />
            <BudgetsComponent />
            <SavingsBucketComponent />
        </>
    );
};

export default Budgets;
