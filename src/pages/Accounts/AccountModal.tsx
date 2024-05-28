import {
    Label,
    Modal,
    Select,
    ModalRef,
    TextInput,
    ButtonGroup,
    ModalFooter,
    ModalHeading,
    ModalToggleButton,
    Form,
    Button,
    Alert,
} from "@trussworks/react-uswds";
import type { Account } from "../../types/models";
import React, { FormEvent, useEffect, useState } from "react";
import { useRef } from "react";
import { postAccountData } from "../Tax/taxesAPI";
import { useTranslation } from "react-i18next";

interface AccountModalProps {
    onAccountAdded: (account: Account) => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ onAccountAdded }) => {
    const modalRef = useRef<ModalRef>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [showRoutingNumberInput, setShowRoutingNumberInput] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useTranslation();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // TODO: update the keys to match the schema that the backend expects
        const fields = {
            //@ts-expect-error elements aren't typed
            type: e.currentTarget.elements["account-type"].value as string,
            //@ts-expect-error elements aren't typed
            institution: e.currentTarget.elements["input-account-name"].value as string,
            //@ts-expect-error elements aren't typed
            accountNumber: e.currentTarget.elements["input-account-num"].value as number,
            //@ts-expect-error elements aren't typed
            routingNumber: e.currentTarget.elements["input-routing-num"].value as number,
            //@ts-expect-error elements aren't typed
            investmentRate: e.currentTarget.elements["input-interest-rate"].value as number,
            //@ts-expect-error elements aren't typed
            startingBalance: e.currentTarget.elements["account-balance"].value as number,
        };

        postAccountData(fields)

            .then((response) => {
                // if (!response.ok) {
                //     throw new Error(t("accounts.error-add"));
                // }
                console.log(JSON.stringify(response.data));
                return response.data;
            })
            .then((newAccount) => {
                onAccountAdded(newAccount);
                modalRef.current?.toggleModal();
                setIsModalOpen(prevState => !prevState); // Toggle isModalOpen
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    // will reset the form when the modal is opened
    useEffect(() => {
        if (isModalOpen && formRef.current) {
            formRef.current.reset();
        }
    }, [isModalOpen, modalRef]);

    const handleAccountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setShowRoutingNumberInput(e.target.value !== "CREDIT");
    };

    return (
        <>
            <div>
                <ModalToggleButton modalRef={modalRef} opener>
                    {t("accounts.add-account")}
                </ModalToggleButton>
                <Modal
                    ref={modalRef}
                    id="account-modal"
                    aria-labelledby="account-modal-heading"
                    aria-describedby="account-modal-description"
                >
                    <ModalHeading id="account-modal-heading">
                        {t("accounts.enter-account")}
                    </ModalHeading>
                    {error && (
                        <Alert type="error" headingLevel="h4">
                            {error}
                        </Alert>
                    )}
                    <Form ref={formRef} onSubmit={handleSubmit} className="usa-prose">
                        <Label
                            id="label-account-type"
                            htmlFor="account-type"
                            requiredMarker
                        >
                            {t("accounts.account-type")}
                        </Label>
                        <Select
                            id="account-type"
                            name="account-type"
                            aria-labelledby="label-account-type"
                            required
                            onChange={handleAccountTypeChange}
                        >
                            <React.Fragment key=".0">
                                <option>- Select - </option>
                                <option value="CHECKING">{t("accounts.checking")}</option>
                                <option value="SAVINGS">{t("accounts.savings")}</option>
                                <option value="CREDIT">{t("accounts.credit")}</option>
                                <option value="INVESTMENT">{t("accounts.investment")}</option>
                            </React.Fragment>
                        </Select>

                        <Label htmlFor="input-account-name" requiredMarker>
                            {t("accounts.institution")}
                        </Label>
                        <TextInput
                            id="input-account-name"
                            name="input-account-name"
                            type="text"
                            required
                        />

                        <Label id="label-account-num" htmlFor="account-num" requiredMarker>
                            {t("accounts.account-number")}
                        </Label>
                        <TextInput
                            id="input-account-num"
                            name="input-account-num"
                            type="text"
                            required
                            maxLength={17}
                        />
                        {showRoutingNumberInput && (
                            <>
                                <Label id="label-routing-num" htmlFor="input-routing-num" requiredMarker>
                                    {t("accounts.routing-number")}
                                </Label>
                                <TextInput
                                    id="input-routing-num"
                                    name="input-routing-num"
                                    type="text"
                                    required
                                    pattern="\d{9}"
                                    title="Routing number must be exactly 9 digits"
                                />
                            </>
                        )}

                        <Label id="label-interest-rate" htmlFor="input-interest-rate" requiredMarker>
                            {t("accounts.interest-rate")}
                        </Label>
                        <TextInput
                            id="input-interest-rate"
                            name="input-interest-rate"
                            type="text"
                            required
                        />

                        <Label htmlFor="account-balance" requiredMarker>
                            {t("accounts.balance")}
                        </Label>
                        <TextInput
                            id="account-balance"
                            name="account-balance"
                            type="text"
                            required
                        />

                        <ModalFooter>
                            <ButtonGroup>
                                <Button type="submit">{t("accounts.add")}</Button>
                                <ModalToggleButton
                                    modalRef={modalRef}
                                    closer
                                    unstyled
                                    className="padding-105 text-center"
                                >
                                    {t("accounts.back")}
                                </ModalToggleButton>
                            </ButtonGroup>
                        </ModalFooter>
                    </Form>
                </Modal>
            </div>
        </>
    );
};

export default AccountModal;
