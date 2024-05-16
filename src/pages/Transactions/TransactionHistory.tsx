/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, CardBody, CardGroup, CardHeader, DatePicker, Form, Icon, InputGroup, InputPrefix, Label, Modal, ModalRef, ModalToggleButton, Select, Table, TextInput, Textarea, Title } from "@trussworks/react-uswds";
import React, { useEffect, useRef, useState } from "react";


interface Transaction {
    id: number,
    Date: string,
    Category: string,
    Name: string,
    Amount: number,
    Note: string,
    Account: string
}

function TransactionHistory() {
    const Name: string = "Hot dogs";
    const transactionsInit: Transaction[] = [
        {
            "id": 10,
            "Date": "2023-10-11",
            "Name": "Hot dog breakfast",
            "Category": "Food",
            "Amount": 2.33,
            "Note": "One hot dog",
            "Account": "***1703"
        },
        {
            "id": 11,
            "Date": "2023-10-11",
            "Name": "Hot dog wating for train",
            "Category": "Food",
            "Amount": 4.66,
            "Note": "Anywhere from 1 to 2 hot dogs",
            "Account": "***1703"
        },
        {
            "id": 12,
            "Date": "2023-10-11",
            "Name": "Hot dog at lunch",
            "Category": "Food",
            "Amount": 9.33,
            "Note": "Sometimes I don't even eat lunch, I just blow through it",
            "Account": "***1703"
        },
        {
            "id": 13,
            "Date": "2023-10-12",
            "Name": "Hot dog breakfast",
            "Category": "Food",
            "Amount": 2.33,
            "Note": "Definitely a hot dog",
            "Account": "***1703"
        },
        {
            "id": 14,
            "Date": "2023-10-12",
            "Name": "Hot dog wating for train",
            "Category": "Food",
            "Amount": 4.66,
            "Note": "Yeah 2 hot dogs",
            "Account": "***1703"
        },
        {
            "id": 15,
            "Date": "2023-10-12",
            "Name": "Hot dog at lunch",
            "Category": "Food",
            "Amount": 9.33,
            "Note": "I don't skip lunch",
            "Account": "***1703"
        }
    ]

    const categories: Array<string> = [
        "food",
        "shopping",
        "entertainment"
    ];

    const accounts: Array<string> = [
        "***1703",
        "***6612",
        "***3231"
    ]
    const [transactions, setTransactions] = useState<Array<Transaction>>(transactionsInit);
    const [currentTransaction, setCurrentTransacation] = useState<Transaction>(transactions[0])
    const [current, setCurrent] = useState<number>(0);
    const modalRef = useRef<ModalRef>(null);


    useEffect(() => {

    }, [transactions])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target;
        const { Name, Date, Category, Amount, Note, Account } = form;
        console.log(event);
        setTransactions((transactions.map((transaction, index) => {
            if (index === current) {
                return {
                    ...transaction,
                    "Date": Date.value,
                    "Name": Name.value,
                    "Category": Category.value,
                    "Amount": Amount.value,
                    "Note": Note.value,
                    "Account": Account.value
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

    useEffect(() => {
        setCurrentTransacation(transactions[current]);
    }, [transactions]);

    return (
        <>
            <Modal ref={modalRef} id="note-modal" isLarge>
                <Form onSubmit={handleSubmit} large>
                    <div className="grid grid-cols-6 gap-5">
                        <input id={"transaction-date"} name={"Date"} className="col-span-3 usa-input usa-date-picker_external-inpu" type={"Date"} value={currentTransaction.Date} onChange={handleInputChange} />
                        <div className="col-span-3" />
                        <hr className="col-span-6" />
                        <div className="col-span-4">
                            <Label htmlFor={"transaction-name"}>Name</Label>
                            <TextInput value={currentTransaction.Name} id={"transaction-name"} name={"Name"} type={"text"} onChange={handleInputChange} />
                            <Label htmlFor={"transaction-amount"}>Amount</Label>
                            <InputGroup>
                                <InputPrefix>$</InputPrefix>
                                <TextInput value={currentTransaction.Amount} id={"transaction-amount"} name={"Amount"} type={"number"} onChange={handleInputChange} />
                            </InputGroup>
                            <Label htmlFor={"transaction-category"}>Category</Label>
                            <div className="grid grid-cols-8">
                                <Select id={"transaction-category"} name={"Category"} value={currentTransaction.Category} onChange={handleSelectChange} className="col-span-7">
                                    {categories.map((category: string) => {
                                        return (
                                            <React.Fragment key={category}>
                                                <option value={category}>{category}</option>
                                            </React.Fragment>
                                        )
                                    })}
                                </Select>
                                <Button type={"button"} className="usa-button--unstyled"><Icon.Add size={4} /></Button>
                            </div>
                            <Label htmlFor="transaction-note">Notes</Label>
                            <Textarea value={currentTransaction.Note} id="transaction-note" onChange={handleAreaChange} name="Note" />
                            <ModalToggleButton modalRef={modalRef} type="submit">submit</ModalToggleButton>
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="transaction-account">Account</Label>
                            <div className="grid grid-cols-8">
                                <Select id={"transaction-account"} name={"Account"} value={currentTransaction.Account} onChange={handleSelectChange} className="col-span-7">
                                    {accounts.map((account: string) => {
                                        return (
                                            <React.Fragment key={account}>
                                                <option value={account}>{account}</option>
                                            </React.Fragment>
                                        )
                                    })}
                                </Select>
                                <Button type={"button"} className="usa-button--unstyled"><Icon.Add size={4} /></Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>
            <div className="px-5">
                <Title>{`${Name} transaction history`}</Title>
                <CardGroup>
                    <Card gridLayout={{ col: 8 }}>
                        <CardHeader>
                            <h1>All transactions</h1>
                        </CardHeader>
                        <CardBody>
                            <Table bordered={false} fullWidth={true}>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Actions</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction: Transaction, index: number) => (
                                        <tr key={index}>
                                            <td>{transaction.Date}</td>
                                            <td>{transaction.Name}</td>
                                            <td>{transaction.Category}</td>
                                            <td><ModalToggleButton type={"button"} className="usa-button--unstyled" modalRef={modalRef} onClick={() => { setCurrent(index); setCurrentTransacation(transaction); }}><Icon.Edit size={4} /></ModalToggleButton><Button type={"button"} className="usa-button--unstyled"><Icon.Delete size={4} /></Button></td>
                                            <td>{transaction.Amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                    <Card gridLayout={{ col: 4 }}>
                        <CardHeader>Summary</CardHeader>
                        <CardBody>
                            Total spent: {transactions.reduce((sum: any, cur: any) => sum + Number(cur.Amount), 0.0)}
                            <hr />
                            Total transactions: {transactions.length}
                        </CardBody>
                    </Card>
                </CardGroup>
            </div>
        </>
    )
}

export default TransactionHistory