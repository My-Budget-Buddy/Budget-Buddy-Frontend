import {  Checkbox, Label, Modal, ModalFooter, ModalHeading, ModalRef, ModalToggleButton, TextInput, Textarea, Icon, ButtonGroup } from "@trussworks/react-uswds";
import { useRef } from "react";

interface CategoryProps {
    category: string;
    budgeted: number;
    isReserved: boolean;
    notes: string;
}

const EditBudgetModal: React.FC<CategoryProps> = ({ category, budgeted, isReserved, notes }) => {
    const modalRef = useRef<ModalRef>(null);
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
                    <ModalToggleButton modalRef={modalRef} closer>
                        Save
                    </ModalToggleButton>
                    <ModalToggleButton modalRef={modalRef} closer unstyled className="padding-105 text-center">
                        Go back
                    </ModalToggleButton>
                </ButtonGroup>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default EditBudgetModal