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
import { useTranslation } from "react-i18next";
import { updateSpendingBudgetFor } from "../requests/summaryRequests";

const EditSpendingBudgetModal: React.FC = () => {
    const { t } = useTranslation();
    const budgetsStore = useAppSelector((store) => store.budgets);
    const selectedMonthString = budgetsStore.selectedMonthString;
    const selectedYear = budgetsStore.selectedYear;
    const spendingBudget = budgetsStore.spendingBudget;
    const curMonthYear = budgetsStore.monthYear;

    const [formData, setFormData] = useState<BudgetProps>({
        data: {
            value: 0
        }
    });

    const modalRef = useRef<ModalRef>(null);

    const dispatch = useAppDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);

    const userId = useAppSelector((state) => state.user.userId);

    async function sendUpdatedBudget(budget: BudgetProps) {
        // Sets buttons to 'waiting', prevent closing
        dispatch(setIsSending(true));
        console.log("UPDATING BUDGET..."); // <--- This is the bucket to send to the post endpoint
        await updateSpendingBudgetFor(userId, curMonthYear, formData.data.value);
        console.log("BUDGET SENT: ", budget);
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
                    {t("budgets.edit")} {selectedMonthString} {selectedYear} {t("budgets.spending-budget")}
                </ModalHeading>

                <Label htmlFor="monthly-budget">{t("budgets.spending-budget")}</Label>
                <TextInput
                    id="monthly-budget"
                    name="monthly-budget"
                    type="number"
                    defaultValue={spendingBudget}
                    value={formData.data.value}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                        //TODO Enforce form validation.
                        setFormData({ data: { value: e.target.value as unknown as number } });
                    }}
                ></TextInput>

                <ModalFooter>
                    <ButtonGroup>
                        <Button onClick={handleSubmit} disabled={isSending} type={"button"}>
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
        </>
    );
};

export default EditSpendingBudgetModal;
