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
                <Label htmlFor="category">Category</Label>
                <Select id="category" name="category" onChange={handleChangeInput}>
                    <option>- Select -</option>
                    {/* GET category list from transactions service
                        categories.map((category)=>{
                            <option value={category.name}>{category.name}</option>
                        })
                    */}
                    {Object.values(TransactionCategory).map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </Select>

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
                        <Button onClick={handleSubmit} disabled={isSending || hasTotalAmountError} type={"button"}>
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
