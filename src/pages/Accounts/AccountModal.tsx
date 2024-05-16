import {
  Label,
  Modal,
  Select,
  ModalRef,
  TextInput,
  ButtonGroup,
  ModalFooter,
  ModalHeading,
  TextInputMask,
  ModalToggleButton,
  Form,
  Button,
} from "@trussworks/react-uswds";
import React, { FormEvent } from "react";
import { useRef } from "react";

const AccountModal: React.FC = () => {
  const modalRef = useRef<ModalRef>(null);

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
      balance: e.currentTarget.elements["account-balance"].value,
    };

    console.log(fields);

    // close the modal
    modalRef.current?.toggleModal();
    return;
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
            >
              <React.Fragment key=".0">
                <option>- Select - </option>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="Credit">Credit</option>
                <option value="investments">Investments</option>
              </React.Fragment>
            </Select>

            <Label htmlFor="input-account-name" requiredMarker>
              Account Name
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
            <span id="hint-num" className="usa-hint">
              For example, 0000
            </span>
            <TextInputMask
              id="input-account-num"
              name="input-account-num"
              type="text"
              aria-labelledby="label-account-num"
              aria-describedby="hint-num"
              mask="____"
              pattern="\d{4}"
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
