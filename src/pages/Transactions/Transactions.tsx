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
    Textarea
} from "@trussworks/react-uswds";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Transaction, TransactionCategory, Account } from "../../types/models.ts";
import { deleteTransaction, getTransactionByUserId, getAccountsByUserId } from "../../utils/transactionService.ts";

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
    const [infoTransaction, setInfoTransaction] = useState<Transaction | null>(null);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
    const [selectedAccount, setSelectedAccount] = useState<string>("All Accounts");

    const [minAmount, setMinAmount] = useState<number | "">("");
    const [maxAmount, setMaxAmount] = useState<number | "">("");
    const [showAmountFilter, setShowAmountFilter] = useState<boolean>(false);

    const [minDate, setMinDate] = useState<string>("");
    const [maxDate, setMaxDate] = useState<string>("");
    const [showDateFilter, setShowDateFilter] = useState<boolean>(false);

    const [sortOrder, setSortOrder] = useState<string>("date"); // default sort by date
    const [sortDirection, setSortDirection] = useState<string>("asc"); // default sort ascending


    const modalRef = useRef<ModalRef>(null);
    const infoRef = useRef<ModalRef>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const transactionsData = await getTransactionByUserId(1);
            setTransactions(transactionsData);

            const accountsData = await getAccountsByUserId(1);
            setAccounts(accountsData);
        };
        fetchData();
    }, []);

    useEffect(() => {
        let sortedTransactions = [...transactions].filter((transaction) =>
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
    }, [selectedCategory, selectedAccount, minAmount, maxAmount, minDate, maxDate, transactions, sortOrder, sortDirection]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!currentTransaction) return;

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const updatedTransaction: Transaction = {
            ...currentTransaction,
            vendorName: formData.get("vendorName") as string,
            date: formData.get("date") as string,
            category: formData.get("category") as TransactionCategory,
            amount: parseFloat(formData.get("amount") as string),
            description: formData.get("description") as string,
            accountId: parseInt(formData.get("accountId") as string)
        };

        setTransactions(
            transactions.map((transaction) =>
                transaction.transactionId === currentTransaction.transactionId ? updatedTransaction : transaction
            )
        );
        modalRef.current?.toggleModal();
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setCurrentTransaction((prev) => prev && { ...prev, [name]: value });
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setCurrentTransaction((prev) => prev && { ...prev, [name]: value });
    };

    const handleDelete = async (transactionId: number) => {
        await deleteTransaction(transactionId);
        setTransactions(transactions.filter((t) => t.transactionId !== transactionId));
    };

    const handleInfoOpen = (transaction: Transaction) => setInfoTransaction(transaction);

    const handleViewHistory = (infoTransaction: Transaction) =>
        navigate(`/dashboard/transactions/${encodeURIComponent(infoTransaction.vendorName)}`);

    const getAccountDetails = (accountId: number) => accounts.find(account => account.id === accountId);

    return (
        <div className="min-h-screen bg-gray-100 p-4 pr-10 pl-10 flex flex-col gap-6">
            <div className="flex justify-between items-center bg-transparent p-4 ">
                <h1>Transactions</h1>
                <div className="flex gap-4">
                    <Button type="button" className="usa-button--secondary" onClick={() => {
                        setSelectedCategory("All Categories");
                        setSelectedAccount("All Accounts");
                        setMinAmount("");
                        setMaxAmount("");
                        setMinDate("");
                        setMaxDate("");
                        setSortOrder("date");
                        setSortDirection("asc");
                    }}>
                        Clear Filters
                    </Button>
                    <select className="p-2 border rounded" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="date">Sort by date</option>
                        <option value="amount">Sort by amount</option>
                    </select>
                    <select className="p-2 border rounded" value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>

                    <Button type="button" className="usa-button" onClick={() => modalRef.current?.toggleModal()}>
                        Add Transaction
                    </Button>
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
                    onChange={(e) => {
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
                    onChange={(e) => {
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
                                name="min-amount"
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
                                name="max-amount"
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
                                name="min-date"
                                type="date"
                                placeholder="Min Date"
                                onChange={(e) => setMinDate(e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup>
                            <TextInput
                                value={maxDate}
                                id="max-date"
                                name="max-date"
                                type="date"
                                placeholder="Max Date"
                                onChange={(e) => setMaxDate(e.target.value)}
                            />
                        </InputGroup>
                    </div>
                </div>
            )}

            <div className="flex-grow">
                <CardGroup>
                    <Card gridLayout={{ col: 12 }}>
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
                                {filteredTransactions.map((transaction) => (
                                    <tr key={transaction.transactionId}>
                                        <td>{transaction.date}</td>
                                        <td>{transaction.vendorName}</td>
                                        <td>{transaction.category}</td>
                                        <td>
                                            <ModalToggleButton
                                                type="button"
                                                className="usa-button--unstyled"
                                                modalRef={modalRef}
                                                onClick={() => setCurrentTransaction(transaction)}
                                            >
                                                <Icon.Edit />
                                            </ModalToggleButton>
                                            <Button
                                                type="button"
                                                className="usa-button--unstyled"
                                                onClick={() => handleDelete(transaction.transactionId)}
                                            >
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
                </CardGroup>
            </div>

            <Modal ref={modalRef} id="transaction-modal" isLarge>
                {currentTransaction && (
                    <Form onSubmit={handleSubmit} large>
                        <div className="grid grid-cols-6 gap-5">
                            <input
                                id="transaction-date"
                                name="date"
                                className="col-span-3 usa-input usa-date-picker_external-input"
                                type="date"
                                value={currentTransaction.date}
                                onChange={handleInputChange}
                            />
                            <div className="col-span-3" />
                            <hr className="col-span-6" />
                            <div className="col-span-4">
                                <Label htmlFor="transaction-vendorName">Vendor</Label>
                                <TextInput
                                    value={currentTransaction.vendorName}
                                    id="transaction-vendorName"
                                    name="vendorName"
                                    type="text"
                                    onChange={handleInputChange}
                                />
                                <Label htmlFor="transaction-amount">Amount</Label>
                                <InputGroup>
                                    <InputPrefix>$</InputPrefix>
                                    <TextInput
                                        value={currentTransaction.amount}
                                        id="transaction-amount"
                                        name="amount"
                                        type="number"
                                        onChange={handleInputChange}
                                    />
                                </InputGroup>
                                <Label htmlFor="transaction-category">Category</Label>
                                <div className="grid grid-cols-8">
                                    <Select
                                        id="transaction-category"
                                        name="category"
                                        value={currentTransaction.category}
                                        onChange={handleSelectChange}
                                        className="col-span-7"
                                    >
                                        {Object.values(TransactionCategory).map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </Select>
                                    <Button type="button" className="usa-button--unstyled">
                                        <Icon.Add size={4} />
                                    </Button>
                                </div>
                                <Label htmlFor="transaction-description">Description</Label>
                                <Textarea
                                    value={currentTransaction.description || ''}
                                    id="transaction-description"
                                    name="description"
                                    onChange={handleInputChange}
                                />
                                <ModalToggleButton modalRef={modalRef} type="submit">
                                    Submit
                                </ModalToggleButton>
                            </div>
                        </div>
                    </Form>
                )}
            </Modal>

            <Modal ref={infoRef} id="transaction-info-modal" isLarge>
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
                                    <p className="mt-4 text-lg">{infoTransaction.category}</p>
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
                                                    <div>{getAccountDetails(infoTransaction.accountId)?.institution}</div>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-500">
                                                    Account Number: {getAccountDetails(infoTransaction.accountId)?.accountNumber}
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
        </div>
    );
};

export default Transactions;
