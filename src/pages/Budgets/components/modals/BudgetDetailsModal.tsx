import {
    Label,
    Modal,
    ModalFooter,
    ModalHeading,
    ModalRef,
    ModalToggleButton,
    Textarea,
    Icon,
    Table
} from "@trussworks/react-uswds";
import { useRef } from "react";
import { Transaction } from "../../../../types/models";
import { useTranslation } from "react-i18next";
import { categoryIconsMap } from "../util/categoryIconsMap";
import { formatCurrency } from "../../../../util/helpers";

interface BudgetDetailsProps {
    category: string;
    budgeted: number;
    actual: number;
    remaining: number;
    isReserved: boolean;
    notes: string;
    transactions: Transaction[] | undefined;
}

const BudgetDetailsModal: React.FC<BudgetDetailsProps> = ({
    category,
    budgeted,
    actual,
    remaining,
    notes,
    transactions
}) => {
    const modalRef = useRef<ModalRef>(null);
    const { t } = useTranslation();
    let transactionsLength = 0;
    let transactionsArray: Transaction[] = [];
    if (transactions) {
        transactionsLength = transactions.length;
        transactionsArray = transactions;
    }

    return (
        <>
            <ModalToggleButton modalRef={modalRef} opener unstyled>
                <Icon.NavigateNext />
            </ModalToggleButton>

            <Modal
                ref={modalRef}
                isLarge
                aria-labelledby="modal-3-heading"
                aria-describedby="modal-3-description"
                id="example-modal-3"
            >
                <ModalHeading id="modal-3-heading">{t("budgets.budget-details")}</ModalHeading>

                <div className="flex">
                    <div className="w-1/2">
                        <div className="flex justify-between mr-10 mt-12">
                            <div className="text-lg font-bold">{t("budgets.category")}:</div>
                            <div className="text-lg">
                                {categoryIconsMap.get(category)}
                                {category}
                            </div>
                        </div>

                        <div className="flex justify-between mr-10 mt-4">
                            <div className="text-lg font-bold">{t("budgets.budgeted")}:</div>
                            <div className="text-lg">{formatCurrency(budgeted)}</div>
                        </div>

                        <div className="flex justify-between mr-10 mt-4">
                            <div className="text-lg font-bold">{t("budgets.actual")}:</div>
                            <div className="text-lg">{formatCurrency(actual)}</div>
                        </div>
                        <div className="flex justify-between mr-10 mt-4">
                            <div className="text-lg font-bold">{t("budgets.remaining")}:</div>
                            <div className="text-lg">{formatCurrency(remaining)}</div>
                        </div>
                    </div>

                    <div className="w-1/2">
                        <Label htmlFor="notes">{t("budgets.notes")}:</Label>
                        <Textarea id="notes" name="notes" defaultValue={notes} disabled />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-8">
                    <div className="text-3xl">
                        {category} {t("budgets.transaction-history")}
                    </div>
                    <div className="ml-2">
                        {transactionsLength} {t("budgets.transaction-total")}
                    </div>
                </div>

                <div className="overflow-y-auto max-h-96">
                    <Table fullWidth>
                        <thead>
                            <tr>
                                <th scope="col">{t("transactions-table.date")}</th>
                                <th scope="col">{t("transactions-table.name")}</th>
                                <th scope="col">{t("transactions-table.amount")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactionsArray.map((transaction, index) => (
                                <tr key={index}>
                                    <td>{transaction.date}</td>
                                    <td>{transaction.vendorName}</td>
                                    <td>
                                        <Icon.AttachMoney />
                                        {transaction.amount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                <ModalFooter>
                    <ModalToggleButton modalRef={modalRef} closer>
                        {t("budgets.buttons.done")}
                    </ModalToggleButton>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default BudgetDetailsModal;
