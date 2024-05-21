import {
    Label,
    Modal,
    ModalFooter,
    ModalHeading,
    ModalRef,
    ModalToggleButton,
    TextInput,
    Icon,
    ButtonGroup,
    Button
} from "@trussworks/react-uswds";
import { useRef, useState } from "react";
import { BudgetProps } from "../../../../types/budgetInterfaces";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { setIsSending } from "../../../../util/redux/simpleSubmissionSlice";
import { timedDelay } from "../../../../util/util";
import { useSelector } from "react-redux";

const EditSpendingBudgetModal: React.FC = () => {
    const budgetsStore = useSelector((store: any) => store.budgets);

    const selectedMonth = budgetsStore.selectedMonth;
    const selectedYear = budgetsStore.selectedYear;
    const spendingBudget = budgetsStore.spendingBudget;

    //TODO Update Budget data schema
    const [formData, setFormData] = useState<BudgetProps>({
        data: {
            value: 0
        }
    });

    const modalRef = useRef<ModalRef>(null);

    const dispatch = useAppDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);

    //TODO Use something to handle form state in the formData state object. This is just a starting point.
    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Nested data interface is useful to keep simple top level component declarations, but leads to this.
        setFormData((prevState) => ({
            ...prevState,
            data: {
                ...prevState.data,
                [name]: value
            }
        }));
    };

    async function sendUpdatedBudget(budget: BudgetProps) {
        // Sets buttons to 'waiting', prevent closing
        dispatch(setIsSending(true));
        console.log("UPDATING BUDGET..."); // <--- This is the bucket to send to the post endpoint

        await timedDelay(1000); //TODO PUT REQUEST HERE

        console.log("BUDGET SENT: ", budget);

        //if good: refreshSavingsBuckets
        //else: return error

        // Reallow all user input again
        dispatch(setIsSending(false));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await sendUpdatedBudget(formData);
        modalRef.current?.toggleModal();
    }

    return (
        <>
            <ModalToggleButton modalRef={modalRef} opener unstyled>
                <Icon.Edit />
            </ModalToggleButton>

            <Modal
                ref={modalRef}
                aria-labelledby="modal-3-heading"
                aria-describedby="modal-3-description"
                id="example-modal-3"
            >
                <ModalHeading id="modal-3-heading">
                    Edit {selectedMonth} {selectedYear} Spending Budget
                </ModalHeading>

                <Label htmlFor="budgeted">Monthly Budget</Label>
                <TextInput id="budgeted" name="budgeted" type="number" defaultValue={spendingBudget}></TextInput>

                <ModalFooter>
                    <ButtonGroup>
                        <Button onClick={handleSubmit} disabled={isSending} type={"button"}>
                            Submit edit
                        </Button>
                        <ModalToggleButton
                            modalRef={modalRef}
                            disabled={isSending}
                            closer
                            unstyled
                            className="padding-105 text-center"
                        >
                            Go back
                        </ModalToggleButton>
                    </ButtonGroup>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default EditSpendingBudgetModal;
