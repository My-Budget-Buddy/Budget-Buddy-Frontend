import { useEffect } from "react";
import { getMapOfBudgetSpentAmountsFor } from "./util/transactionsCalculator";

function TestComponent() {
    useEffect(() => {
        (async () => {
            const f = await getMapOfBudgetSpentAmountsFor(1, "2024-01");
            console.log("TRANSACTIONS:", f);
        })();
    }, []);
    return <></>;
}

export default TestComponent;
