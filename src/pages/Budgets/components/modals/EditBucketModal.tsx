import { Button, ButtonGroup, Icon, Modal, ModalFooter, ModalHeading, ModalRef, ModalToggleButton, TextInput } from '@trussworks/react-uswds';
import React, { useRef, useState } from 'react';
import { setIsSending } from '../../../../util/redux/simpleSubmissionSlice';
import { timedDelay } from '../../../../util/util';
import { useAppDispatch, useAppSelector } from '../../../../util/redux/hooks';
// import { SavingsBucketRowProps } from '../../../util/interfaces/interfaces';


interface EditBucketModalProps {
  data: SavingsBucketRowProps
  children: React.ReactNode;
}



interface SavingsBucketRowProps {
  data:{
    name: string;
    amount_required: number;
    amount_reserved: number;
    is_currently_reserved: boolean;
  };
}

const EditBucketModal: React.FC<EditBucketModalProps> = ({data}, {children})  => {
  const dispatch = useAppDispatch();  
  const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);    

  const [formData, setFormData] = useState<SavingsBucketRowProps>(data);
  const modalRef = useRef<ModalRef>(null);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Nested data interface is useful to keep simple top level component declarations, but leads to this. 
    setFormData(prevState => ({
      ...prevState,
      data: {
        ...prevState.data,
        [name]: value,
      },
    }));
  };


  async function sendUpdatedBucket(bucket : SavingsBucketRowProps){
    // Sets buttons to 'waiting', prevent closing
    dispatch(setIsSending(true));

    console.log("UPDATING BUCKET..."); 

    await timedDelay(1000);  //TODO Edit request here

    console.log("BUCKET SENT: ", bucket)

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

  return (
    <>
      <ModalToggleButton modalRef={modalRef} opener unstyled>
        <Icon.Edit />
        {children}
        </ModalToggleButton>
        

        <Modal ref={modalRef} id="example-modal-1" aria-labelledby="modal-1-heading" aria-describedby="modal-1-description">
          <ModalHeading id="modal-1-heading">
            Add new savings bucket
          </ModalHeading>
            <div>
                <TextInput  type="text" name="name" value={formData.data.name} onChange={handleChangeInput} placeholder="Name" id={''} />
                <TextInput  type="number" name="amount_required" value={formData.data.amount_required} onChange={handleChangeInput} placeholder="Amount required" id={''} />
            </div>
            
          <ModalFooter>
            <ButtonGroup>
              <Button onClick={handleSubmit} disabled={isSending} type={'button'}>
                Submit new
              </Button>
              <ModalToggleButton modalRef={modalRef} disabled={isSending} closer unstyled className="padding-105 text-center">
                Go back
              </ModalToggleButton>
            </ButtonGroup>
          </ModalFooter>
        </Modal>


      {/* <Button onClick={action}>Add new savings bucket</Button> */}
    </>
  );
};

export default EditBucketModal;
