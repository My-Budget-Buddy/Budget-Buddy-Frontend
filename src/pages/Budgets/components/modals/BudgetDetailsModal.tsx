import { Label, Modal, ModalFooter, ModalHeading, ModalRef, ModalToggleButton, Textarea, Icon, Table } from "@trussworks/react-uswds";
import { useRef } from "react";

interface BudgetDetailsProps {
    category: string;
    budgeted: number;
    actual: number;
    remaining: number;
    isReserved: boolean;
    notes: string;
}

// mock data
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

const BudgetDetailsModal: React.FC<BudgetDetailsProps> = ({ category, budgeted, actual, remaining, isReserved, notes }) => {
    const modalRef = useRef<ModalRef>(null);

    const transactionsLength = transactions.length;

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
                    <div className="w-1/2">
                        <div className="flex justify-between mr-10 mt-12">
                            <div className="text-lg font-bold">Category:</div>
                            <div className="text-lg">{ category }</div>
                        </div>

                        <div className="flex justify-between mr-10 mt-4">
                            <div className="text-lg font-bold">Monthly Budget:</div>
                            <div className="text-lg">$ { budgeted }</div>
                        </div>

                        <div className="flex justify-between mr-10 mt-4">
                            <div className="text-lg font-bold">Actual:</div>
                            <div className="text-lg">$ { actual }</div>
                        </div>
                        <div className="flex justify-between mr-10 mt-4">
                            <div className="text-lg font-bold">Remaining:</div>
                            <div className="text-lg">$ { remaining }</div>
                        </div>

                    </div>

                    <div className="w-1/2">
                        <Label htmlFor='notes' >Notes:</Label>
                        <Textarea id="notes" name="notes" defaultValue={ notes } disabled/>
                    </div>
                    
                </div>

                <div className="flex items-center justify-between mt-8">
                    <div className="text-3xl">{ category } Transaction History</div>
                    <div className="ml-2">{transactionsLength} {'transaction(s)'} total</div>
                </div>

               
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