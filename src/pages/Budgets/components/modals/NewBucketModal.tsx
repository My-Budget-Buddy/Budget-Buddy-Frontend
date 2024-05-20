import { Button } from '@mui/material';
import { ButtonGroup, Modal, ModalFooter, ModalHeading, ModalRef, ModalToggleButton, TextInput } from '@trussworks/react-uswds';
import React, { useRef, useState } from 'react';
// import { SavingsBucketRowProps } from '../../../util/interfaces/interfaces';

interface NewBucketModalProps {
  action: (e: SavingsBucketRowProps) => void;
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

const NewBucketModal: React.FC<NewBucketModalProps> = ({ action, children }) => {
    const [formData, setFormData] = useState<SavingsBucketRowProps>( {
      data:{
        name: "", 
        amount_required: 0, 
        amount_reserved: 0, 
        is_currently_reserved: false, 
      }
    });
    
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

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        action(formData);
        modalRef.current?.toggleModal();
      };

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

              <Button onClick={handleSubmit}>
                Submit new
              </Button>
              <ModalToggleButton modalRef={modalRef} closer unstyled className="padding-105 text-center">
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
