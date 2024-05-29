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
import { Account, Transaction, TransactionCategory } from "../../types/models";
import { deleteTransaction, getAccountsByUserId, getTransactionByVendor } from "../../utils/transactionService";
import { formatCurrency, formatDate } from "../../util/helpers";
import { BarChart } from "@mui/x-charts";

function TransactionHistory() {
    const Name = useMatch("/:first/:second/:name")?.params.name;
    const { t } = useTranslation();
    const transactionsInit: Transaction[] = [
        {
            transactionId: 10,
            date: "2021-10-01",
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

    const [transactions, setTransactions] = useState<Array<Transaction>>(transactionsInit);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [current, setCurrent] = useState<number>(0);
    const [currentTransaction, setCurrentTransaction] = useState<Transaction>(transactions[current]);
    const modalRef = useRef<ModalRef>(null);
    const infoRef = useRef<ModalRef>(null);

    type TransactionTarget = EventTarget & {
        vendorName: HTMLInputElement;
        date: HTMLInputElement;
        category: HTMLSelectElement;
        amount: HTMLInputElement;
        description: HTMLTextAreaElement;
        accountId: HTMLSelectElement;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form: TransactionTarget = event.target as TransactionTarget;
        const { vendorName: name, date, category, amount, description, accountId } = form;
        setTransactions(
            transactions.map((transaction, index) => {
                if (index === current) {
                    return {
                        ...transaction,
                        date: String(date.value),
                        vendorName: String(name.value),
                        category: category.value as TransactionCategory,
                        amount: Number(amount.value),
                        description: description.value,
                        account: accountId
                    };
                } else return transaction;
            })
        );

        modalRef.current?.toggleModal();
    };

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type } = event.target;
        console.log(type);
        if (type !== "number" || (type === "number" && Number(value))) {
            setCurrentTransaction({
                ...currentTransaction,
                [name]: value
            });
        }
    }

    function handleAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setCurrentTransaction({
            ...currentTransaction,
            [name]: value
        });
    }

    function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = event.target;
        setCurrentTransaction({
            ...currentTransaction,
            [name]: value
        });
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
                                            <td>{formatDate(transaction.date)}</td>
                                            <td>{transaction.vendorName}</td>
                                            <td>{t(transaction.category)}</td>
                                            <td>
                                                <ModalToggleButton
                                                    type={"button"}
                                                    className="usa-button--unstyled"
                                                    modalRef={modalRef}
                                                    onClick={() => {
                                                        setCurrent(index);
                                                        setCurrentTransaction(transactions[index]);
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
                                            <td>{formatCurrency(transaction.amount)}</td>
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
                            {t("transactions.spent")}:{" "}
                            {formatCurrency(transactions.reduce((sum, cur) => sum + Number(cur.amount), 0.0))}
                            <hr />
                            {t("transactions.amount")}: {transactions.length}
                            <hr />
                            <BarChart
                                series={[
                                    {
                                        data: transactions.map((transaction) => {
                                            return transaction.amount;
                                        }),
                                        valueFormatter: (v) => {
                                            return formatCurrency(String(v), true);
                                        }
                                    }
                                ]}
                                xAxis={[
                                    {
                                        scaleType: "band",
                                        data: transactions.map((_transaction, index) => {
                                            return index;
                                        }),
                                        valueFormatter: (v) => {
                                            return formatDate(transactions[v].date);
                                        }
                                    }
                                ]}
                                height={300}
                                onItemClick={(_event, params) => {
                                    setCurrent(params.dataIndex);
                                    infoRef.current?.toggleModal();
                                }}
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
                            value={currentTransaction.date}
                            onChange={handleInputChange}
                        />
                        <div className="col-span-3" />
                        <hr className="col-span-6" />
                        <div className="col-span-4">
                            <Label htmlFor={"transaction-name"}>{t("transactions-table.name")}</Label>
                            <TextInput
                                value={currentTransaction.vendorName}
                                id={"transaction-name"}
                                name={"vendorName"}
                                type={"text"}
                                onChange={handleInputChange}
                                disabled
                            />
                            <Label htmlFor={"transaction-amount"}>{t("transactions-table.amount")}</Label>
                            <InputGroup>
                                <InputPrefix>$</InputPrefix>
                                <TextInput
                                    value={currentTransaction.amount}
                                    id={"transaction-amount"}
                                    name={"amount"}
                                    type={"number"}
                                    onChange={handleInputChange}
                                />
                            </InputGroup>
                            <Label htmlFor={"transaction-category"}>{t("transactions-table.category")}</Label>
                            <div className="grid grid-cols-8">
                                <Select
                                    id={"transaction-category"}
                                    name={"category"}
                                    value={currentTransaction.category}
                                    onChange={handleSelectChange}
                                    className="col-span-8"
                                >
                                    {Object.values(TransactionCategory).map((category) => (
                                        <option key={category} value={category}>
                                            {t(`${category}`)}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <Label htmlFor="transaction-note">{t("budgets.notes")}</Label>
                            <Textarea
                                value={currentTransaction.description as string}
                                id="transaction-note"
                                onChange={handleAreaChange}
                                name="description"
                            />
                            <Button type="submit">{t("transactions.submit")}</Button>
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="transaction-account">{t("transactions.account")}</Label>
                            <div className="grid grid-cols-8">
                                <Select
                                    id={"transaction-account"}
                                    name={"accountId"}
                                    value={currentTransaction.accountId}
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
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>

            {/* Detailed Info Transaction Modal */}
            <Modal ref={infoRef} id="transaction-info-modal" isLarge>
                {transactions[current] && (
                    <div className="flex flex-col justify-center bg-white w-full max-w-xl rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex gap-4 items-center">
                                <div className="flex items-center justify-between px-4 py-2 bg-white border border-black rounded-xl">
                                    <div>{formatDate(transactions[current].date)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-black my-4"></div>
                        <div className="flex gap-6">
                            <div className="flex flex-col w-2/3">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold">{transactions[current].vendorName}</h3>
                                    <p className="mt-2 text-xl">{formatCurrency(transactions[current].amount)}</p>
                                    <p className="mt-4 text-lg">{t(transactions[current].category)}</p>
                                    <div className="mt-6 p-4 bg-gray-200 rounded-lg">
                                        <p className="text-md">
                                            {transactions[current].description || "No notes available"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-1/3">
                                <div className="border-l border-black pl-6 h-full">
                                    <h4 className="text-xl">{t("transactions.account")}</h4>
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
                                                    {t("accounts.account-number")}:{" "}
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
