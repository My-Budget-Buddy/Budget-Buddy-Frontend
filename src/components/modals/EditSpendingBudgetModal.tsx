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
import { useAppDispatch, useAppSelector } from "../../utils/redux/hooks";
import { setIsSending } from "../../utils/redux/simpleSubmissionSlice";
import { useTranslation } from "react-i18next";
import { updateMonthlySummary } from "../../api/requests/summaryRequests";

interface MonthlySummary {
    summaryId: number;
    totalBudgetAmount?: number;
}

const EditSpendingBudgetModal: React.FC<MonthlySummary> = ({ summaryId, totalBudgetAmount }) => {
    const { t } = useTranslation();
    const budgetsStore = useAppSelector((store) => store.budgets);
    const selectedMonthString = budgetsStore.selectedMonthString;
    const selectedYear = budgetsStore.selectedYear;

    const [formData, setFormData] = useState({
        summaryId: summaryId,
        totalBudgetAmount: totalBudgetAmount
    });

    const modalRef = useRef<ModalRef>(null);

    const dispatch = useAppDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        dispatch(setIsSending(true));
        await updateMonthlySummary(formData.summaryId, formData);
        console.log("summary submit form data summary id", formData.summaryId);
        console.log("summary submit form data", formData);
        dispatch(setIsSending(false));
        modalRef.current?.toggleModal();
    }

    const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;

        // Nested data interface is useful to keep simple top level component declarations, but leads to this.
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    // resets form data
    const handleModalOpen = () => {
        setFormData({
            summaryId: summaryId,
            totalBudgetAmount: totalBudgetAmount
        });
    };

    return (
        <>
            <ModalToggleButton id="Edit-Spending-Budget" modalRef={modalRef} opener onClick={handleModalOpen}>
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
                    id="totalBudgetAmount"
                    name="totalBudgetAmount"
                    type="number"
                    //defaultValue={spendingBudget}
                    value={formData.totalBudgetAmount}
                    onChange={handleChangeInput}
                ></TextInput>

                <ModalFooter>
                    <ButtonGroup>
                        <Button id="Submit-Spending-Budget" onClick={handleSubmit} disabled={isSending} type={"button"}>
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
