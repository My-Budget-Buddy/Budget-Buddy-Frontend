import {
    Button,
    ButtonGroup,
    Icon,
    Modal,
    ModalFooter,
    ModalHeading,
    ModalRef,
    ModalToggleButton,
    TextInput
} from "@trussworks/react-uswds";
import React, { useRef, useState } from "react";
import { setIsSending } from "../../../../util/redux/simpleSubmissionSlice";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { SavingsBucketRowProps } from "../../../../types/budgetInterfaces";
import { putBucket } from "../requests/bucketRequests";
import { useTranslation } from "react-i18next";
// import { SavingsBucketRowProps } from '../../../util/interfaces/interfaces';

interface EditBucketModalProps {
    data: SavingsBucketRowProps;
    children: React.ReactNode;
}

const EditBucketModal: React.FC<EditBucketModalProps> = ({ data }, { children }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);

    const [formData, setFormData] = useState<SavingsBucketRowProps>(data);
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

    async function sendUpdatedBucket(bucket: SavingsBucketRowProps) {
        const newBucket = {
            // bucketId: 6,
            userId: 1, //TODO Try to have backend team use credentials for this field instead of passing it in body
            bucketName: formData.data.name,
            amountReserved: formData.data.amount_reserved, //TODO rename as amountReserved
            amountRequired: formData.data.amount_required,
            // dateCreated: "2024-05-21T08:39:46.726429",
            isActive: true,
            isReserved: formData.data.is_currently_reserved
            // monthYear: "2024-06"
        };

        // Sets buttons to 'waiting', prevent closing
        dispatch(setIsSending(true));

        console.log("UPDATING BUCKET...");

        // TODO The type definitions are getting out of hand
        await putBucket(newBucket, data.data.id);

        console.log("BUCKET SENT: ", bucket);

        //if good: refreshSavingsBuckets
        //else: return error

        // Reallow all user input again
        dispatch(setIsSending(false));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        await sendUpdatedBucket(formData);
        // if successful:
        // short Delay with sent message
        // if error:
        // stop and show error message
        modalRef.current?.toggleModal();
    }

    // resets form data
    const handleModalOpen = () => {
        setFormData(data);
    };

    return (
        <>
            <ModalToggleButton id="Edit-Savings-Bucket" modalRef={modalRef} opener unstyled onClick={handleModalOpen}>
                <Icon.Edit />
                {children}
            </ModalToggleButton>

            <Modal
                ref={modalRef}
                id="example-modal-1"
                aria-labelledby="modal-1-heading"
                aria-describedby="modal-1-description"
            >
                <ModalHeading id="modal-1-heading">{t("budgets.add-new-bucket")}</ModalHeading>
                <div>
                    <TextInput
                        type="text"
                        name="name"
                        value={formData.data.name}
                        onChange={handleChangeInput}
                        placeholder="Name"
                        id={formData.data.id.toString()}
                    />
                    <TextInput
                        type="number"
                        name="amount_required"
                        value={formData.data.amount_required}
                        onChange={handleChangeInput}
                        placeholder="Amount required"
                        id={""}
                    />
                </div>

                <ModalFooter>
                    <ButtonGroup>
                        <Button onClick={handleSubmit} disabled={isSending} type={"button"}>
                            {t("budgets.buttons.save")}
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

            {/* <Button onClick={action}>Add new savings bucket</Button> */}
        </>
    );
};

export default EditBucketModal;
