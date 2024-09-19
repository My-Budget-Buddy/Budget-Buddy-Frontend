import {
    Button,
    ButtonGroup,
    Modal,
    ModalFooter,
    ModalHeading,
    ModalRef,
    ModalToggleButton,
    TextInput
} from "@trussworks/react-uswds";
import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { setIsSending } from "../../../../util/redux/simpleSubmissionSlice";
import { SavingsBucketRowProps } from "../../../../types/budgetInterfaces";
import { postBucket } from "../requests/bucketRequests";
import { useTranslation } from "react-i18next";

interface NewBucketModalProps {
    children: React.ReactNode;
}

const NewBucketModal: React.FC<NewBucketModalProps> = ({ children }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<SavingsBucketRowProps>({
        data: {
            id: 0,
            name: "",
            amount_required: 0,
            amount_reserved: 0,
            is_currently_reserved: false
        }
    });

    const dispatch = useAppDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);
    const modalRef = useRef<ModalRef>(null);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Nested data interface is useful to keep simple top level component declarations, but leads to this.
        setFormData((prevState) => ({
            ...prevState,
            data: {
                ...prevState.data,
                [name]: value
            }
        }));
    };

    async function sendNewBucket(bucket: SavingsBucketRowProps) {
        const newBucket = {
            // bucketId: 6,
            userId: 1, //TODO Try to have backend team use credentials for this field instead of passing it in body
            bucketName: formData.data.name,
            amountReserved: 0,
            amountRequired: formData.data.amount_required,
            // dateCreated: "2024-05-21T08:39:46.726429",
            isActive: true,
            isReserved: false
            // monthYear: "2024-06"
        };

        // Sets buttons to 'waiting', prevent closing
        dispatch(setIsSending(true));

        console.log("SENDING BUCKET...");

        try {
            await postBucket(newBucket);
            //TODO Display success
        } catch {
            console.error("ERROR!");
            //TODO display errror
        }

        console.log("BUCKET SENT: ", bucket);

        // Reallow all user input again
        dispatch(setIsSending(false));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await sendNewBucket(formData);
        modalRef.current?.toggleModal();
    }

    // resets form data
    const handleModalOpen = () => {
        setFormData({
            data: {
                id: 0,
                name: "",
                amount_required: 0,
                amount_reserved: 0,
                is_currently_reserved: false
            }
        });
    };

    return (
        <div>
            <ModalToggleButton id="Add-New-Savings-Bucket" modalRef={modalRef} opener onClick={handleModalOpen}>
                {children}
            </ModalToggleButton>

            <Modal
                ref={modalRef}
                id="example-modal-1"
                aria-labelledby="modal-1-heading"
                aria-describedby="modal-1-description"
            >
                <ModalHeading id="modal-1-heading">{t("budgets.add-new-budget")}</ModalHeading>
                <div>
                    <TextInput
                        type="text"
                        name="name"
                        value={formData.data.name}
                        onChange={handleChangeInput}
                        placeholder="Name"
                        id={"Budget-Name-Input"}
                    />
                    <TextInput
                        type="number"
                        name="amount_required"
                        value={formData.data.amount_required}
                        onChange={handleChangeInput}
                        placeholder="Amount"
                        id={"Amount-Required-Input"}
                    />
                </div>

                <ModalFooter>
                    <ButtonGroup>
                        <Button id="Submit-New-Savings-Bucket" onClick={handleSubmit} disabled={isSending} type={"button"}>
                            {t("budgets.buttons.submit")}
                        </Button>
                        <ModalToggleButton modalRef={modalRef} closer unstyled className="padding-105 text-center">
                            {t("budgets.buttons.go-back")}
                        </ModalToggleButton>
                    </ButtonGroup>
                </ModalFooter>
            </Modal>

            {/* <Button onClick={action}>Add new savings bucket</Button> */}
        </div>
    );
};

export default NewBucketModal;
