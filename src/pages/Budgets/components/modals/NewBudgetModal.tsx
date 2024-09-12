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
import { createBudget } from "../requests/budgetRequests";
import { TransactionCategory } from "../../../../types/models";
import { useTranslation } from "react-i18next";
import useStoreRef from "../../../../overlay/useStoreRef";
import ConcreteCanvasOverlay from "../../../../overlay/concrete_overlay";
import { eventEmitter } from "../../../../overlay/event_emitter";
import { setRef } from "../../../../overlay/refStore";

const NewCategoryModal: React.FC = () => {

    const [canProgress, setCanProgress] = useState(true);
    const componentRef = useStoreRef('AddNewBudgetButton');

    // Note- refs for sub components currently don't work due to limitations
    // with USWDS components. 
    const reservedRef = useStoreRef('ReservedFromBudget');
    const categoryRef = useStoreRef('CategoryDropdown');
    const budgetedRef = useStoreRef('BudgetedAmount');
    const notesRef = useStoreRef('NotesTextbox');
    const submitRef = useStoreRef('SubmitButton');

    const rRef = useRef()

    const onClick = () => {
        eventEmitter.emit('nextStep');

    }

    const canvasOverlayRef = useRef<any>(null);


    const budgetsStore = useAppSelector((store) => store.budgets);
    const { t } = useTranslation();

    //TODO Update Budget data schema
    const [formData, setFormData] = useState<BudgetRowProps>({
        id: 0,
        category: "default",
        totalAmount: 0,
        isReserved: false,
        notes: "",
        spentAmount: 0,
        monthYear: budgetsStore.monthYear
    });

    const modalRef = useRef<ModalRef>(null);
    const dispatch = useAppDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);

    // Input validation
    const hasTotalAmountError = !(formData.totalAmount >= 0) || formData.totalAmount.toString() === "";
    const hasSelectedCategory = formData.category !== "" && formData.category !== "default";
    let isDuplicateBudgetError = false;

    // Checks if there is a budget in the budgets array where the category matches the currently selected category
    if (budgetsStore.budgets.some((budget: BudgetRowProps) => budget.category === formData.category)) {
        isDuplicateBudgetError = true;
    } else {
        isDuplicateBudgetError = false;
    }

    //TODO Use something to handle form state in the formData state object. This is just a starting point.
    const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;

        // Nested data interface is useful to keep simple top level component declarations, but leads to this.
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));

        if (canProgress) {
            eventEmitter.emit('nextStep');
            setCanProgress(false);
            setTimeout(() => {
                setCanProgress(true);
                eventEmitter.emit('nextStep');

            }, 2000);
        }

    };

    const toggleIsReserved = () => {
        setFormData((prevState) => ({
            ...prevState,
            isReserved: !prevState.isReserved
        }));
    };

    async function sendNewBudget(budget: BudgetRowProps) {

        eventEmitter.emit('nextStep');


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

    // resets form data
    const handleModalOpen = () => {
        setFormData({
            id: 0,
            category: "default",
            totalAmount: 0,
            isReserved: false,
            notes: "",
            spentAmount: 0,
            monthYear: budgetsStore.monthYear
        });

        onClick()
    };

    return (
        <div ref={componentRef}>
            <ModalToggleButton modalRef={modalRef} opener className="mx-2" onClick={handleModalOpen}>
                {t("budgets.add-new-budget")}
            </ModalToggleButton>

            <Modal
                ref={modalRef}
                aria-labelledby="modal-3-heading"
                aria-describedby="modal-3-description"
                id="example-modal-3"
            >
                <ModalHeading id="modal-3-heading">{t("budgets.add-new-budget")}</ModalHeading>

                {/* TODO Populate with data from higher level, and use the stateful information in these input fields */}
                <FormGroup error={isDuplicateBudgetError}>
                    <Label ref={categoryRef} htmlFor="category">{t("budgets.category")}</Label>
                    {isDuplicateBudgetError ? <ErrorMessage>{t("budgets.budget-already-exists")}</ErrorMessage> : null}
                    <Select id="category" name="category" value={formData.category} onChange={handleChangeInput}>
                        <option value="default">- Select -</option>
                        {/* map through all of the transaction categories. skip income. render the option as disabled if the budget already exists in the store*/}
                        {Object.values(TransactionCategory).map((category) =>
                            category === "Income" ? null : (
                                <option
                                    key={category}
                                    value={category}
                                    disabled={
                                        budgetsStore.budgets.some(
                                            (budget: BudgetRowProps) => budget.category === category
                                        )
                                            ? true
                                            : false
                                    }
                                >
                                    {t(category)}
                                </option>
                            )
                        )}
                    </Select>
                </FormGroup>

                <FormGroup ref={budgetedRef} error={hasTotalAmountError}>
                    <Label htmlFor="totalAmount">{t("budgets.budgeted")}</Label>
                    {hasTotalAmountError ? <ErrorMessage>{t("budgets.greater-than-0")}</ErrorMessage> : null}
                    <TextInput
                        id="totalAmount"
                        name="totalAmount"
                        type="number"
                        value={formData.totalAmount}
                        onChange={handleChangeInput}
                        validationStatus={hasTotalAmountError ? "error" : undefined}
                    />
                </FormGroup>

                <Checkbox
                    ref={rRef}
                    id="isReserve"
                    name="isReserved"
                    label={t("budgets.reserve-from-funds")}
                    checked={formData.isReserved}
                    onChange={toggleIsReserved}
                    className="mt-8"
                />

                <Label ref={notesRef} htmlFor="notes">{t("budgets.notes")}:</Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChangeInput} />

                <ModalFooter>
                    <ButtonGroup>
                        <Button
                            id="submitButton"
                            ref={submitRef}
                            onClick={handleSubmit}
                            disabled={
                                isSending || hasTotalAmountError || !hasSelectedCategory || isDuplicateBudgetError
                            }
                            type={"button"}
                        >
                            {t("budgets.buttons.submit")}
                        </Button>
                        <ModalToggleButton
                            modalRef={modalRef}
                            disabled={isSending}
                            closer
                            unstyled
                            className="padding-105 text-center"
                        >
                            {t("budgets.buttons.go-back")}
                        </ModalToggleButton>
                    </ButtonGroup>
                </ModalFooter>
            </Modal>

            <ConcreteCanvasOverlay
                ref={canvasOverlayRef}
                name="AddNewBudgetButton"
                effectType=""
                wraps={componentRef}
            />

        </div>
    );
};

export default NewCategoryModal;
