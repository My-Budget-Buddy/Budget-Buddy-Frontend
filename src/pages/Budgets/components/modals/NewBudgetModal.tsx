import {
    Button,
    ButtonGroup,
    Checkbox,
    ErrorMessage,
    FormGroup,
    Label,
    Modal,
    ModalFooter,
    ModalHeading,
    ModalRef,
    ModalToggleButton,
    Select,
    TextInput,
    Textarea
} from "@trussworks/react-uswds";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { BudgetRowProps } from "../../../../types/budgetInterfaces";
import { setIsSending } from "../../../../util/redux/simpleSubmissionSlice";
import { timedDelay } from "../../../../util/util";
import { useSelector } from "react-redux";
import { createBudget } from "../requests/budgetRequests";
import { TransactionCategory } from "../../../../types/models";

const NewCategoryModal: React.FC = () => {
    //TODO Update Budget data schema
    const [formData, setFormData] = useState<BudgetRowProps>({
        id: 0,
        category: "",
        totalAmount: 0,
        isReserved: false,
        notes: ""
    });

    const modalRef = useRef<ModalRef>(null);

    const dispatch = useAppDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);

    const budgetsStore = useSelector((store: any) => store.budgets);

    // Input validation
    const hasTotalAmountError = !(formData.totalAmount >= 0) || formData.totalAmount.toString() === "";
    const hasSelectedCategory = formData.category !== "" && formData.category !== "default";
    let isDuplicateBudgetError = false;

    // Checks if there is a budget in the budgets array where the category matches the currently selected category
    if (budgetsStore.budgets.some((budget: any) => budget.category === formData.category)) {
        isDuplicateBudgetError = true;
    } else {
        isDuplicateBudgetError = false;
    }

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

    async function sendNewBudget(budget: BudgetRowProps) {
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
        console.log("SUBMITTING BUDGET..."); // <--- This is the bucket to send to the post endpoint

        try {
            await createBudget(newBudget);
            //TODO Display success
        } catch {
            console.error("ERROR!");
            //TODO display errror
        }

        console.log("BUDGET SENT: ", budget);

        // Reallow all user input again
        dispatch(setIsSending(false));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await sendNewBudget(formData);
        modalRef.current?.toggleModal();
    }

    return (
        <>
            <ModalToggleButton modalRef={modalRef} opener className="mx-2">
                Add New Budget
            </ModalToggleButton>

            <Modal
                ref={modalRef}
                aria-labelledby="modal-3-heading"
                aria-describedby="modal-3-description"
                id="example-modal-3"
            >
                <ModalHeading id="modal-3-heading">Add a new Budget</ModalHeading>

                {/* TODO Populate with data from higher level, and use the stateful information in these input fields */}
                <FormGroup error={isDuplicateBudgetError}>
                    <Label htmlFor="category">Category</Label>
                    {isDuplicateBudgetError ? <ErrorMessage>This budget category already exists</ErrorMessage> : null}
                    <Select id="category" name="category" onChange={handleChangeInput}>
                        <option value="default">- Select -</option>
                        {Object.values(TransactionCategory).map((category) => (
                            <option key={category} value={category} disabled={false}>
                                {category}
                            </option>
                        ))}
                    </Select>
                </FormGroup>

                <FormGroup error={hasTotalAmountError}>
                    <Label htmlFor="totalAmount">Monthly Budget</Label>
                    {hasTotalAmountError ? <ErrorMessage>Must be greater than or equal to 0</ErrorMessage> : null}
                    <TextInput
                        id="totalAmount"
                        name="totalAmount"
                        type="number"
                        value={formData.totalAmount}
                        onChange={handleChangeInput}
                        /*validationStatus={ hasTotalAmountError ? "" : "error"}  TODO Figure out what other strings are allowed in validationStatus, if any*/
                    />
                </FormGroup>

                <Checkbox
                    id="isReserve"
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
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                isSending || hasTotalAmountError || !hasSelectedCategory || isDuplicateBudgetError
                            }
                            type={"button"}
                        >
                            Submit new
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

export default NewCategoryModal;
