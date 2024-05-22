import { Checkbox } from "@trussworks/react-uswds";
import DeleteBudgetModal from "../modals/DeleteBudgetModal";
import BudgetDetailsModal from "../modals/BudgetDetailsModal";
import EditBudgetModal from "../modals/EditBudgetModal";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { setIsSending } from "../../../../util/redux/simpleSubmissionSlice";
import { timedDelay } from "../../../../util/util";
import { useEffect, useState } from "react";

interface BudgetsRowProps {
    category: string;
    budgeted: number;
    isReserved: boolean;
    actual: number;
    notes: string;
}

// TODO use stateful variables
const BudgetsRow: React.FC<BudgetsRowProps> = ({ category, budgeted, isReserved, actual, notes }) => {
    const remaining = budgeted - actual;

    // The amount of money that will be reserved if the box is checked. It will always be greater than or equal to 0
    const reservedValue = remaining >= 0 ? remaining : 0;

    const [initialized, setInitialized] = useState(false);

    const dispatch = useAppDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);

    async function sendDeleteRequest() {
        // Sets buttons to 'waiting', prevent closing
        dispatch(setIsSending(true));

        //send post to endpoint
        //on success, refreshSavingsBuckets();

        //POST to endpoint
        // const repsonse = await fetch(... send bucket)
        console.log("DELETING BUCKET..."); // <--- This is the bucket to send to the post endpoint

        await timedDelay(1000);

        console.log("BUCKET DELETED: ");

        //if good: refreshSavingsBuckets
        //else: return error

        // Reallow all user input again
        dispatch(setIsSending(false));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await sendDeleteRequest();
    }

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
                    checked={isReserved}
                    onChange={
                        initialized
                            ? handleSubmit
                            : () => {
                                  console.log("Initialized");
                              }
                    }
                    disabled={isSending}
                />
            </td>

            <td>
                <EditBudgetModal category={category} budgeted={budgeted} isReserved={isReserved} notes={notes} />
                <DeleteBudgetModal />
            </td>

            <td>
                <div className="flex justify-end">
                    <BudgetDetailsModal
                        category={category}
                        budgeted={budgeted}
                        actual={actual}
                        remaining={remaining}
                        isReserved={isReserved}
                        notes={notes}
                    />
                </div>
            </td>
        </tr>
    );
};

export default BudgetsRow;
