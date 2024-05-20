import {  Button, ButtonGroup, Icon, Modal, ModalFooter, ModalHeading, ModalRef, ModalToggleButton } from "@trussworks/react-uswds";
import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { setIsSending } from "../../../../util/redux/simpleSubmissionSlice";
import { timedDelay } from "../../../../util/util";

const DeleteBudgetModal: React.FC = () => {
    const dispatch = useAppDispatch();  
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);    
  
    const modalRef = useRef<ModalRef>(null);
  
    async function sendBudgetDeleteRequest(){
      // Sets buttons to 'waiting', prevent closing
      dispatch(setIsSending(true));
  
      console.log("DELETING BUDGET..."); // <--- This is the bucket to send to the post endpoint
  
      await timedDelay(1000);
  
      console.log("BUDGET DELETED: ")

      // Reallow all user input again
      dispatch(setIsSending(false));
  }
  
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
  
      await sendBudgetDeleteRequest();
      // if successful:
      // short Delay with sent message
      // if error:
      // stop and show error message
      modalRef.current?.toggleModal();
    }

    return(
        <>
            <ModalToggleButton modalRef={modalRef} opener unstyled>
                <Icon.Delete />
            </ModalToggleButton>

            <Modal ref={modalRef} aria-labelledby="modal-3-heading" aria-describedby="modal-3-description" id="example-modal-3">
                <div className='flex flex-col items-center'>
                <ModalHeading id="modal-3-heading">
                    Delete this budget?
                </ModalHeading>

                <div>Are you sure you want to delete the CATEGORY budget?</div>
                
                <ModalFooter>
                <ButtonGroup>
                    <Button onClick={handleSubmit} disabled={isSending} type={'button'} secondary>
                        Submit new
                    </Button>
                    <ModalToggleButton modalRef={modalRef} disabled={isSending} closer unstyled className="padding-105 text-center">
                        Go back
                    </ModalToggleButton>
                </ButtonGroup>
                </ModalFooter>
                </div>
            </Modal>
        </>
    )
}

export default DeleteBudgetModal