import { Button } from '@mui/material';
import { ButtonGroup, Modal, ModalFooter, ModalHeading, ModalRef, ModalToggleButton, TextInput } from '@trussworks/react-uswds';
import React, { useRef, useState } from 'react';
import { timedDelay } from '../../../../util/util';

interface NewBucketModalProps {
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

const NewBucketModal: React.FC<NewBucketModalProps> = ({children }) => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const [formData, setFormData] = useState<SavingsBucketRowProps>( {
    data:{
      name: "", 
      amount_required: 0, 
      amount_reserved: 0, 
      is_currently_reserved: false, 
    }
  });


  async function sendNewBucket(bucket : SavingsBucketRowProps){
    // Sets buttons to 'waiting', prevent closing
    setIsSending(true);

    //send post to endpoint
    //on success, refreshSavingsBuckets();

    //POST to endpoint
    // const repsonse = await fetch(... send bucket)
    console.log("timer started")
    console.log("SENDING BUCKET", bucket); // <--- This is the bucket to send to the post endpoint

    await timedDelay(1000);

    console.log("timer done")

    //if good: refreshSavingsBuckets
    //else: return error

    // Reallow all user input again
    setIsSending(false);

}
  
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // action(formData);


    await sendNewBucket(formData);

    // if successful:
    // short Delay with sent message
    // if error:
    // stop and show error message

    modalRef.current?.toggleModal();
  }

  return (
    <div>
      <h2>{children}</h2>
      <ModalToggleButton modalRef={modalRef} opener>
        Add new savings bucket
        </ModalToggleButton>
        

        <Modal ref={modalRef} id="example-modal-1" aria-labelledby="modal-1-heading" aria-describedby="modal-1-description">
          <ModalHeading id="modal-1-heading">
            Add new savings bucket
          </ModalHeading>
            <div>
                <TextInput  type="text" name="name" value={formData.data.name} onChange={handleChangeInput} placeholder="Name" id={''} />
                <TextInput  type="number" name="amount_required" value={formData.data.amount_required} onChange={handleChangeInput} placeholder="Amount" id={''} />
            </div>
            
          <ModalFooter>
            <ButtonGroup>
              {/* <ModalToggleButton modalRef={modalRef} >
              </ModalToggleButton> */}

              <Button onClick={handleSubmit} disabled={isSending}>
                Submit new
              </Button>
              <ModalToggleButton modalRef={modalRef} closer unstyled className="padding-105 text-center" disabled={isSending}>
                Go back
              </ModalToggleButton>
            </ButtonGroup>
          </ModalFooter>
        </Modal>


      {/* <Button onClick={action}>Add new savings bucket</Button> */}
    </div>
  );
};

export default NewBucketModal;
