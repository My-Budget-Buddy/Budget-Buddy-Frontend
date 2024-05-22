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
import React, { FormEvent, useState } from "react";
import { useRef } from "react";

interface AccountModalProps {
    onAccountAdded: (account: Account) => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ onAccountAdded }) => {
    const modalRef = useRef<ModalRef>(null);
    const [showRoutingNumberInput, setShowRoutingNumberInput] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // TODO: update the keys to match the schema that the backend expects
        const fields = {
            //@ts-expect-error elements aren't typed
            type: e.currentTarget.elements["account-type"].value,
            //@ts-expect-error elements aren't typed
            name: e.currentTarget.elements["input-account-name"].value,
            //@ts-expect-error elements aren't typed
            accountNumber: e.currentTarget.elements["input-account-num"].value,
            //@ts-expect-error elements aren't typed
            routingNumber: e.currentTarget.elements["input-routing-num"].value,
            //@ts-expect-error elements aren't typed
            interestRate: e.currentTarget.elements["input-interest-rate"].value,
            //@ts-expect-error elements aren't typed
            balance: e.currentTarget.elements["account-balance"].value,
        };

        fetch(`http://localhost:8125/accounts/1`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fields),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error adding account");
                }
                return response.json();
            })
            .then((newAccount) => {
                onAccountAdded(newAccount);
                modalRef.current?.toggleModal();
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const handleAccountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setShowRoutingNumberInput(e.target.value !== "credit");
    };

    return (
        <>
            <div>
                <ModalToggleButton modalRef={modalRef} opener>
                    Add Account
                </ModalToggleButton>
                <Modal
                    ref={modalRef}
                    id="account-modal"
                    aria-labelledby="account-modal-heading"
                    aria-describedby="account-modal-description"
                >
                    <ModalHeading id="account-modal-heading">
                        Enter the Account Details
                    </ModalHeading>
                    {error && (
                        <Alert type="error" headingLevel="h4">
                            {error}
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit} className="usa-prose">
                        <Label
                            id="label-account-type"
                            htmlFor="account-type"
                            requiredMarker
                        >
                            Account Type
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
                                <option value="checking">Checking</option>
                                <option value="savings">Savings</option>
                                <option value="credit">Credit</option>
                                <option value="investments">Investments</option>
                            </React.Fragment>
                        </Select>

                        <Label htmlFor="input-account-name" requiredMarker>
                            Institution Name
                        </Label>
                        <TextInput
                            id="input-account-name"
                            name="input-account-name"
                            type="text"
                            required
                        />

                        <Label id="label-account-num" htmlFor="account-num" requiredMarker>
                            Account Number
                        </Label>
                        <TextInput
                            id="input-account-num"
                            name="input-account-num"
                            type="text"
                            required
                        />
                        {showRoutingNumberInput && (
                            <>
                                <Label id="label-routing-num" htmlFor="routing-num" requiredMarker>
                                    Routing Number
                                </Label>
                                <TextInput
                                    id="input-routing-num"
                                    name="input-routing-num"
                                    type="text"
                                    required
                                />
                            </>
                        )}

                        <Label id="label-interest-rate" htmlFor="interest-rate" requiredMarker>
                            Interest Rate
                        </Label>
                        <TextInput
                            id="input-interest-rate"
                            name="input-interest-rate"
                            type="text"
                            required
                        />

                        <Label htmlFor="account-balance" requiredMarker>
                            Balance
                        </Label>
                        <TextInput
                            id="account-balance"
                            name="account-balance"
                            type="text"
                            required
                        />

                        <ModalFooter>
                            <ButtonGroup>
                                <Button type="submit">Add Account</Button>
                                <ModalToggleButton
                                    modalRef={modalRef}
                                    closer
                                    unstyled
                                    className="padding-105 text-center"
                                >
                                    Go back
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
