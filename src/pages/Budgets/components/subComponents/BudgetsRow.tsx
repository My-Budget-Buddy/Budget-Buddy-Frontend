import { Checkbox } from "@trussworks/react-uswds";
import DeleteBudgetModal from "../modals/DeleteBudgetModal";
import BudgetDetailsModal from "../modals/BudgetDetailsModal";
import EditBudgetModal from "../modals/EditBudgetModal";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { setIsSending } from "../../../../util/redux/simpleSubmissionSlice";
import { useEffect, useRef, useState } from "react";
import { BudgetRowProps } from "../../../../types/budgetInterfaces";
import { putBudget } from "../requests/budgetRequests";
import { Transaction } from "../../../../types/models";
import { useTranslation } from "react-i18next";
import { categoryIconsMap } from "../util/categoryIconsMap";
import { formatCurrency } from "../../../../util/helpers";

interface BudgetsRowProps {
    id: number;
    category: string;
    totalAmount: number;
    isReserved: boolean;
    actual: number;
    notes: string;
    transactions: Transaction[] | undefined;
}

// TODO use stateful variables
const BudgetsRow: React.FC<BudgetsRowProps> = ({
    id,
    category,
    totalAmount,
    isReserved,
    actual,
    notes,
    transactions
}) => {
    const { t } = useTranslation();
    const remaining = totalAmount - actual;
    // The amount of money that will be reserved if the box is checked. It will always be greater than or equal to 0

    const [currentlyReserved, setCurrentlyReserved] = useState<boolean>(isReserved);
    const dispatch = useAppDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);

    //Buffered submission for PUT requests that change the reserved amount/is_currently_reserved. If no new changes in 5 seconds, then send the PUT.
    const [lastEditTime, setLastEditTime] = useState<Date | null>(null);
    const timerRef = useRef<number | null>(null);
    const [isCurrentlyEditing, setIsCurrentlyEditing] = useState<boolean>(false);

    const budgetsStore = useAppSelector((store) => store.budgets);

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
            totalAmount: totalAmount,
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
        setCurrentlyReserved(isReserved);
    }, [budgetsStore.budgets]);

    useEffect(() => {
        if (lastEditTime && isCurrentlyEditing) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = window.setTimeout(() => {
                // TODO SEND PUT REQUEST
                sendUpdatedBudget({
                    id: 1, //TODO Try to have backend team use credentials for this field instead of passing it in body
                    category: category,
                    totalAmount: totalAmount,
                    notes: notes,
                    isReserved: currentlyReserved,
                    spentAmount: actual,
                    monthYear: budgetsStore.monthYear
                }); //TODO Use updated data fields (this just uses what was passed from the GET )
            }, 1000);
        }

        // Cleanup the timeout when the component unmounts
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [lastEditTime]);

    return (
        <tr>
            <td>
                {categoryIconsMap.get(category)}
                {t(category)}
            </td>
            <td>{formatCurrency(totalAmount)}</td>
            <td>{formatCurrency(actual)}</td>
            <td>
                <div className="flex flex-row items-center">
                    {remaining > 0 ? (
                        <div className="text-green-600 font-bold">{formatCurrency(remaining)}</div>
                    ) : (
                        <div className="text-red-600 font-bold">{formatCurrency(remaining)}</div>
                    )}
                </div>
            </td>

            <td>
                <Checkbox
                    id={category}
                    name="is-reserved-checkbox"
                    label={t("budgets.mark-as-reserved")}
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
                    budgeted={totalAmount}
                    isReserved={currentlyReserved}
                    notes={notes}
                />
                <DeleteBudgetModal id={id} category={category} />
            </td>

            <td>
                <div className="flex justify-end">
                    <BudgetDetailsModal
                        category={category}
                        budgeted={totalAmount}
                        actual={actual}
                        remaining={remaining}
                        isReserved={currentlyReserved}
                        notes={notes}
                        transactions={transactions}
                    />
                </div>
            </td>
        </tr>
    );
};

export default BudgetsRow;
