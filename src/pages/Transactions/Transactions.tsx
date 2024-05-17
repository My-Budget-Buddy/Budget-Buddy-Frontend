import {
    Button,
    Card,
    CardBody,
    CardGroup,
    CardHeader,
    Form,
    Icon,
    InputGroup,
    InputPrefix,
    Label,
    Modal, ModalRef, ModalToggleButton, Select, Table, TextInput, Textarea } from '@trussworks/react-uswds';
import React, { useState, useRef, useEffect } from "react";

interface Transaction {
    id: number;
    date: string;
    name: string;
    category: string;
    amount: number;
    note: string;
    account: string;
}

const transactionsInit: Transaction[] = [
    { id: 1, date: '2023-10-11', name: 'Metro by T-Mobile', category: 'Bills & Utilities', amount: 30.00, note: '', account: '***1703' },
    { id: 2, date: '2023-10-11', name: 'Publix', category: 'Groceries', amount: 15.85, note: '', account: '***6612' },
    { id: 3, date: '2023-10-11', name: 'McDonalds', category: 'Dining Out', amount: 5.00, note: '', account: '***3231' },
    { id: 4, date: '2023-10-11', name: 'Shell', category: 'Transportation', amount: 20.00, note: '', account: '***1703' },
    { id: 5, date: '2023-10-11', name: 'Walmart', category: 'Groceries', amount: 50.00, note: '', account: '***6612' },
    { id: 6, date: '2023-10-12', name: 'AT&T', category: 'Bills & Utilities', amount: 90.00, note: '', account: '***1703' },
    { id: 7, date: '2023-10-12', name: 'Whole Foods', category: 'Groceries', amount: 75.85, note: '', account: '***6612' },
    { id: 8, date: '2023-10-13', name: 'Target', category: 'Groceries', amount: 55.50, note: '', account: '***3231' },
    { id: 9, date: '2023-10-14', name: 'Chevron', category: 'Transportation', amount: 45.00, note: '', account: '***1703' },
    { id: 10, date: '2023-10-15', name: 'Chipotle', category: 'Dining Out', amount: 15.00, note: '', account: '***6612' },
    { id: 11, date: '2023-10-15', name: 'Chick-fil-A', category: 'Dining Out', amount: 10.00, note: '', account: '***3231' },
    { id: 12, date: '2023-10-15', name: 'Chase', category: 'Bills & Utilities', amount: 100.00, note: '', account: '***6612' },
    { id: 13, date: '2023-10-16', name: 'Amazon', category: 'Groceries', amount: 70.00, note: '', account: '***3231' },
    { id: 14, date: '2023-10-17', name: 'Speedway', category: 'Transportation', amount: 25.00, note: '', account: '***1703' },
    { id: 15, date: '2023-10-18', name: 'Papa Johns', category: 'Dining Out', amount: 20.00, note: '', account: '***6612' },
    { id: 16, date: '2023-10-18', name: 'KFC', category: 'Dining Out', amount: 15.00, note: '', account: '***3231' },
    { id: 17, date: '2023-10-19', name: 'Verizon', category: 'Bills & Utilities', amount: 80.00, note: '', account: '***6612' },
    { id: 18, date: '2023-10-20', name: 'Starbucks', category: 'Dining Out', amount: 10.00, note: '', account: '***3231' },
    { id: 19, date: '2023-10-21', name: 'Dunkin', category: 'Dining Out', amount: 5.00, note: '', account: '***1703' },
    { id: 20, date: '2023-10-22', name: 'T-Mobile', category: 'Bills & Utilities', amount: 40.00, note: '', account: '***6612' },
];

const categories: Array<string> = [
    "Bills & Utilities",
    "Groceries",
    "Dining Out",
    "Transportation",
    "Entertainment",
    "Health & Fitness",
    "Personal Care",
    "Shopping",
    "Travel",
    "Education",
    "Gifts & Donations",
    "Investments",
    "Fees & Charges",
];

const accounts: Array<string> = [
    "***1703",
    "***6612",
    "***3231"
];

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(transactionsInit);
    const [currentTransaction, setCurrentTransaction] = useState<Transaction>(transactions[0]);
    const [current, setCurrent] = useState<number>(0);

    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactionsInit);
    const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

    const modalRef = useRef<ModalRef>(null);

    useEffect(() => {
        if (selectedCategory === 'All Categories') {
            setFilteredTransactions(transactions);
        } else {
            setFilteredTransactions(transactions.filter(transaction => transaction.category === selectedCategory));
        }
    }, [selectedCategory, transactions]);


    useEffect(() => {
        setCurrentTransaction(transactions[current]);
    }, [transactions, current]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const Name = formData.get('Name');
        const Date = formData.get('Date');
        const Category = formData.get('Category');
        const Amount = formData.get('Amount');
        const Note = formData.get('Note');
        const Account = formData.get('Account');
        console.log(event);
        setTransactions((transactions.map((transaction, index) => {
            if (index === current) {
                return {
                    ...transaction,
                    "Date": Date as string,
                    "Name": Name as string,
                    "Category": Category as string,
                    "Amount": Amount as string,
                    "Note": Note as string,
                    "Account": Account as string
                }
            }
            else
                return transaction;
        })));
    }
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setTransactions((transactions.map((transaction, index) => {
            if (index === current) {
                return {
                    ...transaction,
                    [name]: value
                }
            }
            else
                return transaction;
        })));
    }

    function handleAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setTransactions((transactions.map((transaction, index) => {
            if (index === current) {
                return {
                    ...transaction,
                    [name]: value
                }
            }
            else
                return transaction;
        })));
    }

    function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = event.target;
        setTransactions((transactions.map((transaction, index) => {
            if (index === current) {
                console.log({ ...transaction, [name]: value })
                return {
                    ...transaction,
                    [name]: value
                }
            }
            else
                return transaction;
        })), );
        console.log(transactions);
    }



    return (
        <div className="min-h-screen bg-gray-100 p-4 pr-10 pl-10 flex flex-col gap-6">
            {/* Top Container: Header & clear filters, add transactions & sorting*/}
            <div className="flex justify-between items-center bg-transparent p-4 ">
                <h1>Transactions</h1>
                <div className="flex gap-4">
                    <Button type="button" className="usa-button--secondary">Clear Filters</Button>
                    <select className="p-2 border rounded">
                        <option>Sort by date</option>
                        <option>Sort by amount</option>
                    </select>
                    <Button type="button" className="usa-button" onClick={() => modalRef.current?.toggleModal()}>Add Transaction</Button>
                </div>
            </div>

            {/* Middle Container: Filters */}
            <div className="flex justify-center items-center gap-4 bg-transparent p-4">
                <select className="p-2 w-40">
                    <option>All dates</option>
                </select>
                <select className="p-2 w-40" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option>All Categories</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <select className="p-2 w-40">
                    <option>All Accounts</option>
                    {accounts.map(account => (
                        <option key={account}>{account}</option>
                    ))}
                </select>
                <select className="p-2 w-40">
                    <option>All Amounts</option>
                </select>
            </div>

            {/* Bottom Container aka Transaction Table */}
            <div className="flex-grow">
                <CardGroup>
                    <Card gridLayout={{col: 12}}>
                        <CardHeader className="flex justify-center mb-5">
                            <h1>List of Transactions</h1>
                        </CardHeader>
                        <CardBody>
                            <Table fullWidth striped>
                                <thead>
                                <tr>
                                    <th scope="col">Date</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Actions</th>
                                    <th scope="col">Amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredTransactions.map((transaction, index) => (
                                    <tr key={index}>
                                        <td>{transaction.date}</td>
                                        <td>{transaction.name}</td>
                                        <td>{transaction.category}</td>
                                        <td>
                                            <ModalToggleButton type="button" className="usa-button--unstyled" modalRef={modalRef} onClick={() => { setCurrent(index); setCurrentTransaction(transaction); }}>
                                                <Icon.Edit />
                                            </ModalToggleButton>
                                            <Button type="button" className="usa-button--unstyled">
                                                <Icon.Delete />
                                            </Button>
                                        </td>
                                        <td><Icon.AttachMoney />{transaction.amount}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </CardGroup>
            </div>

            {/* Edit Transaction Modal */}
            <Modal ref={modalRef} id="transaction-modal" isLarge>
                <Form onSubmit={handleSubmit} large>
                    <div className="grid grid-cols-6 gap-5">
                        <input id="transaction-date" name="date" className="col-span-3 usa-input usa-date-picker_external-input" type="date" value={currentTransaction.date} onChange={handleInputChange} />
                        <div className="col-span-3" />
                        <hr className="col-span-6" />
                        <div className="col-span-4">
                            <Label htmlFor="transaction-name">Name</Label>
                            <TextInput value={currentTransaction.name} id="transaction-name" name="name" type="text" onChange={handleInputChange} />
                            <Label htmlFor="transaction-amount">Amount</Label>
                            <InputGroup>
                                <InputPrefix>$</InputPrefix>
                                <TextInput value={currentTransaction.amount} id="transaction-amount" name="amount" type="number" onChange={handleInputChange} />
                            </InputGroup>
                            <Label htmlFor="transaction-category">Category</Label>
                            <div className="grid grid-cols-8">
                                <Select id="transaction-category" name="category" value={currentTransaction.category} onChange={handleSelectChange} className="col-span-7">
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </Select>
                                <Button type="button" className="usa-button--unstyled"><Icon.Add size={4} /></Button>
                            </div>
                            <Label htmlFor="transaction-note">Notes</Label>
                            <Textarea value={currentTransaction.note} id="transaction-note" onChange={handleAreaChange} name="note" />
                            <ModalToggleButton modalRef={modalRef} type="submit">Submit</ModalToggleButton>
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="transaction-account">Account</Label>
                            <div className="grid grid-cols-8">
                                <Select id="transaction-account" name="account" value={currentTransaction.account} onChange={handleSelectChange} className="col-span-7">
                                    {accounts.map(account => (
                                        <option key={account} value={account}>{account}</option>
                                    ))}
                                </Select>
                                <Button type="button" className="usa-button--unstyled"><Icon.Add size={4} /></Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Transactions;
