import {  Checkbox, Label, Modal, ModalFooter, ModalHeading, ModalRef, ModalToggleButton, TextInput, Textarea, Icon } from "@trussworks/react-uswds";
import { useRef } from "react";

interface CategoryProps {
    category: string;
    budgeted: number;
    reserve: boolean;
    notes: string;
}

const CategoryModal: React.FC<CategoryProps> = ({ category, budgeted, reserve, notes }) => {
    const modalRef = useRef<ModalRef>(null);
    return(
        <>
            <ModalToggleButton modalRef={modalRef} opener unstyled>
                <Icon.NavigateNext />
            </ModalToggleButton>

            <Modal ref={modalRef} aria-labelledby="modal-3-heading" aria-describedby="modal-3-description" id="example-modal-3">
                <ModalHeading id="modal-3-heading">
                    Budget
                </ModalHeading>
                
                <Label htmlFor='category'>Category</Label>
                <TextInput id='category' name='category' type='text' defaultValue={ category }></TextInput>

                <Label htmlFor='budgeted'>Monthly Budget</Label>
                <TextInput id='budgeted' name='budgeted' type='number' defaultValue={ budgeted }></TextInput>

                <Checkbox id='reserve' name="reserve-checkbox" label='Reserve budget from available funds' className="mt-8" checked={ reserve } onChange={() => {}}/>

                <Label htmlFor='notes' >Notes:</Label>
                <Textarea id="notes" name="notes" defaultValue={ notes }/>
                
                <ModalFooter>
                        <ModalToggleButton modalRef={modalRef} closer>
                            Save
                        </ModalToggleButton>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default CategoryModal