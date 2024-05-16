import {  Checkbox, Label, Modal, ModalFooter, ModalHeading, ModalRef, ModalToggleButton, TextInput, Textarea } from "@trussworks/react-uswds";
import { useRef } from "react";

const NewCategoryModal: React.FC = () => {
    const modalRef = useRef<ModalRef>(null);
    return(
        <>
            <ModalToggleButton modalRef={modalRef} opener>
                Add Budget
            </ModalToggleButton>

            <Modal ref={modalRef} aria-labelledby="modal-3-heading" aria-describedby="modal-3-description" id="example-modal-3">
                <ModalHeading id="modal-3-heading">
                    Add a new Budget
                </ModalHeading>
                
                <Label htmlFor='category'>Category</Label>
                <TextInput id='category' name='category' type='text'></TextInput>

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