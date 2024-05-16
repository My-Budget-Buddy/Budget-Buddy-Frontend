import { ButtonGroup, Label, Modal, ModalFooter, ModalHeading, ModalRef, ModalToggleButton, Select, TextInput, TextInputMask } from "@trussworks/react-uswds";
import React from "react";
import { useRef } from "react";

const AccountModal: React.FC = () => {
    const modalRef = useRef<ModalRef>(null);
    return (
        <>
            <div>
                <ModalToggleButton modalRef={modalRef} opener>
                    Add Account
                </ModalToggleButton>
                <Modal ref={modalRef} id="account-modal" aria-labelledby="account-modal-heading" aria-describedby="account-modal-description">
                    <ModalHeading id="account-modal-heading">
                        Enter the Account Details
                    </ModalHeading>
                    <div className="usa-prose">
                        <Label id="account-type" htmlFor="account-type">
                            Account Type
                        </Label>
                        <Select
                            id="account-select"
                            name="account-select"
                        >
                            <React.Fragment key=".0">
                                <option>
                                    - Select -{' '}
                                </option>
                                <option value="checking">
                                    Checking
                                </option>
                                <option value="savings">
                                    Savings
                                </option>
                                <option value="Credit">
                                    Credit
                                </option>
                                <option value="investments">
                                    Investments
                                </option>
                            </React.Fragment>
                        </Select>

                        <Label id="account-name" htmlFor="account-name">
                            Account Name
                        </Label>
                        <TextInput id="input-account-name" name="input-account-name" type="text" />

                        <Label id="account-num" htmlFor="account-num">
                            Account Number
                        </Label>
                        <span id="hint-num" className="usa-hint">
                            For example, 0000
                        </span>
                        <TextInputMask id="input-type-account-num" name="input-type-account-num" type="text" aria-labelledby="account-num" aria-describedby="hint-num" mask="____" pattern="\d{4}" />

                        <Label id="account-balance" htmlFor="account-balance">
                            Balance
                        </Label>
                        <TextInput id="input-balance" name="input-balance" type="text" />

                    </div>
                    <ModalFooter>
                        <ButtonGroup>
                            <ModalToggleButton modalRef={modalRef} closer>
                                Add Account
                            </ModalToggleButton>
                            <ModalToggleButton modalRef={modalRef} closer unstyled className="padding-105 text-center">
                                Go back
                            </ModalToggleButton>
                        </ButtonGroup>
                    </ModalFooter>
                </Modal>
            </div>
        </>
    )
}

export default AccountModal