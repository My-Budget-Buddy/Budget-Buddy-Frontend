import {  Checkbox, Label, Modal, ModalFooter, ModalHeading, ModalRef, ModalToggleButton, TextInput, Textarea, Icon, Table, Button } from "@trussworks/react-uswds";
import { useRef } from "react";

interface CategoryProps {
    category: string;
    budgeted: number;
    isReserved: boolean;
    notes: string;
}

const transactions = [
    { date: '02/20', name: 'Metro by T-Mobile', category: 'Bills & Utilities', amount: '30.00' },
    { date: '02/20', name: 'Publix', category: 'Groceries', amount: '15.85' },
    { date: '02/19', name: 'McDonalds', category: 'Dining Out', amount: '5.00' },
    { date: '02/18', name: 'Shell', category: 'Transportation', amount: '20.00' },
    { date: '02/18', name: 'Walmart', category: 'Groceries', amount: '50.00' },
    { date: '02/20', name: 'Metro by T-Mobile', category: 'Bills & Utilities', amount: '30.00' },
    { date: '02/20', name: 'Publix', category: 'Groceries', amount: '15.85' },
    { date: '02/19', name: 'McDonalds', category: 'Dining Out', amount: '5.00' },
    { date: '02/18', name: 'Shell', category: 'Transportation', amount: '20.00' },
    { date: '02/18', name: 'Walmart', category: 'Groceries', amount: '50.00' },
    { date: '02/20', name: 'Metro by T-Mobile', category: 'Bills & Utilities', amount: '30.00' },
    { date: '02/20', name: 'Publix', category: 'Groceries', amount: '15.85' },
    { date: '02/19', name: 'McDonalds', category: 'Dining Out', amount: '5.00' },
    { date: '02/18', name: 'Shell', category: 'Transportation', amount: '20.00' },
    { date: '02/18', name: 'Walmart', category: 'Groceries', amount: '50.00' },
    
];

const BudgetDetailsModal: React.FC<CategoryProps> = ({ category, budgeted, isReserved, notes }) => {
    const modalRef = useRef<ModalRef>(null);
    return(
        <>
            <ModalToggleButton modalRef={modalRef} opener unstyled>
                <Icon.NavigateNext />
            </ModalToggleButton>

            <Modal ref={modalRef} isLarge aria-labelledby="modal-3-heading" aria-describedby="modal-3-description" id="example-modal-3">
                <ModalHeading id="modal-3-heading">
                    Budget Details
                </ModalHeading>

                <div className="flex">
                    <div className="w-1/2 mr-4">
                    <Label htmlFor='category'>Category</Label>
                <TextInput id='category' name='category' type='text' defaultValue={ category } disabled></TextInput>

                <Label htmlFor='budgeted'>Monthly Budget</Label>
                <TextInput id='budgeted' name='budgeted' type='number' defaultValue={ budgeted } disabled></TextInput>

                <Checkbox id='is-reserved' name="is-reserved-checkbox" label='Reserve budget from available funds' className="mt-8" defaultChecked={ isReserved } onChange={() => {}} disabled/>
                    </div>

                    <div className="w-1/2">
                        <Label htmlFor='notes' >Notes:</Label>
                        <Textarea id="notes" name="notes" defaultValue={ notes } disabled/>
                    </div>
                    
                </div>

                <h1>Transaction History</h1>
               
                <div className="overflow-y-auto max-h-96">
                <Table fullWidth >
                    <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Name</th>
                        <th scope="col">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.date}</td>
                            <td>{transaction.name}</td>
                            <td><Icon.AttachMoney />{transaction.amount}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                </div>
                {/*
                <Label htmlFor='category'>Category</Label>
                <TextInput id='category' name='category' type='text' defaultValue={ category } disabled></TextInput>

                <Label htmlFor='budgeted'>Monthly Budget</Label>
                <TextInput id='budgeted' name='budgeted' type='number' defaultValue={ budgeted } disabled></TextInput>

                <Checkbox id='is-reserved' name="is-reserved-checkbox" label='Reserve budget from available funds' className="mt-8" defaultChecked={ isReserved } onChange={() => {}} disabled/>

                <Label htmlFor='notes' >Notes:</Label>
                <Textarea id="notes" name="notes" defaultValue={ notes } disabled/>
    */}
                <ModalFooter>
                        <ModalToggleButton modalRef={modalRef} closer>
                            Done
                        </ModalToggleButton>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default BudgetDetailsModal