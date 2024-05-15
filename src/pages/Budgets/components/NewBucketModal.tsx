import { ButtonGroup, Modal, ModalFooter, ModalHeading, ModalRef, ModalToggleButton, TextInput } from '@trussworks/react-uswds';
import React, { useRef, useState } from 'react';
import { SavingsBucketRowProps } from '../../../util/interfaces/interfaces';
import CategoryPicker from './CategoryPicker';

interface NewBucketModalProps {
  action: () => void;
  children: React.ReactNode;
}

const NewBucketModal: React.FC<NewBucketModalProps> = ({ action, children }) => {
    const [formData, setFormData] = useState<SavingsBucketRowProps>( {data:{
        name: "name", 
        amount_required: 1000, 
        amount_reserved: 5, 
        is_currently_reserved: false, 
        category: "misc" 
      }});
    
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

    const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        
        console.log(action)
        //TODO Post to endpoint with data

      };

  return (
    <div>
      <h2>{children}</h2>
      <ModalToggleButton modalRef={modalRef} opener>
          Open default modal
        </ModalToggleButton>
        

        <Modal ref={modalRef} id="example-modal-1" aria-labelledby="modal-1-heading" aria-describedby="modal-1-description">
          <ModalHeading id="modal-1-heading">
            Add new savings bucket
          </ModalHeading>
            <div>
                <TextInput  type="text" name="name" value={formData.data.name} onChange={handleChangeInput} placeholder="Name" id={''} />
                <TextInput  type="number" name="amount" value={formData.data.amount_required} onChange={handleChangeInput} placeholder="Amount" id={''} />
                <CategoryPicker value={formData.data.category} onChange={handleChangeSelect}/> 
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

export default NewBucketModal;
