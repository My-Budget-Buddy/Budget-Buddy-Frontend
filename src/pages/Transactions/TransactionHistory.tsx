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
    Modal,
    ModalRef,
    ModalToggleButton,
    Select,
    Table,
    TextInput,
    Textarea,
    Title
} from "@trussworks/react-uswds";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMatch } from "react-router-dom";
import { BarChart } from "@mui/x-charts";

interface Transaction {
    id: number;
    date: string;
    category: string;
    name: string;
    amount: number;
    note: string;
    account: string;
}

interface TransactionDTO {
    transactionId: number;
    userId: number;
    accountId: number;
    vendorName: string;
    amount: number;
    category: string;
    description: string;
    date: string;
}

function TransactionHistory() {
    const Name = useMatch("/:first/:second/:name")?.params.name;
    const { t } = useTranslation();
    const transactionsInit: Transaction[] = [
        {
            id: 10,
            date: "2023-10-11",
            name: "Hot dog breakfast",
            category: "Food",
            amount: 2.33,
            note: "One hot dog",
            account: "***1703"
        },
        {
            id: 11,
            date: "2023-10-11",
            name: "Hot dog wating for train",
            category: "Food",
            amount: 4.66,
            note: "Anywhere from 1 to 2 hot dogs",
            account: "***3231"
        },
        {
            id: 12,
            date: "2023-10-11",
            name: "Hot dog at lunch",
            category: "Food",
            amount: 9.33,
            note: "Sometimes I don't even eat lunch, I just blow through it",
            account: "***1703"
        },
        {
            id: 13,
            date: "2023-10-12",
            name: "Hot dog breakfast",
            category: "Food",
            amount: 2.33,
            note: "Definitely a hot dog",
            account: "***1703"
        },
        {
            id: 14,
            date: "2023-10-12",
            name: "Hot dog wating for train",
            category: "Food",
            amount: 4.66,
            note: "Yeah 2 hot dogs",
            account: "***6612"
        },
        {
            id: 15,
            date: "2023-10-12",
            name: "Hot dog at lunch",
            category: "Food",
            amount: 9.33,
            note: "I don't skip lunch",
            account: "***3231"
        }
    ];

    const categories: Array<string> = ["food", "shopping", "entertainment"];

    const accounts: Array<string> = ["***1703", "***6612", "***3231"];
    const [transactions, setTransactions] = useState<Array<Transaction>>(transactionsInit);
    const [current, setCurrent] = useState<number>(0);
    const modalRef = useRef<ModalRef>(null);
    const infoRef = useRef<ModalRef>(null);
    const [infoTransaction, setInfoTransaction] = useState<Transaction | null>(null);

    type TransactionTarget = EventTarget & {
        name: HTMLInputElement;
        date: HTMLInputElement;
        category: HTMLSelectElement;
        amount: HTMLInputElement;
        note: HTMLTextAreaElement;
        account: HTMLSelectElement;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form: TransactionTarget = event.target as TransactionTarget;
        const { name, date, category, amount, note, account } = form;
        setTransactions(
            transactions.map((transaction, index) => {
                if (index === current) {
                    return {
                        ...transaction,
                        Date: String(date.value),
                        name: String(name.value),
                        category: String(category.value),
                        amount: Number(amount.value),
                        note: String(note.value),
                        account: String(account.value)
                    };
                } else return transaction;
            })
        );
    };

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setTransactions(
            transactions.map((transaction, index) => {
                if (index === current) {
                    return {
                        ...transaction,
                        [name]: value
                    };
                } else return transaction;
            })
        );
    }

    function handleAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setTransactions(
            transactions.map((transaction, index) => {
                if (index === current) {
                    return {
                        ...transaction,
                        [name]: value
                    };
                } else return transaction;
            })
        );
    }

    function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = event.target;
        setTransactions(
            transactions.map((transaction, index) => {
                if (index === current) {
                    return {
                        ...transaction,
                        [name]: value
                    };
                } else return transaction;
            })
        );
    }

    const handleInfoOpen = (transaction: Transaction) => {
        setInfoTransaction(transaction);
    };

    return (
        <>
            <div>
                <Title>{`${decodeURI(String(Name))} transaction history`}</Title>
                <CardGroup>
                    <Card gridLayout={{ col: 8 }}>
                        <CardHeader>
                            <h1>
                                All <i>{`${decodeURI(String(Name))}`}</i> transactions
                            </h1>
                        </CardHeader>
                        <CardBody>
                            <Table bordered={false} fullWidth={true} striped>
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
                                            <td>
                                                {Intl.DateTimeFormat(t("dateLocale")).format(
                                                    new Date(transaction.date)
                                                )}
                                            </td>
                                            <td>{transaction.name}</td>
                                            <td>{transaction.category}</td>
                                            <td>
                                                <ModalToggleButton
                                                    type={"button"}
                                                    className="usa-button--unstyled"
                                                    modalRef={modalRef}
                                                    onClick={() => {
                                                        setCurrent(index);
                                                    }}
                                                >
                                                    <Icon.Edit />
                                                </ModalToggleButton>
                                                <Button type={"button"} className="usa-button--unstyled">
                                                    <Icon.Delete />
                                                </Button>
                                            </td>
                                            <td>
                                                <Icon.AttachMoney />
                                                {transaction.amount.toFixed(2)}
                                            </td>
                                            <td>
                                                <ModalToggleButton
                                                    type="button"
                                                    className="usa-button--unstyled"
                                                    modalRef={infoRef}
                                                    onClick={() => handleInfoOpen(transaction)}
                                                >
                                                    <Icon.NavigateNext />
                                                </ModalToggleButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                    <Card gridLayout={{ col: 4 }}>
                        <CardHeader>Summary</CardHeader>
                        <CardBody>
                            Total spent: ${transactions.reduce((sum, cur) => sum + Number(cur.amount), 0.0).toFixed(2)}
                            <hr />
                            Total transactions: {transactions.length}
                            <hr />
                            <BarChart
                                series={transactions.map((transaction) => {
                                    return { data: [transaction.amount] };
                                })}
                                xAxis={[
                                    {
                                        scaleType: "band",
                                        data: [
                                            transactions.map((transaction) => {
                                                return transaction.id;
                                            })
                                        ]
                                    }
                                ]}
                                height={300}
                            />
                        </CardBody>
                    </Card>
                </CardGroup>
            </div>
            <Modal ref={modalRef} id="note-modal" isLarge>
                <Form onSubmit={handleSubmit} large>
                    <div className="grid grid-cols-6 gap-5">
                        <input
                            id={"transaction-date"}
                            name={"date"}
                            className="col-span-3 usa-input usa-date-picker_external-inpu"
                            type={"date"}
                            value={transactions[current].date}
                            onChange={handleInputChange}
                        />
                        <div className="col-span-3" />
                        <hr className="col-span-6" />
                        <div className="col-span-4">
                            <Label htmlFor={"transaction-name"}>Name</Label>
                            <TextInput
                                value={transactions[current].name}
                                id={"transaction-name"}
                                name={"name"}
                                type={"text"}
                                onChange={handleInputChange}
                            />
                            <Label htmlFor={"transaction-amount"}>Amount</Label>
                            <InputGroup>
                                <InputPrefix>$</InputPrefix>
                                <TextInput
                                    value={transactions[current].amount}
                                    id={"transaction-amount"}
                                    name={"amount"}
                                    type={"number"}
                                    onChange={handleInputChange}
                                />
                            </InputGroup>
                            <Label htmlFor={"transaction-category"}>Category</Label>
                            <div className="grid grid-cols-8">
                                <Select
                                    id={"transaction-category"}
                                    name={"category"}
                                    value={transactions[current].category}
                                    onChange={handleSelectChange}
                                    className="col-span-8"
                                >
                                    {categories.map((category: string) => {
                                        return (
                                            <React.Fragment key={category}>
                                                <option value={category}>{category}</option>
                                            </React.Fragment>
                                        );
                                    })}
                                </Select>
                                {/* <Button type={"button"} className="usa-button--unstyled"><Icon.Add size={4} /></Button> */}
                            </div>
                            <Label htmlFor="transaction-note">Notes</Label>
                            <Textarea
                                value={transactions[current].note}
                                id="transaction-note"
                                onChange={handleAreaChange}
                                name="note"
                            />
                            <ModalToggleButton modalRef={modalRef} type="submit">
                                submit
                            </ModalToggleButton>
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="transaction-account">Account</Label>
                            <div className="grid grid-cols-8">
                                <Select
                                    id={"transaction-account"}
                                    name={"account"}
                                    value={transactions[current].account}
                                    onChange={handleSelectChange}
                                    className="col-span-8"
                                >
                                    {accounts.map((account: string) => {
                                        return (
                                            <React.Fragment key={account}>
                                                <option value={account}>{account}</option>
                                            </React.Fragment>
                                        );
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
                    <input
                        name={"date"}
                        className="col-span-3 usa-input usa-date-picker_external-inpu"
                        type={"date"}
                        value={transactions[current].date}
                        onChange={handleInputChange}
                        readOnly
                        disabled
                    />
                    <div className="col-span-3" />
                    <hr className="col-span-6" />
                    <div className="col-span-4">
                        <Label htmlFor={"info-name"}>Name</Label>
                        <TextInput
                            value={transactions[current].name}
                            id={"info-name"}
                            name={"name"}
                            type={"text"}
                            onChange={handleInputChange}
                            readOnly
                            disabled
                        />
                        <Label htmlFor={"info-amount"}>Amount</Label>
                        <InputGroup>
                            <InputPrefix>$</InputPrefix>
                            <TextInput
                                value={transactions[current].amount}
                                id={"info-amount"}
                                name={"amount"}
                                type={"number"}
                                onChange={handleInputChange}
                                readOnly
                                disabled
                            />
                        </InputGroup>
                        <Label htmlFor={"info-category"}>Category</Label>
                        <div className="grid grid-cols-8">
                            <Select
                                id={"info-category"}
                                name={"category"}
                                value={transactions[current].category}
                                onChange={handleSelectChange}
                                className="col-span-8"
                                disabled
                            >
                                {categories.map((category: string) => {
                                    return (
                                        <React.Fragment key={category}>
                                            <option value={category}>{category}</option>
                                        </React.Fragment>
                                    );
                                })}
                            </Select>
                        </div>
                        <Label htmlFor="info-note">Notes</Label>
                        <Textarea
                            value={transactions[current].note}
                            id="info-note"
                            onChange={handleAreaChange}
                            name="note"
                            readOnly
                            disabled
                        />
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="info-account">Account</Label>
                        <div className="grid grid-cols-8">
                            <Select
                                id={"info-account"}
                                name={"account"}
                                value={transactions[current].account}
                                onChange={handleSelectChange}
                                className="col-span-8"
                                disabled
                            >
                                {accounts.map((account: string) => {
                                    return (
                                        <React.Fragment key={account}>
                                            <option value={account}>{account}</option>
                                        </React.Fragment>
                                    );
                                })}
                            </Select>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Detailed Info Transaction Modal */}
            <Modal ref={infoRef} id="transaction-info-modal" isLarge>
                {infoTransaction && (
                    <div className="flex flex-col justify-center bg-white w-full max-w-xl rounded-2xl">
                        {/* Top Container: Date and View History Button */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex gap-4 items-center">
                                <div className="flex items-center justify-between px-4 py-2 bg-white border border-black rounded-xl">
                                    <div>{infoTransaction.date}</div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-black my-4"></div>

                        {/* Bottom Container: Info Details */}
                        <div className="flex gap-6">
                            {/* Left Container */}
                            <div className="flex flex-col w-2/3">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold">{infoTransaction.name}</h3>
                                    <p className="mt-2 text-xl">${infoTransaction.amount.toFixed(2)}</p>
                                    <p className="mt-4 text-lg">{infoTransaction.category}</p>
                                    <div className="mt-6 p-4 bg-gray-200 rounded-lg">
                                        <p className="text-md">{infoTransaction.note || "No notes available"}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Right Container */}
                            <div className="flex flex-col w-1/3">
                                <div className="border-l border-black pl-6 h-full">
                                    <h4 className="text-xl">Account</h4>
                                    <div className="flex items-center mt-3 text-sm text-gray-500">
                                        <Icon.AccountBalance className="mr-2" />
                                        <div>{infoTransaction.account}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}

export default TransactionHistory;
