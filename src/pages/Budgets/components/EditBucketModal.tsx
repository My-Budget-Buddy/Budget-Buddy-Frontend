import { ButtonGroup, Modal, ModalFooter, ModalHeading, ModalRef, ModalToggleButton, TextInput } from '@trussworks/react-uswds';
import React, { useRef, useState } from 'react';
// import { SavingsBucketRowProps } from '../../../util/interfaces/interfaces';

interface NewBucketModalProps {
    action: () => void;
    data: SavingsBucketRowPropsAlt
}


interface SavingsBucketRowPropsAlt {
    name: string;
    amount_required: number;
    amount_reserved: number;
    is_currently_reserved: boolean;
    category: string;
    // Add more fields as needed
  }


const EditBucketModal: React.FC<NewBucketModalProps> = ({ action, data }) => {
    const [formData, setFormData] = useState<SavingsBucketRowPropsAlt>(data);
    
    const modalRef = useRef<ModalRef>(null);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // TODO
        // eslint-disable-next-line @typescript-eslint/no-explicit-any 
        setFormData((prevState: any) => ({
          ...prevState,
          [name]: value
        }));
      };
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log(formData)
        console.log(action)
        //TODO Post to endpoint with data

      };

  return (
    <div>
      <ModalToggleButton modalRef={modalRef} opener>
          Edit Bucket
        </ModalToggleButton>
        

        <Modal ref={modalRef} id="example-modal-1" aria-labelledby="modal-1-heading" aria-describedby="modal-1-description">
          <ModalHeading id="modal-1-heading">
            Add new savings bucket
          </ModalHeading>
            <div>
                <TextInput  type="text" name="name" value={formData.name} onChange={handleChangeInput} placeholder="Name" id={''} />
                <TextInput  type="number" name="amount_required" value={formData.amount_required} onChange={handleChangeInput} placeholder="Amount required" id={''} />
            </div>
            
          <ModalFooter>
            <ButtonGroup>
              <ModalToggleButton modalRef={modalRef} onClick={handleSubmit} closer>
                Continue without saving
              </ModalToggleButton>
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

export default EditBucketModal;
