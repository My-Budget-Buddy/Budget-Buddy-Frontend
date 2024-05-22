import { Checkbox } from "@trussworks/react-uswds";
import DeleteBudgetModal from "../modals/DeleteBudgetModal";
import BudgetDetailsModal from "../modals/BudgetDetailsModal";
import EditBudgetModal from "../modals/EditBudgetModal";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { setIsSending } from "../../../../util/redux/simpleSubmissionSlice";
import { timedDelay } from "../../../../util/util";
import { useEffect, useRef, useState } from "react";
import { BudgetRowProps } from "../../../../types/budgetInterfaces";
import { putBudget } from "../requests/budgetRequests";
import { useSelector } from "react-redux";

interface BudgetsRowProps {
    id: number;
    category: string;
    budgeted: number;
    isReserved: boolean;
    actual: number;
    notes: string;
}

// TODO use stateful variables
const BudgetsRow: React.FC<BudgetsRowProps> = ({ id, category, budgeted, isReserved, actual, notes }) => {
    const remaining = budgeted - actual;
    // The amount of money that will be reserved if the box is checked. It will always be greater than or equal to 0
    const reservedValue = remaining >= 0 ? remaining : 0;

    const [currentlyReserved, setCurrentlyReserved] = useState<boolean>(isReserved);
    const dispatch = useAppDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);
    const [initialized, setInitialized] = useState(false);

    //Buffered submission for PUT requests that change the reserved amount/is_currently_reserved. If no new changes in 5 seconds, then send the PUT.
    const [lastEditTime, setLastEditTime] = useState<Date | null>(null);
    const timerRef = useRef<number | null>(null);
    const [isCurrentlyEditing, setIsCurrentlyEditing] = useState<boolean>(false);

    const budgetsStore = useSelector((store: any) => store.budgets);

    const handleCheckboxCheck = () => {
        setCurrentlyReserved(!currentlyReserved);
        setIsCurrentlyEditing(true);
        setLastEditTime(new Date());
    };

    async function sendUpdatedBudget(bucket: BudgetRowProps) {
        const newBudget = {
            // bucketId: 6,
            userId: 1, //TODO Try to have backend team use credentials for this field instead of passing it in body
            category: category,
            totalAmount: budgeted,
            actual: actual,
            notes: notes,
            isReserved: currentlyReserved,
            monthYear: budgetsStore.monthYear
        };

        // Sets buttons to 'waiting', prevent closing
        dispatch(setIsSending(true));

        console.log("UPDATING BUDGET...");

        await putBudget(newBudget, id);

        console.log("BUDGET SENT: ", bucket);
        setIsCurrentlyEditing(false);

        dispatch(setIsSending(false));
    }

    useEffect(() => {
        // After component mounts, set initialized to true
        // Using initialized prevents the PUT request from firing on page load
        setInitialized(true);
        return () => {
            console.log("ASdf");
        };
    }, []);

    useEffect(() => {
        // After component mounts, set initialized to true
        setInitialized(true);
    }, []);

    return (
        <tr>
            <td>{category}</td>
            <td>$ {budgeted}</td>
            <td>$ {actual}</td>
            <td>
                <div className="flex flex-row items-center">
                    {remaining > 0 ? (
                        <div className="text-green-600 font-bold">$ {remaining}</div>
                    ) : (
                        <div className="text-red-600 font-bold">$ {remaining}</div>
                    )}
                </div>
            </td>

            <td>
                <Checkbox
                    id={category}
                    name="is-reserved-checkbox"
                    label="Mark as reserved"
                    className="ml-6 pb-3"
                    checked={currentlyReserved}
                    onChange={handleCheckboxCheck}
                    disabled={isSending}
                />
            </td>

            <td>
                <EditBudgetModal
                    id={id}
                    category={category}
                    budgeted={budgeted}
                    isReserved={currentlyReserved}
                    notes={notes}
                />
                <DeleteBudgetModal id={id} />
            </td>

            <td>
                <div className="flex justify-end">
                    <BudgetDetailsModal
                        category={category}
                        budgeted={budgeted}
                        actual={actual}
                        remaining={remaining}
                        isReserved={currentlyReserved}
                        notes={notes}
                    />
                </div>
            </td>
        </tr>
    );
};

export default BudgetsRow;
