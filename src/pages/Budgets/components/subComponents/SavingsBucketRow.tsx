import { Checkbox } from "@trussworks/react-uswds";
import EditBucketModal from "../modals/EditBucketModal";
import { useEffect, useRef, useState } from "react";
import ReservedMoniesInput from "./ReservedMoniesInput";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import DeleteBucketModal from "../modals/DeleteBucketModal";
import { setIsSending } from "../../../../util/redux/simpleSubmissionSlice";
import { SavingsBucketRowProps } from "../../../../types/budgetInterfaces";
import { putBucket } from "../requests/bucketRequests";
import { useTranslation } from "react-i18next";

const SavingsBucketRow: React.FC<SavingsBucketRowProps> = ({ data }) => {
    //TODO Reset buffer when ANY rows are changed. Currently, the buffer only applies to the single element and each row has an independent buffer.
    const [currentlyReserved, setCurrentlyReserved] = useState<boolean>(data.is_currently_reserved);
    const [amountReserved, setAmountReserved] = useState<number>(data.amount_reserved);
    const dispatch = useAppDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);
    const [initialized, setInitialized] = useState(false);
    const { t } = useTranslation();

    //Buffered submission for PUT requests that change the reserved amount/is_currently_reserved. If no new changes in 5 seconds, then send the PUT.
    const [lastEditTime, setLastEditTime] = useState<Date | null>(null);
    const timerRef = useRef<number | null>(null);
    const [isCurrentlyEditing, setIsCurrentlyEditing] = useState<boolean>(false);

    function setAmountReservedWithCap(amount: number, cap: number) {
        if (amount > cap) {
            setAmountReserved(cap);
        } else {
            setAmountReserved(amount);
        }
    }

    const handleReservedChange = (amount_reserved: number) => {
        setAmountReservedWithCap(amount_reserved, data.amount_required);
        setIsCurrentlyEditing(true);
        setLastEditTime(new Date());
    };

    const handleCheckboxCheck = () => {
        setCurrentlyReserved(!currentlyReserved);
        setIsCurrentlyEditing(true);
        setLastEditTime(new Date());
    };

    async function sendUpdatedBucket(bucket: SavingsBucketRowProps) {
        const newBucket = {
            // bucketId: 6,
            userId: 1, //TODO Try to have backend team use credentials for this field instead of passing it in body
            bucketName: data.name,
            amountReserved: amountReserved, //TODO rename as amountReserved
            amountRequired: data.amount_required,
            // dateCreated: "2024-05-21T08:39:46.726429",
            isActive: true,
            isReserved: currentlyReserved
            // monthYear: "2024-06"
        };

        // Sets buttons to 'waiting', prevent closing
        dispatch(setIsSending(true));

        console.log("UPDATING BUCKET...");

        await putBucket(newBucket, data.id);

        console.log("BUCKET SENT: ", bucket);
        setIsCurrentlyEditing(false);

        dispatch(setIsSending(false));
    }

    useEffect(() => {
        // After component mounts, set initialized to true
        // Using initialized prevents the PUT request from firing on page load
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (lastEditTime && isCurrentlyEditing) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = window.setTimeout(() => {
                // TODO SEND PUT REQUEST
                sendUpdatedBucket({ data }); //TODO Use updated data fields (this just uses what was passed from the GET )
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
            <td data-testid="bucket-name">{data.name}</td>
            {/* TODO Fix css */}
            <td style={{ width: "200px" }}>{data.amount_required}</td>
            <td style={{ width: "200px" }}>
                <ReservedMoniesInput
                    max={data.amount_required}
                    amount={amountReserved}
                    onChange={
                        initialized
                            ? handleReservedChange
                            : () => {
                                  console.log("Initialized");
                              }
                    }
                    disabled={isSending}
                />
            </td>
            <td>
                <Checkbox
                    id={data.name}
                    name={"is_currently_reserved"}
                    label={t("budgets.mark-as-reserved")}
                    checked={currentlyReserved}
                    disabled={isSending}
                    onChange={handleCheckboxCheck}
                />
            </td>
            <td>
                <EditBucketModal data={{ data }}> EDIT BUCKET MODAL </EditBucketModal>
                <DeleteBucketModal id={data.id} bucketName={data.name} />
            </td>
        </tr>
    );
};

export default SavingsBucketRow;
