/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, CardBody, CardGroup, CardHeader, DatePicker, Icon, InputGroup, InputPrefix, InputSuffix, Label, Modal, ModalRef, ModalToggleButton, Select, Table, TextInput, Textarea, Title } from "@trussworks/react-uswds";
import React, { useRef, useState } from "react";


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
            "Date": "10/11/2023",
            "Name": "Hot dog breakfast",
            "Category": "Food",
            "Amount": 2.33,
            "Note": "One hot dog",
            "Account": "***1703"
        },
        {
            "id": 11,
            "Date": "10/11/2023",
            "Name": "Hot dog wating for train",
            "Category": "Food",
            "Amount": 4.66,
            "Note": "Anywhere from 1 to 2 hot dogs",
            "Account": "***1703"
        },
        {
            "id": 12,
            "Date": "10/11/2023",
            "Name": "Hot dog at lunch",
            "Category": "Food",
            "Amount": 9.33,
            "Note": "Sometimes I don't even eat lunch, I just blow through it",
            "Account": "***1703"
        },
        {
            "id": 13,
            "Date": "10/12/2023",
            "Name": "Hot dog breakfast",
            "Category": "Food",
            "Amount": 2.33,
            "Note": "Definitely a hot dog",
            "Account": "***1703"
        },
        {
            "id": 14,
            "Date": "10/12/2023",
            "Name": "Hot dog wating for train",
            "Category": "Food",
            "Amount": 4.66,
            "Note": "Yeah 2 hot dogs",
            "Account": "***1703"
        },
        {
            "id": 15,
            "Date": "10/12/2023",
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
    const [transactions, setTransactions] = useState<any | null>(transactionsInit);
    const [currentTransaction, setCurrentTranscation] = useState<Transaction>(transactions[0]);
    const modalRef = useRef<ModalRef>(null);

    return (
        <>
            <Modal ref={modalRef} id="note-modal" isLarge>
                <div className="grid grid-cols-6 gap-5">
                    <DatePicker id={""} name={"Date"} className="col-span-3" value={currentTransaction.Date} />
                    <div className="col-span-3" />
                    <hr className="col-span-6" />
                    <div className="col-span-4">
                        <Label htmlFor={"transaction-name"}>Name</Label>
                        <TextInput value={currentTransaction.Name} id={"transaction-name"} name={"transaction-name"} type={"text"} />
                        <Label htmlFor={"transaction-amount"}>Amount</Label>
                        <InputGroup>
                            <InputPrefix>$</InputPrefix>
                            <TextInput value={currentTransaction.Amount} id={"transaction-amount"} name={"transaction-amount"} type={"number"} />
                        </InputGroup>
                        <Label htmlFor={"transaction-category"}>Category</Label>
                        <div className="grid grid-cols-8">
                            <Select id={"transaction-category"} name={"transaction-category"} defaultValue={currentTransaction.Category} className="col-span-7">
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
                        <Textarea value={currentTransaction.Note} id="transaction-note" name="transaction-note" />
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="transaction-account">Account</Label>
                        <div className="grid grid-cols-8">
                            <Select id={"transaction-account"} name={"transaction-account"} defaultValue={currentTransaction.Account} className="col-span-7">
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
                                    {transactions.map((transaction: Transaction) => {
                                        return (
                                            <>
                                                <tr key={transaction.id}>
                                                    <td>{transaction.Date}</td>
                                                    <td>{transaction.Name}</td>
                                                    <td>{transaction.Category}</td>
                                                    <td><ModalToggleButton type={"button"} className="usa-button--unstyled" modalRef={modalRef}><Icon.Edit size={4} /></ModalToggleButton><Button type={"button"} className="usa-button--unstyled"><Icon.Delete size={4} /></Button></td>
                                                    <td>{transaction.Amount}</td>
                                                </tr>
                                            </>
                                        );
                                    })}
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