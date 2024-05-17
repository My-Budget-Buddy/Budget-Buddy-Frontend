import {  Checkbox, Label, Modal, ModalFooter, ModalHeading, ModalRef, ModalToggleButton, Select, TextInput, Textarea } from "@trussworks/react-uswds";
import { useRef } from "react";

const NewCategoryModal: React.FC = () => {
    const modalRef = useRef<ModalRef>(null);

    return(
        <>
            <ModalToggleButton modalRef={modalRef} opener className='mx-2'>
                Add Budget
            </ModalToggleButton>

            <Modal ref={modalRef} aria-labelledby="modal-3-heading" aria-describedby="modal-3-description" id="example-modal-3">
                <ModalHeading id="modal-3-heading">
                    Add a new Budget
                </ModalHeading>
                
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
                        <ModalToggleButton modalRef={modalRef} closer>
                            Add Budget
                        </ModalToggleButton>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default NewCategoryModal