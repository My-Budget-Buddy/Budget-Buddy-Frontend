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
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMatch } from "react-router-dom";
import { BarChart } from "@mui/x-charts";
import { Account, Transaction, TransactionCategory } from "../../types/models";
import { deleteTransaction, getAccountsByUserId, getTransactionByVendor } from "../../utils/transactionService";

function TransactionHistory() {
    const Name = useMatch("/:first/:second/:name")?.params.name;
    const { t } = useTranslation();
    const transactionsInit: Transaction[] = [
        {
            transactionId: 10,
            date: "2023-10-11",
            vendorName: "Hot dog breakfast",
            category: TransactionCategory.DINING,
            amount: 2.33,
            description: "One hot dog",
            accountId: 1,
            userId: 1
        },
        {
            transactionId: 11,
            date: "2023-10-11",
            vendorName: "Hot dog wating for train",
            category: TransactionCategory.DINING,
            amount: 4.66,
            description: "Anywhere from 1 to 2 hot dogs",
            accountId: 2,
            userId: 1
        },
        {
            transactionId: 12,
            date: "2023-10-11",
            vendorName: "Hot dog at lunch",
            category: TransactionCategory.DINING,
            amount: 9.33,
            description: "Sometimes I don't even eat lunch, I just blow through it",
            accountId: 1,
            userId: 1
        },
        {
            transactionId: 13,
            date: "2023-10-12",
            vendorName: "Hot dog breakfast",
            category: TransactionCategory.DINING,
            amount: 2.33,
            description: "Definitely a hot dog",
            accountId: 3,
            userId: 1
        },
        {
            transactionId: 14,
            date: "2023-10-12",
            vendorName: "Hot dog wating for train",
            category: TransactionCategory.DINING,
            amount: 4.66,
            description: "Yeah 2 hot dogs",
            accountId: 1,
            userId: 1
        },
        {
            transactionId: 15,
            date: "2023-10-12",
            vendorName: "Hot dog at lunch",
            category: TransactionCategory.DINING,
            amount: 9.33,
            description: "I don't skip lunch",
            accountId: 2,
            userId: 1
        }
    ];

    const categories: Array<string> = ["food", "shopping", "entertainment"];

    const [transactions, setTransactions] = useState<Array<Transaction>>(transactionsInit);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [current, setCurrent] = useState<number>(0);
    const modalRef = useRef<ModalRef>(null);
    const infoRef = useRef<ModalRef>(null);

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
                        date: String(date.value),
                        vendorName: String(name.value),
                        category: category.value as TransactionCategory,
                        amount: Number(amount.value),
                        description: String(note.value),
                        account: String(account.value)
                    };
                } else return transaction;
            })
        );
    };

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type } = event.target;
        console.log(type);
        setTransactions(
            transactions.map((transaction, index) => {
                if (index === current && (type !== "number" || (type === "number" && Number(value)))) {
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

    const handleDelete = async (transactionId: number) => {
        await deleteTransaction(transactionId);
        setTransactions(transactions.filter((t) => t.transactionId !== transactionId));
    };

    useEffect(() => {
        const fetchData = async () => {
            const transactionsData = await getTransactionByVendor(1, Name as string);
            setTransactions(transactionsData);

            const accountsData = await getAccountsByUserId(1);
            setAccounts(accountsData);
        };
        fetchData();
    }, [Name]);

    const getAccountDetails = (accountId: number) => accounts.find((account) => account.id === accountId);

    return (
        <>
            <div>
                <Title>
                    <h1>{t("transactions.history", { val: decodeURI(Name as string) })}</h1>
                </Title>
                <CardGroup>
                    <Card gridLayout={{ col: 8 }}>
                        <CardHeader></CardHeader>
                        <CardBody>
                            <Table bordered={false} fullWidth={true} striped>
                                <thead>
                                    <tr>
                                        <th>{t("transactions-table.date")}</th>
                                        <th>{t("transactions-table.name")}</th>
                                        <th>{t("transactions-table.category")}</th>
                                        <th>{t("transactions-table.actions")}</th>
                                        <th>{t("transactions-table.amount")}</th>
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
                                            <td>{transaction.vendorName}</td>
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
                                                <Button
                                                    type={"button"}
                                                    onClick={() => handleDelete(transaction.transactionId)}
                                                    className="usa-button--unstyled"
                                                >
                                                    <Icon.Delete />
                                                </Button>
                                            </td>
                                            <td>
                                                <Icon.AttachMoney />
                                                {Number(transaction.amount).toFixed(2)}
                                            </td>
                                            <td>
                                                <ModalToggleButton
                                                    type="button"
                                                    className="usa-button--unstyled"
                                                    modalRef={infoRef}
                                                    onClick={() => setCurrent(index)}
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
                        <CardHeader>{t("transactions.summary")}</CardHeader>
                        <CardBody>
                            {t("transactions.spent")}: $
                            {transactions.reduce((sum, cur) => sum + Number(cur.amount), 0.0).toFixed(2)}
                            <hr />
                            {t("transactions.amount")}: {transactions.length}
                            <hr />
                            <BarChart
                                series={[
                                    {
                                        data: transactions.map((transaction) => {
                                            return transaction.amount;
                                        })
                                        // stack: "total"
                                    }
                                ]}
                                xAxis={[
                                    {
                                        scaleType: "band",
                                        data: transactions.map((transaction) => {
                                            return transaction.transactionId;
                                        })
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
                            className="col-span-3 usa-input usa-date-picker_external-input"
                            type={"date"}
                            value={transactions[current].date}
                            onChange={handleInputChange}
                        />
                        <div className="col-span-3" />
                        <hr className="col-span-6" />
                        <div className="col-span-4">
                            <Label htmlFor={"transaction-name"}>Name</Label>
                            <TextInput
                                value={transactions[current].vendorName}
                                id={"transaction-name"}
                                name={"vendorName"}
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
                                    {Object.values(TransactionCategory).map((category) => (
                                        <option key={category} value={category}>
                                            {t(`${category}`)}
                                        </option>
                                    ))}
                                </Select>
                                {/* <Button type={"button"} className="usa-button--unstyled"><Icon.Add size={4} /></Button> */}
                            </div>
                            <Label htmlFor="transaction-note">Notes</Label>
                            <Textarea
                                value={transactions[current].description as string}
                                id="transaction-note"
                                onChange={handleAreaChange}
                                name="description"
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
                                    name={"accountId"}
                                    value={transactions[current].accountId}
                                    onChange={handleSelectChange}
                                    className="col-span-8"
                                >
                                    {accounts.map((account: Account) => {
                                        return (
                                            <option key={account.id} value={account.id.toString()}>
                                                {account.institution}
                                            </option>
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
                        className="col-span-3 usa-input usa-date-picker_external-input"
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
                            value={transactions[current].vendorName}
                            id={"info-name"}
                            name={"vendorName"}
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
                                            <option value={category}>{t(`${category}`)}</option>
                                        </React.Fragment>
                                    );
                                })}
                            </Select>
                        </div>
                        <Label htmlFor="info-note">Notes</Label>
                        <Textarea
                            value={transactions[current].description || ""}
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
                                value={transactions[current].accountId}
                                onChange={handleSelectChange}
                                className="col-span-8"
                                disabled
                            >
                                {accounts.map((account: Account) => {
                                    return (
                                        <option value={account.id} key={account.id}>
                                            {account.institution}
                                        </option>
                                    );
                                })}
                            </Select>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Detailed Info Transaction Modal */}
            <Modal ref={infoRef} id="transaction-info-modal" isLarge>
                {transactions[current] && (
                    <div className="flex flex-col justify-center bg-white w-full max-w-xl rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex gap-4 items-center">
                                <div className="flex items-center justify-between px-4 py-2 bg-white border border-black rounded-xl">
                                    <div>
                                        {Intl.DateTimeFormat(t("dateLocale")).format(
                                            new Date(transactions[current].date)
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-black my-4"></div>
                        <div className="flex gap-6">
                            <div className="flex flex-col w-2/3">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold">{transactions[current].vendorName}</h3>
                                    <p className="mt-2 text-xl">${Number(transactions[current].amount).toFixed(2)}</p>
                                    <p className="mt-4 text-lg">{transactions[current].category}</p>
                                    <div className="mt-6 p-4 bg-gray-200 rounded-lg">
                                        <p className="text-md">
                                            {transactions[current].description || "No notes available"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-1/3">
                                <div className="border-l border-black pl-6 h-full">
                                    <h4 className="text-xl">Account</h4>
                                    <div className="flex items-center mt-3 text-sm text-gray-500">
                                        {transactions[current].accountId && (
                                            <div className="flex flex-col">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Icon.AccountBalance className="mr-2" />
                                                    <div>
                                                        {
                                                            getAccountDetails(transactions[current].accountId)
                                                                ?.institution
                                                        }
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-500">
                                                    Account Number:{" "}
                                                    {getAccountDetails(transactions[current].accountId)?.accountNumber}
                                                </div>
                                            </div>
                                        )}
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
