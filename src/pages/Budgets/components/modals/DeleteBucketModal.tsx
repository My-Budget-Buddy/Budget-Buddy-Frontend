import {
    Button,
    ButtonGroup,
    Icon,
    Modal,
    ModalFooter,
    ModalHeading,
    ModalRef,
    ModalToggleButton
} from "@trussworks/react-uswds";
import { useRef } from "react";
import { setIsSending } from "../../../../util/redux/simpleSubmissionSlice";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { deleteBucket } from "../requests/bucketRequests";
import { useTranslation } from "react-i18next";

interface TODO_CategoryProps {
    id: number;
    bucketName: string;
}

const DeleteBucketModal: React.FC<TODO_CategoryProps> = ({ id, bucketName }) => {
    const { t } = useTranslation();
    const modalRef = useRef<ModalRef>(null);
    const dispatch = useAppDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);

    async function sendDeleteRequest() {
        // Sets buttons to 'waiting', prevent closing
        dispatch(setIsSending(true));

        console.log("DELETING BUCKET..."); // <--- This is the bucket to send to the post endpoint
        try {
            await deleteBucket(id);
        } catch (e) {
            console.error(e);
        }

        console.log("BUCKET DELETED: ");

        // Reallow all user input again
        dispatch(setIsSending(false));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        await sendDeleteRequest();
        // if successful:
        // short Delay with sent message
        // if error:
        // stop and show error message

        modalRef.current?.toggleModal();
    }

    return (
        <>
            <ModalToggleButton id="Delete-Savings-Bucket" modalRef={modalRef} opener unstyled>
                <Icon.Delete />
            </ModalToggleButton>

            <Modal
                ref={modalRef}
                aria-labelledby="modal-3-heading"
                aria-describedby="modal-3-description"
                id="example-modal-3"
            >
                <div className="flex flex-col items-center">
                    <ModalHeading id="modal-3-heading">{t("budgets.delete-bucket")}</ModalHeading>

                    <div>Are you sure you want to delete the {bucketName} bucket?</div>

                    <ModalFooter>
                        <ButtonGroup>
                            <Button onClick={handleSubmit} disabled={isSending} type={"button"} secondary>
                                {t("budgets.buttons.delete")}
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
                </div>
            </Modal>
        </>
    );
};

export default DeleteBucketModal;
