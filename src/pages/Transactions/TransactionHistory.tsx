import { Button, Card, CardBody, CardGroup, CardHeader, Form, Icon, InputGroup, InputPrefix, Label, Modal, ModalRef, ModalToggleButton, Select, Table, TextInput, Textarea, Title } from "@trussworks/react-uswds";
import React, { useEffect, useRef, useState } from "react";


interface Transaction {
    id: number,
    date: string,
    category: string,
    name: string,
    amount: number,
    note: string,
    account: string
}

function TransactionHistory() {
    const Name: string = "Hot dogs";
    const transactionsInit: Transaction[] = [
        {
            "id": 10,
            "date": "2023-10-11",
            "name": "Hot dog breakfast",
            "category": "Food",
            "amount": 2.33,
            "note": "One hot dog",
            "account": "***1703"
        },
        {
            "id": 11,
            "date": "2023-10-11",
            "name": "Hot dog wating for train",
            "category": "Food",
            "amount": 4.66,
            "note": "Anywhere from 1 to 2 hot dogs",
            "account": "***3231"
        },
        {
            "id": 12,
            "date": "2023-10-11",
            "name": "Hot dog at lunch",
            "category": "Food",
            "amount": 9.33,
            "note": "Sometimes I don't even eat lunch, I just blow through it",
            "account": "***1703"
        },
        {
            "id": 13,
            "date": "2023-10-12",
            "name": "Hot dog breakfast",
            "category": "Food",
            "amount": 2.33,
            "note": "Definitely a hot dog",
            "account": "***1703"
        },
        {
            "id": 14,
            "date": "2023-10-12",
            "name": "Hot dog wating for train",
            "category": "Food",
            "amount": 4.66,
            "note": "Yeah 2 hot dogs",
            "account": "***6612"
        },
        {
            "id": 15,
            "date": "2023-10-12",
            "name": "Hot dog at lunch",
            "category": "Food",
            "amount": 9.33,
            "note": "I don't skip lunch",
            "account": "***3231"
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
    const [current, setCurrent] = useState<number>(0);
    const [currentTransaction, setCurrentTransacation] = useState<Transaction>(transactions[current])
    const modalRef = useRef<ModalRef>(null);
    const infoRef = useRef<ModalRef>(null);

    type TransactionTarget = EventTarget & {
        name: HTMLInputElement,
        date: HTMLInputElement,
        category: HTMLSelectElement,
        amount: HTMLInputElement,
        note: HTMLTextAreaElement,
        account: HTMLSelectElement
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form: TransactionTarget = event.target as TransactionTarget;
        const { name, date, category, amount, note, account } = form;
        setTransactions((transactions.map((transaction, index) => {
            if (index === current) {
                return {
                    ...transaction,
                    "Date": String(date.value),
                    "name": String(name.value),
                    "category": String(category.value),
                    "amount": Number(amount.value),
                    "note": String(note.value),
                    "account": String(account.value)
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
                return {
                    ...transaction,
                    [name]: value
                }
            }
            else
                return transaction;
        })));
    }

    useEffect(() => {
        setCurrentTransacation(transactions[current]);
    }, [transactions, current]);

    return (
        <>
            <div>
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
                                            <td>{transaction.date}</td>
                                            <td>{transaction.name}</td>
                                            <td>{transaction.category}</td>
                                            <td><ModalToggleButton type={"button"} className="usa-button--unstyled" modalRef={modalRef} onClick={() => { setCurrent(index) }}><Icon.Edit size={4} /></ModalToggleButton><Button type={"button"} className="usa-button--unstyled"><Icon.Delete size={4} /></Button></td>
                                            <td><Icon.AttachMoney />{transaction.amount}</td>
                                            <td><ModalToggleButton type="button" className="usa-button--unstyled" modalRef={infoRef} onClick={() => { setCurrent(index) }}><Icon.NavigateNext /></ModalToggleButton></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                    <Card gridLayout={{ col: 4 }}>
                        <CardHeader>Summary</CardHeader>
                        <CardBody>
                            Total spent: {transactions.reduce((sum, cur) => sum + Number(cur.amount), 0.0)}
                            <hr />
                            Total transactions: {transactions.length}
                        </CardBody>
                    </Card>
                </CardGroup>
            </div>
            <Modal ref={modalRef} id="note-modal" isLarge>
                <Form onSubmit={handleSubmit} large>
                    <div className="grid grid-cols-6 gap-5">
                        <input id={"transaction-date"} name={"date"} className="col-span-3 usa-input usa-date-picker_external-inpu" type={"date"} value={currentTransaction.date} onChange={handleInputChange} />
                        <div className="col-span-3" />
                        <hr className="col-span-6" />
                        <div className="col-span-4">
                            <Label htmlFor={"transaction-name"}>Name</Label>
                            <TextInput value={currentTransaction.name} id={"transaction-name"} name={"name"} type={"text"} onChange={handleInputChange} />
                            <Label htmlFor={"transaction-amount"}>Amount</Label>
                            <InputGroup>
                                <InputPrefix>$</InputPrefix>
                                <TextInput value={currentTransaction.amount} id={"transaction-amount"} name={"amount"} type={"number"} onChange={handleInputChange} />
                            </InputGroup>
                            <Label htmlFor={"transaction-category"}>Category</Label>
                            <div className="grid grid-cols-8">
                                <Select id={"transaction-category"} name={"category"} value={currentTransaction.category} onChange={handleSelectChange} className="col-span-8">
                                    {categories.map((category: string) => {
                                        return (
                                            <React.Fragment key={category}>
                                                <option value={category}>{category}</option>
                                            </React.Fragment>
                                        )
                                    })}
                                </Select>
                                {/* <Button type={"button"} className="usa-button--unstyled"><Icon.Add size={4} /></Button> */}
                            </div>
                            <Label htmlFor="transaction-note">Notes</Label>
                            <Textarea value={currentTransaction.note} id="transaction-note" onChange={handleAreaChange} name="note" />
                            <ModalToggleButton modalRef={modalRef} type="submit">submit</ModalToggleButton>
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="transaction-account">Account</Label>
                            <div className="grid grid-cols-8">
                                <Select id={"transaction-account"} name={"account"} value={currentTransaction.account} onChange={handleSelectChange} className="col-span-8">
                                    {accounts.map((account: string) => {
                                        return (
                                            <React.Fragment key={account}>
                                                <option value={account}>{account}</option>
                                            </React.Fragment>
                                        )
                                    })}
                                </Select>
                                {/* <Button type={"button"} className="usa-button--unstyled"><Icon.Add size={4} /></Button> */}
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>
            <Modal ref={infoRef} id="info-modal" isLarge>
                <div className="grid grid-cols-6 gap-5">
                    <input name={"date"} className="col-span-3 usa-input usa-date-picker_external-inpu" type={"date"} value={currentTransaction.date} onChange={handleInputChange} readOnly disabled/>
                    <div className="col-span-3" />
                    <hr className="col-span-6" />
                    <div className="col-span-4">
                        <Label htmlFor={"info-name"}>Name</Label>
                        <TextInput value={currentTransaction.name} id={"info-name"} name={"name"} type={"text"} onChange={handleInputChange} readOnly disabled/>
                        <Label htmlFor={"info-amount"}>Amount</Label>
                        <InputGroup>
                            <InputPrefix>$</InputPrefix>
                            <TextInput value={currentTransaction.amount} id={"info-amount"} name={"amount"} type={"number"} onChange={handleInputChange} readOnly disabled />
                        </InputGroup>
                        <Label htmlFor={"info-category"}>Category</Label>
                        <div className="grid grid-cols-8">
                            <Select id={"info-category"} name={"category"} value={currentTransaction.category} onChange={handleSelectChange} className="col-span-8" disabled>
                                {categories.map((category: string) => {
                                    return (
                                        <React.Fragment key={category}>
                                            <option value={category}>{category}</option>
                                        </React.Fragment>
                                    )
                                })}
                            </Select>
                        </div>
                        <Label htmlFor="info-note">Notes</Label>
                        <Textarea value={currentTransaction.note} id="info-note" onChange={handleAreaChange} name="note" readOnly disabled />
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="info-account">Account</Label>
                        <div className="grid grid-cols-8">
                            <Select id={"info-account"} name={"account"} value={currentTransaction.account} onChange={handleSelectChange} className="col-span-8" disabled>
                                {accounts.map((account: string) => {
                                    return (
                                        <React.Fragment key={account}>
                                            <option value={account}>{account}</option>
                                        </React.Fragment>
                                    )
                                })}
                            </Select>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default TransactionHistory
