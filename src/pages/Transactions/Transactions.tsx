import React, { useState, useRef, useEffect } from "react";
import {
    Button,
    Card,
    CardBody,
    CardGroup,
    CardHeader,
    Icon,
    InputGroup,
    InputPrefix,
    Modal,
    ModalRef,
    ModalToggleButton,
    Table,
    TextInput,
    Label,
    Form,
    Select,
    Textarea,
    ModalHeading
} from "@trussworks/react-uswds";
import { useNavigate } from "react-router-dom";
import { Transaction, TransactionCategory, Account } from "../../types/models";
import {
    deleteTransaction,
    getTransactionByUserId,
    getAccountsByUserId,
    createTransaction,
    updateTransaction,
    validateTransaction
} from "../../utils/transactionService";
import { useTranslation } from "react-i18next";
import CategoryIcon from "../../components/CategoryIcon";

const categoryColors: { [key in TransactionCategory]: string } = {
    [TransactionCategory.GROCERIES]: "#90c8f4",
    [TransactionCategory.ENTERTAINMENT]: "#e5d23a",
    [TransactionCategory.DINING]: "#6ed198",
    [TransactionCategory.TRANSPORTATION]: "#af98f9",
    [TransactionCategory.HEALTHCARE]: "#fd6d6d",
    [TransactionCategory.LIVING_EXPENSES]: "#5a7ffa",
    [TransactionCategory.SHOPPING]: "#fe992b",
    [TransactionCategory.INCOME]: "#f7b7e5",
    [TransactionCategory.MISC]: "#dce2e1"
};

const Transactions: React.FC = () => {
    const { t } = useTranslation();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [infoTransaction, setInfoTransaction] = useState<Transaction | null>(null);
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
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
        vendorName: "",
        amount: 0,
        category: TransactionCategory.GROCERIES,
        description: "",
        date: new Date().toISOString().slice(0, 10)
    });

    const infoRef = useRef<ModalRef>(null);
    const createRef = useRef<ModalRef>(null);
    const editRef = useRef<ModalRef>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const accountsData = await getAccountsByUserId(1);
            setAccounts(accountsData);

            const transactionsData = await getTransactionByUserId(1);
            setTransactions(transactionsData);
        };
        fetchData();
    }, []);

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

    const handleDelete = async (transactionId: number) => {
        await deleteTransaction(transactionId);
        setTransactions(transactions.filter((t) => t.transactionId !== transactionId));
    };

    const handleInfoOpen = (transaction: Transaction) => setInfoTransaction(transaction);

    const handleViewHistory = (infoTransaction: Transaction) =>
        navigate(`/dashboard/transactions/${encodeURIComponent(infoTransaction.vendorName)}`);

    const getAccountDetails = (accountId: number) => accounts.find((account) => account.id === accountId);

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

    const handleUpdateTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editTransaction) {
            const errors = validateTransaction(editTransaction);
            if (errors.length > 0) {
                alert(errors.join("\n"));
                return;
            }
            try {
                const updatedTransaction = await updateTransaction(editTransaction);
                setTransactions(
                    transactions.map((t) =>
                        t.transactionId === updatedTransaction.transactionId ? updatedTransaction : t
                    )
                );
                editRef.current?.toggleModal(); // Close the modal after transaction update
            } catch (error) {
                console.error("Error updating transaction:", error);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewTransaction({ ...newTransaction, [name]: value });
        if (editTransaction) {
            setEditTransaction({ ...editTransaction, [name]: value });
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTransaction({ ...newTransaction, [name]: value });
        if (editTransaction) {
            setEditTransaction({ ...editTransaction, [name]: value });
        }
    };

    const handleAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewTransaction({ ...newTransaction, [name]: value });
        if (editTransaction) {
            setEditTransaction({ ...editTransaction, [name]: value });
        }
    };

    return (
        <div className="min-h-screen pr-10 pl-10 flex flex-col gap-6">
            <div className="flex justify-between items-center bg-transparent p-4 ">
                <h1>Transactions</h1>
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
                        Clear Filters
                    </Button>
                    <select
                        className="p-2 border rounded"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="date">Sort by date</option>
                        <option value="amount">Sort by amount</option>
                    </select>
                    <select
                        className="p-2 border rounded"
                        value={sortDirection}
                        onChange={(e) => setSortDirection(e.target.value)}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                    <ModalToggleButton type="button" className="usa-button" modalRef={createRef}>
                        Add Transaction
                    </ModalToggleButton>
                </div>
            </div>

            <div className="flex justify-center items-center gap-4 bg-transparent p-4">
                <select
                    className="p-2 w-40"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option>All Categories</option>
                    {Object.values(TransactionCategory).map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <select
                    className="p-2 w-40"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                >
                    <option>All Accounts</option>
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
                    <option value="all">All Amounts</option>
                    <option value="amount">Amount Range</option>
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
                    <option value="all">All Dates</option>
                    <option value="date">Date Range</option>
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
                                onChange={(e) => setMinAmount(e.target.value === "" ? "" : parseFloat(e.target.value))}
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
                                onChange={(e) => setMaxAmount(e.target.value === "" ? "" : parseFloat(e.target.value))}
                            />
                        </InputGroup>
                    </div>
                </div>
            )}

            {showDateFilter && (
                <div className="flex justify-center items-center gap-4 bg-transparent p-4">
                    <div className="flex items-center gap-2">
                        <InputGroup>
                            <TextInput
                                value={minDate}
                                id="min-date"
                                name="minDate"
                                type="date"
                                placeholder="Min Date"
                                onChange={(e) => setMinDate(e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup>
                            <TextInput
                                value={maxDate}
                                id="max-date"
                                name="maxDate"
                                type="date"
                                placeholder="Max Date"
                                onChange={(e) => setMaxDate(e.target.value)}
                            />
                        </InputGroup>
                    </div>
                </div>
            )}

            <div className="flex-grow overflow-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
                <CardGroup>
                    <Card gridLayout={{ col: 12 }} className="mr-5">
                        <CardHeader className="flex justify-center mb-5">
                            <h1>List of Transactions</h1>
                        </CardHeader>
                        <CardBody>
                            {filteredTransactions.length === 0 ? (
                                <div className="text-center">
                                    <p className="text-lg">
                                        No transactions found
                                        <br />
                                        Click <span className="font-bold text-blue-600">Add Transaction</span> to start
                                        making transactions
                                    </p>
                                </div>
                            ) : (
                                <Table fullWidth>
                                    <thead>
                                        <tr>
                                            <th scope="col">Date</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Category</th>
                                            <th scope="col">Actions</th>
                                            <th scope="col" className="text-right">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransactions.map((transaction) => (
                                            <tr key={transaction.transactionId}>
                                                <td>{transaction.date}</td>
                                                <td>{transaction.vendorName}</td>
                                                <td>
                                                    <CategoryIcon
                                                        category={transaction.category}
                                                        color={categoryColors[transaction.category]}
                                                    />
                                                    {transaction.category}
                                                </td>
                                                <td>
                                                    <Button
                                                        type="button"
                                                        className="usa-button--unstyled"
                                                        onClick={() => handleDelete(transaction.transactionId)}
                                                    >
                                                        <Icon.Delete />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        className="usa-button--unstyled"
                                                        onClick={() => {
                                                            setEditTransaction(transaction);
                                                            editRef.current?.toggleModal();
                                                        }}
                                                    >
                                                        <Icon.Edit />
                                                    </Button>
                                                </td>
                                                <td
                                                    className={`text-right ${
                                                        transaction.category === TransactionCategory.INCOME
                                                            ? "text-green-500"
                                                            : "text-red-500"
                                                    }`}
                                                >
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
                            )}
                        </CardBody>
                    </Card>
                </CardGroup>
            </div>

            <Modal
                ref={infoRef}
                id="transaction-info-modal"
                isLarge
                aria-describedby="transaction-details"
                aria-labelledby="transaction-details-title"
            >
                <ModalHeading className="text-center mb-6">Transaction Detailed Information</ModalHeading>
                {infoTransaction && (
                    <div className="flex flex-col justify-center bg-white w-full max-w-xl rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex gap-4 items-center">
                                <div className="flex items-center justify-between px-4 py-2 bg-white border border-black rounded-xl">
                                    <div>{infoTransaction.date}</div>
                                </div>
                                <Button type="button" onClick={() => handleViewHistory(infoTransaction)}>
                                    View History
                                </Button>
                            </div>
                        </div>
                        <div className="border-t border-black my-4"></div>
                        <div className="flex gap-6">
                            <div className="flex flex-col w-2/3">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold">{infoTransaction.vendorName}</h3>
                                    <p className="mt-2 text-xl">${infoTransaction.amount.toFixed(2)}</p>
                                    <p className="mt-4 text-lg">
                                        <CategoryIcon
                                            category={infoTransaction.category}
                                            color={categoryColors[infoTransaction.category]}
                                        />
                                        {infoTransaction.category}
                                    </p>
                                    <div className="mt-6 p-4 bg-gray-200 rounded-lg">
                                        <p className="text-md">{infoTransaction.description || "No notes available"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-1/3">
                                <div className="border-l border-black pl-6 h-full">
                                    <h4 className="text-xl">Account</h4>
                                    <div className="flex items-center mt-3 text-sm text-gray-500">
                                        {infoTransaction.accountId && (
                                            <div className="flex flex-col">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Icon.AccountBalance className="mr-2" />
                                                    <div>
                                                        {getAccountDetails(infoTransaction.accountId)?.institution}
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-500">
                                                    Account Number:{" "}
                                                    {getAccountDetails(infoTransaction.accountId)?.accountNumber}
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
            <Modal
                ref={createRef}
                id="create-transaction-modal"
                aria-describedby="create-transaction-form"
                aria-labelledby="create-transaction-form-title"
            >
                <ModalHeading className="text-center mb-4">Create Transaction</ModalHeading>
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
                            <Label htmlFor="transaction-vendorName">Vendor Name</Label>
                            <TextInput
                                value={newTransaction.vendorName}
                                id="transaction-vendorName"
                                name="vendorName"
                                type="text"
                                onChange={handleInputChange}
                                required
                            />
                            <Label htmlFor="transaction-amount">Amount</Label>
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
                            <Label htmlFor="transaction-category">Category</Label>
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
                                            {category}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <Label htmlFor="transaction-description">Description</Label>
                            <Textarea
                                value={newTransaction.description || ""}
                                id="transaction-description"
                                onChange={handleAreaChange}
                                name="description"
                            />
                            <Button type="submit">Submit</Button>
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="transaction-account">Account</Label>
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

            <Modal
                ref={editRef}
                id="edit-transaction-modal"
                aria-describedby="edit-transaction-form"
                aria-labelledby="edit-transaction-form-title"
            >
                <ModalHeading className="text-center mb-4">Edit Transaction</ModalHeading>
                <Form onSubmit={handleUpdateTransaction} large>
                    <div className="grid grid-cols-6 gap-5">
                        <input
                            id="edit-transaction-date"
                            name="date"
                            className="col-span-3 usa-input usa-date-picker_external-input"
                            type="date"
                            value={editTransaction?.date}
                            onChange={handleInputChange}
                        />
                        <div className="col-span-3" />
                        <hr className="col-span-6" />
                        <div className="col-span-4">
                            <Label htmlFor="edit-transaction-vendorName">Vendor Name</Label>
                            <TextInput
                                value={editTransaction?.vendorName}
                                id="edit-transaction-vendorName"
                                name="vendorName"
                                type="text"
                                onChange={handleInputChange}
                                required
                            />
                            <Label htmlFor="edit-transaction-amount">Amount</Label>
                            <InputGroup>
                                <InputPrefix>$</InputPrefix>
                                <TextInput
                                    value={editTransaction?.amount}
                                    id="edit-transaction-amount"
                                    name="amount"
                                    type="number"
                                    onChange={handleInputChange}
                                    required
                                />
                            </InputGroup>
                            <Label htmlFor="edit-transaction-category">Category</Label>
                            <div className="grid grid-cols-8">
                                <Select
                                    id="edit-transaction-category"
                                    name="category"
                                    value={editTransaction?.category}
                                    onChange={handleSelectChange}
                                    className="col-span-8"
                                >
                                    {Object.values(TransactionCategory).map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <Label htmlFor="edit-transaction-description">Description</Label>
                            <Textarea
                                value={editTransaction?.description || ""}
                                id="edit-transaction-description"
                                onChange={handleAreaChange}
                                name="description"
                            />
                            <Button type="submit">Submit</Button>
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="edit-transaction-account">Account</Label>
                            <div className="grid grid-cols-8">
                                <Select
                                    id="edit-transaction-account"
                                    name="accountId"
                                    value={editTransaction?.accountId}
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
        </div>
    );
};

export default Transactions;
