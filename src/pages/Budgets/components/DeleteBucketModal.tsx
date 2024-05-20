import {  ButtonGroup, Icon, Modal, ModalFooter, ModalHeading, ModalRef, ModalToggleButton } from "@trussworks/react-uswds";
import { useRef } from "react";

const DeleteBucketModal: React.FC = () => {
    const modalRef = useRef<ModalRef>(null);
    return(
        <>
            <ModalToggleButton modalRef={modalRef} opener unstyled>
                <Icon.Delete />
            </ModalToggleButton>

            <Modal ref={modalRef} aria-labelledby="modal-3-heading" aria-describedby="modal-3-description" id="example-modal-3">
                <div className='flex flex-col items-center'>
                <ModalHeading id="modal-3-heading">
                    Delete this bucket?
                </ModalHeading>

                <div>Are you sure you want to delete the NAME bucket?</div>
                
                <ModalFooter>
                    <ButtonGroup>
                        <ModalToggleButton modalRef={modalRef} secondary closer>
                            Delete
                        </ModalToggleButton>
                        <ModalToggleButton modalRef={modalRef} closer unstyled className="padding-105 text-center">
                            Go back
                        </ModalToggleButton>
                    </ButtonGroup>
                </ModalFooter>
                </div>
            </Modal>
        </>
    )
}

export default DeleteBucketModal