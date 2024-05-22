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

interface TODO_CategoryProps {
    id: number;
}

const DeleteBucketModal: React.FC<TODO_CategoryProps> = (id) => {
    const modalRef = useRef<ModalRef>(null);
    const dispatch = useAppDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);

    async function sendDeleteRequest() {
        // Sets buttons to 'waiting', prevent closing
        dispatch(setIsSending(true));

        console.log("DELETING BUCKET..."); // <--- This is the bucket to send to the post endpoint
        try {
            await deleteBucket(id.id);
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
            <ModalToggleButton modalRef={modalRef} opener unstyled>
                <Icon.Delete />
            </ModalToggleButton>

            <Modal
                ref={modalRef}
                aria-labelledby="modal-3-heading"
                aria-describedby="modal-3-description"
                id="example-modal-3"
            >
                <div className="flex flex-col items-center">
                    <ModalHeading id="modal-3-heading">Delete this bucket?</ModalHeading>

                    <div>Are you sure you want to delete the NAME bucket?</div>

                    <ModalFooter>
                        <ButtonGroup>
                            <Button onClick={handleSubmit} disabled={isSending} type={"button"} secondary>
                                Delete
                            </Button>
                            <ModalToggleButton
                                modalRef={modalRef}
                                disabled={isSending}
                                closer
                                unstyled
                                className="padding-105 text-center"
                            >
                                Go back
                            </ModalToggleButton>
                        </ButtonGroup>
                    </ModalFooter>
                </div>
            </Modal>
        </>
    );
};

export default DeleteBucketModal;
