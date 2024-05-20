import {  Button, Checkbox, Label, Modal, ModalFooter, ModalHeading, ModalRef, ModalToggleButton, Select, TextInput, Textarea } from "@trussworks/react-uswds";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { BudgetProps } from "../../../../util/misc/interfaces";
import { setIsSending } from "../../../../util/redux/simpleSubmissionSlice";
import { timedDelay } from "../../../../util/util";

const NewCategoryModal: React.FC = () => {
    //TODO Update Budget data schema
    const [formData, setFormData] = useState<BudgetProps>( {
        data:{
          value: 0
        }
    });


    const modalRef = useRef<ModalRef>(null);

    const dispatch = useAppDispatch();  
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);    
  
    //TODO Use something to handle form state in the formData state object. This is just a starting point.
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
  
    async function sendNewBudget(bucket : BudgetProps){
      // Sets buttons to 'waiting', prevent closing
      dispatch(setIsSending(true));
      console.log("UPDATING BUCKET..."); // <--- This is the bucket to send to the post endpoint
  
      await timedDelay(1000); //TODO POST REQUEST HERE
  
      console.log("BUCKET SENT: ", bucket)
  
      //if good: refreshSavingsBuckets
      //else: return error
  
      // Reallow all user input again
      dispatch(setIsSending(false));
    }

    async function handleSubmit(e: React.FormEvent){
      e.preventDefault();
      await sendNewBudget(formData)
      modalRef.current?.toggleModal();
    }

    return(
        <>
            <ModalToggleButton modalRef={modalRef} opener className='mx-2'>
                Add New Budget
            </ModalToggleButton>

            <Modal ref={modalRef} aria-labelledby="modal-3-heading" aria-describedby="modal-3-description" id="example-modal-3">
                <ModalHeading id="modal-3-heading">
                    Add a new Budget
                </ModalHeading>
                
                {/* TODO Populate with data from higher level, and use the stateful information in these input fields */}
                <Label htmlFor="input-select">Category</Label>
                <Select id="input-select" name="input-select">
                    <option>- Select -</option>
                    {/* GET category list from transactions service
                        categories.map((category)=>{
                            <option value={category.name}>{category.name}</option>
                        })
                    */}
                    <option value='category 1'>category 1</option>
                    <option value='category 2'>category 2</option>
                    <option value='category 3'>category 3</option>
                </Select>

                <Label htmlFor='budgeted'>Monthly Budget</Label>
                <TextInput id='budgeted' name='budgeted' type='number'></TextInput>

                <Checkbox id='reserve' name="reserve-checkbox" label='Reserve budget from available funds' className="mt-8"/>

                <Label htmlFor='notes' >Notes:</Label>
                <Textarea id="notes" name="notes" />
                
                
                <ModalFooter>
                    <Button onClick={handleSubmit} disabled={isSending} type={'button'}>
                        Submit new
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default NewCategoryModal