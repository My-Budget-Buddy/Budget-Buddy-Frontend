import {
    Checkbox,
    Label,
    Modal,
    ModalFooter,
    ModalHeading,
    ModalRef,
    ModalToggleButton,
    TextInput,
    Textarea,
    Icon,
    ButtonGroup,
    Button,
    FormGroup,
    ErrorMessage
} from "@trussworks/react-uswds";
import { useRef, useState } from "react";
import { BudgetRowProps } from "../../../../types/budgetInterfaces";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { setIsSending } from "../../../../util/redux/simpleSubmissionSlice";
import { putBudget } from "../requests/budgetRequests";
import { useSelector } from "react-redux";

interface TODO_CategoryProps {
    id: number;
    category: string;
    budgeted: number;
    isReserved: boolean;
    notes: string;
}

const EditBudgetModal: React.FC<TODO_CategoryProps> = ({ id, category, budgeted, isReserved, notes }) => {
    //TODO Update Budget data schema
    const [formData, setFormData] = useState<BudgetRowProps>({
        id: id,
        category: category,
        totalAmount: budgeted,
        isReserved: isReserved,
        notes: notes
    });

    const modalRef = useRef<ModalRef>(null);

    const dispatch = useAppDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);

    const budgetsStore = useSelector((store: any) => store.budgets);

    // Input validation
    const hasTotalAmountError = !(formData.totalAmount >= 0) || formData.totalAmount.toString() === "";

    //TODO Use something to handle form state in the formData state object. This is just a starting point.
    const handleChangeInput = (e: any) => {
        const { name, value } = e.target;

        // Nested data interface is useful to keep simple top level component declarations, but leads to this.
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const toggleIsReserved = (e: any) => {
        setFormData((prevState) => ({
            ...prevState,
            isReserved: !prevState.isReserved
        }));
    };

    async function sendUpdatedBudget(budget: BudgetRowProps) {
        const newBudget = {
            //id: formData.id,
            userId: 1,
            category: formData.category,
            totalAmount: formData.totalAmount,
            isReserved: formData.isReserved,
            notes: formData.notes,
            monthYear: budgetsStore.monthYear
        };

        // Sets buttons to 'waiting', prevent closing
        dispatch(setIsSending(true));
        console.log("UPDATING BUDGET..."); // <--- This is the bucket to send to the post endpoint

        // TODO The type definitions are getting out of hand
        await putBudget(newBudget, id);

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
                <ModalHeading id="modal-3-heading">Edit Budget</ModalHeading>

                <Label htmlFor="category">Category</Label>
                <TextInput id="category" name="category" type="text" value={formData.category} disabled></TextInput>

                <FormGroup error={hasTotalAmountError}>
                    <Label htmlFor="totalAmount">Monthly Budget</Label>
                    {hasTotalAmountError ? <ErrorMessage>Must be greater than or equal to 0</ErrorMessage> : null}
                    <TextInput
                        id="totalAmount"
                        name="totalAmount"
                        type="number"
                        value={formData.totalAmount}
                        onChange={handleChangeInput}
                    />
                </FormGroup>

                <Checkbox
                    id={id.toString()}
                    name="isReserved"
                    label="Reserve budget from available funds"
                    checked={formData.isReserved}
                    onChange={toggleIsReserved}
                    className="mt-8"
                />

                <Label htmlFor="notes">Notes:</Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChangeInput} />

                <ModalFooter>
                    <ButtonGroup>
                        <Button onClick={handleSubmit} disabled={isSending || hasTotalAmountError} type={"button"}>
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

export default EditBudgetModal;
