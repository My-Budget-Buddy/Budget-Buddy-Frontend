import {  Checkbox, Label, Modal, ModalFooter, ModalHeading, ModalRef, ModalToggleButton, TextInput, Textarea, Icon, ButtonGroup, Button } from "@trussworks/react-uswds";
import { useRef, useState } from "react";
import { BudgetProps } from "../../../../util/misc/interfaces";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { setIsSending } from "../../../../util/redux/simpleSubmissionSlice";
import { timedDelay } from "../../../../util/util";

interface TODO_CategoryProps {
    category: string;
    budgeted: number;
    isReserved: boolean;
    notes: string;
}

const EditBudgetModal: React.FC<TODO_CategoryProps> = ({ category, budgeted, isReserved, notes }) => {

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
      
        async function sendUpdatedBudget(budget : BudgetProps){
          // Sets buttons to 'waiting', prevent closing
          dispatch(setIsSending(true));
          console.log("UPDATING BUDGET..."); // <--- This is the bucket to send to the post endpoint
      
          await timedDelay(1000); //TODO PUT REQUEST HERE
      
          console.log("BUDGET SENT: ", budget)
      
          //if good: refreshSavingsBuckets
          //else: return error
      
          // Reallow all user input again
          dispatch(setIsSending(false));
        }
    
        async function handleSubmit(e: React.FormEvent){
          e.preventDefault();
          await sendUpdatedBudget(formData)
          modalRef.current?.toggleModal();
        }
    
    return(
        <>
            <ModalToggleButton modalRef={modalRef} opener unstyled>
                <Icon.Edit />
            </ModalToggleButton>

            <Modal ref={modalRef} aria-labelledby="modal-3-heading" aria-describedby="modal-3-description" id="example-modal-3">
                <ModalHeading id="modal-3-heading">
                   Edit Budget
                </ModalHeading>
                
                <Label htmlFor='category'>Category</Label>
                <TextInput id='category' name='category' type='text' defaultValue={ category } disabled></TextInput>

                <Label htmlFor='budgeted'>Monthly Budget</Label>
                <TextInput id='budgeted' name='budgeted' type='number' defaultValue={ budgeted }></TextInput>

                <Checkbox id='is-reserved' name="is-reserved-checkbox" label='Reserve budget from available funds' className="mt-8" defaultChecked={ isReserved } onChange={() => {}}/>

                <Label htmlFor='notes' >Notes:</Label>
                <Textarea id="notes" name="notes" defaultValue={ notes }/>
                
                <ModalFooter>
                <ButtonGroup>
                <Button onClick={handleSubmit} disabled={isSending} type={'button'}>
                    Submit edit
                </Button>
                    <ModalToggleButton modalRef={modalRef}  disabled={isSending} closer unstyled className="padding-105 text-center">
                        Go back
                    </ModalToggleButton>
                </ButtonGroup>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default EditBudgetModal