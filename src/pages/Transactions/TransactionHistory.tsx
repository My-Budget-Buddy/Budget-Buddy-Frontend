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
    ModalHeading,
    ModalRef,
    ModalToggleButton,
    Select,
    Table,
    TextInput,
    Textarea
} from "@trussworks/react-uswds";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMatch } from "react-router-dom";
import { Account, Transaction, TransactionCategory } from "../../types/models";
import {
    createTransaction,
    deleteTransaction,
    getAccountsByUserId,
    getTransactionByVendor,
    updateTransaction,
    validateTransaction
} from "../../utils/transactionService";
import { formatCurrency, formatDate } from "../../util/helpers";
import { BarChart } from "@mui/x-charts";
import CategoryIcon, { categoryColors } from "../../components/CategoryIcon";

// type TransactionTarget = EventTarget & {
//     vendorName: HTMLInputElement;
//     date: HTMLInputElement;
//     category: HTMLSelectElement;
//     amount: HTMLInputElement;
//     description: HTMLTextAreaElement;
//     accountId: HTMLSelectElement;
// };

function TransactionHistory() {
    const Name = decodeURI(useMatch("/:first/:second/:name")?.params.name as string);
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
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
    const [selectedAccount, setSelectedAccount] = useState<string>("All Accounts");

    const [amountFilter, setAmountFilter] = useState<string>("all");
    const [dateFilter, setDateFilter] = useState<string>("all");

    const [minAmount, setMinAmount] = useState<number | "">("");
    const [maxAmount, setMaxAmount] = useState<number | "">("");
    const [showAmountFilter, setShowAmountFilter] = useState<boolean>(false);

    const [minDate, setMinDate] = useState<string>("");
    const [maxDate, setMaxDate] = useState<string>("");
    const [showDateFilter, setShowDateFilter] = useState<boolean>(false);

    const [sortOrder, setSortOrder] = useState<string>("date");
    const [sortDirection, setSortDirection] = useState<string>("asc");

    const [newTransaction, setNewTransaction] = useState<Omit<Transaction, "transactionId">>({
        userId: 1,
        accountId: 1,
        vendorName: Name,
        amount: 0,
        category: TransactionCategory.GROCERIES,
        description: "",
        date: new Date().toISOString().slice(0, 10)
    });

    const modalRef = useRef<ModalRef>(null);
    const infoRef = useRef<ModalRef>(null);
    const createRef = useRef<ModalRef>(null);

    useEffect(() => {
        let sortedTransactions = [...transactions].filter(
            (transaction) =>
                (selectedCategory === "All Categories" || transaction.category === selectedCategory) &&
                (selectedAccount === "All Accounts" || transaction.accountId.toString() === selectedAccount) &&
                (minAmount === "" || transaction.amount >= minAmount) &&
                (maxAmount === "" || transaction.amount <= maxAmount) &&
                (minDate === "" || new Date(transaction.date) >= new Date(minDate)) &&
                (maxDate === "" || new Date(transaction.date) <= new Date(maxDate))
        );

        sortedTransactions = sortedTransactions.sort((a, b) => {
            if (sortOrder === "amount") {
                return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount;
            } else {
                return sortDirection === "asc"
                    ? new Date(a.date).getTime() - new Date(b.date).getTime()
                    : new Date(b.date).getTime() - new Date(a.date).getTime();
            }
        });

        setFilteredTransactions(sortedTransactions);
    }, [
        selectedCategory,
        selectedAccount,
        minAmount,
        maxAmount,
        minDate,
        maxDate,
        transactions,
        sortOrder,
        sortDirection
    ]);

    const handleCreateTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = validateTransaction(newTransaction);
        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }
        try {
            const createdTransaction = await createTransaction(newTransaction);
            setTransactions([...transactions, createdTransaction]);
            createRef.current?.toggleModal(); // Close the modal after transaction creation
        } catch (error) {
            console.error("Error creating transaction:", error);
        }
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // const form: TransactionTarget = event.target as TransactionTarget;
        // const { vendorName: name, date, category, amount, description, accountId } = form;
        const errors = validateTransaction(currentTransaction);
        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }
        try {
            const updatedTransaction = await updateTransaction(currentTransaction);

            setTransactions(
                transactions.map((transaction) => {
                    if (transaction.transactionId === currentTransaction.transactionId) {
                        return updatedTransaction;
                        // {
                        //     ...transaction,
                        //     date: String(date.value),
                        //     vendorName: String(name.value),
                        //     category: category.value as TransactionCategory,
                        //     amount: Number(amount.value),
                        //     description: description.value,
                        //     account: accountId
                        // };
                    } else return transaction;
                })
            );
        } catch (error) {
            console.error("Error updating transaction:", error);
        }

        modalRef.current?.toggleModal();
    };

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type } = event.target;
        console.log(type);
        if (type !== "number" || (type === "number" && (Number(value) || value === ""))) {
            if (createRef.current?.modalIsOpen) setNewTransaction({ ...newTransaction, [name]: value });
            if (modalRef.current?.modalIsOpen) {
                setCurrentTransaction({
                    ...currentTransaction,
                    [name]: value
                });
            }
        }
    }

    function handleAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const { name, value } = event.target;
        if (createRef.current?.modalIsOpen) setNewTransaction({ ...newTransaction, [name]: value });
        if (modalRef.current?.modalIsOpen) {
            setCurrentTransaction({
                ...currentTransaction,
                [name]: value
            });
        }
    }

    function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = event.target;
        if (createRef.current?.modalIsOpen) setNewTransaction({ ...newTransaction, [name]: value });
        if (modalRef.current?.modalIsOpen) {
            setCurrentTransaction({
                ...currentTransaction,
                [name]: value
            });
        }
    }

    const handleDelete = async (transactionId: number) => {
        await deleteTransaction(transactionId);
        setTransactions(transactions.filter((t) => t.transactionId !== transactionId));
    };

    useEffect(() => {
        const fetchData = async () => {
            const transactionsData = await getTransactionByVendor(Name);
            setTransactions(transactionsData);

            const accountsData = await getAccountsByUserId(1);
            setAccounts(accountsData);
        };
        fetchData();
    }, [Name]);

    const getAccountDetails = (accountId: number) => accounts.find((account) => account.id === accountId);

    return (
        <>
            <div className="min-h-screen pr-10 pl-10 flex flex-col gap-6">
                <div className="flex justify-between items-center bg-transparent p-4 ">
                    <h1>{t("transactions.history", { val: Name })}</h1>
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            className="usa-button--secondary"
                            onClick={() => {
                                setSelectedCategory("All Categories");
                                setSelectedAccount("All Accounts");
                                setMinAmount("");
                                setMaxAmount("");
                                setMinDate("");
                                setMaxDate("");
                                setAmountFilter("all");
                                setDateFilter("all");
                                setShowAmountFilter(false);
                                setShowDateFilter(false);
                            }}
                        >
                            {t("transactions.clear-filters")}
                        </Button>
                        <select
                            className="p-2 border rounded"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="date">{t("transactions.sort-by-date")}</option>
                            <option value="amount">{t("transactions.sort-by-amount")}</option>
                        </select>
                        <select
                            className="p-2 border rounded"
                            value={sortDirection}
                            onChange={(e) => setSortDirection(e.target.value)}
                        >
                            <option value="asc">{t("transactions.ascending")}</option>
                            <option value="desc">{t("transactions.descending")}</option>
                        </select>
                        <ModalToggleButton type="button" className="usa-button" modalRef={createRef}>
                            {t("transactions.add-transaction")}
                        </ModalToggleButton>
                    </div>
                </div>

                <div className="flex justify-center items-center gap-4 bg-transparent p-4">
                    <select
                        className="p-2 w-40"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value={"All Categories"}>{t("transactions.all-categories")}</option>
                        {Object.values(TransactionCategory).map((category) => (
                            <option key={category} value={category}>
                                {t(category)}
                            </option>
                        ))}
                    </select>
                    <select
                        className="p-2 w-40"
                        value={selectedAccount}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                    >
                        <option value="All Accounts">{t("transactions.all-accounts")}</option>
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id.toString()}>
                                {account.institution}
                            </option>
                        ))}
                    </select>
                    <select
                        className="p-2 w-40"
                        value={amountFilter}
                        onChange={(e) => {
                            setAmountFilter(e.target.value);
                            setShowAmountFilter(e.target.value === "amount");
                            if (e.target.value !== "amount") {
                                setMinAmount("");
                                setMaxAmount("");
                            }
                        }}
                    >
                        <option value="all">{t("transactions.all-amounts")}</option>
                        <option value="amount">{t("transactions.amount-range")}</option>
                    </select>
                    <select
                        className="p-2 w-40"
                        value={dateFilter}
                        onChange={(e) => {
                            setDateFilter(e.target.value);
                            setShowDateFilter(e.target.value === "date");
                            if (e.target.value !== "date") {
                                setMinDate("");
                                setMaxDate("");
                            }
                        }}
                    >
                        <option value="all">{t("transactions.all-dates")}</option>
                        <option value="date">{t("transactions.date-range")}</option>
                    </select>
                </div>

                {showAmountFilter && (
                    <div className="flex justify-center items-center gap-4 bg-transparent p-4">
                        <div className="flex items-center gap-2">
                            <InputGroup>
                                <InputPrefix>$</InputPrefix>
                                <TextInput
                                    value={minAmount}
                                    id="min-amount"
                                    name="minAmount"
                                    type="number"
                                    placeholder="Min Amount"
                                    onChange={(e) =>
                                        setMinAmount(e.target.value === "" ? "" : parseFloat(e.target.value))
                                    }
                                />
                            </InputGroup>
                            <InputGroup>
                                <InputPrefix>$</InputPrefix>
                                <TextInput
                                    value={maxAmount}
                                    id="max-amount"
                                    name="maxAmount"
                                    type="number"
                                    placeholder="Max Amount"
                                    onChange={(e) =>
                                        setMaxAmount(e.target.value === "" ? "" : parseFloat(e.target.value))
                                    }
                                />
                            </InputGroup>
                        </div>
                    </div>
                )}

                {showDateFilter && (
                    <div className="flex justify-center items-center gap-4 bg-transparent p-4">
                        <div className="flex items-center gap-2">
                            <input
                                value={minDate}
                                id="min-date"
                                name="minDate"
                                type="date"
                                placeholder="Min Date"
                                onChange={(e) => setMinDate(e.target.value)}
                            />
                            <input
                                value={maxDate}
                                id="max-date"
                                name="maxDate"
                                type="date"
                                placeholder="Max Date"
                                onChange={(e) => setMaxDate(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <CardGroup>
                    <Card gridLayout={{ col: 8 }}>
                        <CardHeader></CardHeader>
                        <CardBody>
                            {filteredTransactions.length === 0 ? (
                                <div className="text-center">
                                    <p className="text-lg">
                                        {t("transactions.no-transactions")}
                                        <br />
                                        Click <span className="font-bold text-blue-600">Add Transaction</span> to start
                                        making transactions
                                    </p>
                                </div>
                            ) : (
                                <Table bordered={false} fullWidth={true}>
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
                                        {filteredTransactions.map((transaction: Transaction, index: number) => (
                                            <tr key={index}>
                                                <td>{formatDate(transaction.date)}</td>
                                                <td>{transaction.vendorName}</td>
                                                <td>
                                                    <CategoryIcon
                                                        category={transaction.category}
                                                        color={categoryColors[transaction.category]}
                                                    />
                                                    {t(transaction.category)}
                                                </td>
                                                <td>
                                                    <ModalToggleButton
                                                        type={"button"}
                                                        className="usa-button--unstyled"
                                                        modalRef={modalRef}
                                                        onClick={() => {
                                                            setCurrent(index);
                                                            setCurrentTransaction(filteredTransactions[index]);
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
                                                        onClick={() => {
                                                            setCurrent(index);
                                                            setCurrentTransaction(filteredTransactions[index]);
                                                        }}
                                                    >
                                                        <Icon.NavigateNext />
                                                    </ModalToggleButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </CardBody>
                    </Card>
                    <Card gridLayout={{ col: 4 }}>
                        <CardHeader>{t("transactions.summary")}</CardHeader>
                        <CardBody>
                            {t("transactions.spent")}:{" "}
                            {formatCurrency(filteredTransactions.reduce((sum, cur) => sum + Number(cur.amount), 0.0))}
                            <hr />
                            {t("transactions.amount")}: {filteredTransactions.length}
                            <hr />
                            <BarChart
                                series={[
                                    {
                                        data: filteredTransactions.map((transaction) => {
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
                                        data: filteredTransactions.map((_transaction, index) => {
                                            return index;
                                        }),
                                        valueFormatter: (v) => {
                                            return formatDate(filteredTransactions[v].date);
                                        }
                                    }
                                ]}
                                height={300}
                                onItemClick={(_event, params) => {
                                    setCurrent(params.dataIndex);
                                    setCurrentTransaction(filteredTransactions[params.dataIndex]);
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

            <Modal
                ref={createRef}
                id="create-transaction-modal"
                aria-describedby="create-transaction-form"
                aria-labelledby="create-transaction-form-title"
            >
                <ModalHeading className="text-center mb-4">{t("transactions.create-transaction")}</ModalHeading>
                <Form onSubmit={handleCreateTransaction} large>
                    <div className="grid grid-cols-6 gap-5">
                        <input
                            id="transaction-date"
                            name="date"
                            className="col-span-3 usa-input usa-date-picker_external-input"
                            type="date"
                            value={newTransaction.date}
                            onChange={handleInputChange}
                        />
                        <div className="col-span-3" />
                        <hr className="col-span-6" />
                        <div className="col-span-4">
                            <Label htmlFor="transaction-vendorName">{t("transactions-table.name")}</Label>
                            <TextInput
                                value={newTransaction.vendorName}
                                id="transaction-vendorName"
                                name="vendorName"
                                type="text"
                                onChange={handleInputChange}
                                disabled
                                required
                            />
                            <Label htmlFor="transaction-amount">{t("transactions-table.amount")}</Label>
                            <InputGroup>
                                <InputPrefix>$</InputPrefix>
                                <TextInput
                                    value={newTransaction.amount}
                                    id="transaction-amount"
                                    name="amount"
                                    type="number"
                                    onChange={handleInputChange}
                                    required
                                />
                            </InputGroup>
                            <Label htmlFor="transaction-category">{t("transactions-table.category")}</Label>
                            <div className="grid grid-cols-8">
                                <Select
                                    id="transaction-category"
                                    name="category"
                                    value={newTransaction.category}
                                    onChange={handleSelectChange}
                                    className="col-span-8"
                                >
                                    {Object.values(TransactionCategory).map((category) => (
                                        <option key={category} value={category}>
                                            {t(category)}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <Label htmlFor="transaction-description">{t("budgets.notes")}</Label>
                            <Textarea
                                value={newTransaction.description || ""}
                                id="transaction-description"
                                onChange={handleAreaChange}
                                name="description"
                            />
                            <Button type="submit">{t("transactions.submit")}</Button>
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="transaction-account">{t("transactions.account")}</Label>
                            <div className="grid grid-cols-8">
                                <Select
                                    id="transaction-account"
                                    name="accountId"
                                    value={newTransaction.accountId}
                                    onChange={handleSelectChange}
                                    className="col-span-8"
                                >
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.institution}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>

            {/* Detailed Info Transaction Modal */}
            <Modal ref={infoRef} id="transaction-info-modal" isLarge>
                {currentTransaction && (
                    <div className="flex flex-col justify-center bg-white w-full max-w-xl rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex gap-4 items-center">
                                <div className="flex items-center justify-between px-4 py-2 bg-white border border-black rounded-xl">
                                    <div>{formatDate(currentTransaction.date)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-black my-4"></div>
                        <div className="flex gap-6">
                            <div className="flex flex-col w-2/3">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold">{currentTransaction.vendorName}</h3>
                                    <p className="mt-2 text-xl">{formatCurrency(currentTransaction.amount)}</p>
                                    <p className="mt-4 text-lg">{t(currentTransaction.category)}</p>
                                    <div className="mt-6 p-4 bg-gray-200 rounded-lg">
                                        <p className="text-md">
                                            {currentTransaction.description || "No notes available"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-1/3">
                                <div className="border-l border-black pl-6 h-full">
                                    <h4 className="text-xl">{t("transactions.account")}</h4>
                                    <div className="flex items-center mt-3 text-sm text-gray-500">
                                        {currentTransaction.accountId && (
                                            <div className="flex flex-col">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Icon.AccountBalance className="mr-2" />
                                                    <div>
                                                        {getAccountDetails(currentTransaction.accountId)?.institution}
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-500">
                                                    {t("accounts.account-number")}:{" "}
                                                    {getAccountDetails(currentTransaction.accountId)?.accountNumber}
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
