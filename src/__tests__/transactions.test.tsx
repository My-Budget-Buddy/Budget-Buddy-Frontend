import React, { act } from 'react';
import Transactions from "../pages/Transactions/Transactions";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import { createTransaction, deleteTransaction, getAccountsByUserId, getTransactionByUserId, getTransactionByVendor, updateTransaction, validateTransaction } from '../utils/transactionService';
import { TransactionCategory } from '../types/models';
import { create } from 'domain';
import { mock } from 'node:test';

// Mock the useTranslation hook and Trans component
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            if (key === 'locale') return 'en-US';
            return key;
        }
    }),
    Trans: ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</>,
}));

jest.mock("../api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

// Mock the transactionService functions
jest.mock('../utils/transactionService');

jest.mock('focus-trap-react', () => {
    return ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
});


// Mock CategoryIcon
jest.mock('../components/CategoryIcon', () => ({
    __esModule: true,
    default: ({ category }: { category: string }) => <div data-testid="mock-category-icon">{category}</div>,
    categoryColors: {},
}));

// Mock formatCurrency and formatDate functions
jest.mock('../util/helpers', () => ({
    formatCurrency: (amount: number | bigint) => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            currencySign: 'standard',
        });
        return formatter.format(amount);
    },
    formatDate: (dateString: any) => dateString,
}));

// Define mock implementations for the functions
const mockGetTransactionByUserId = getTransactionByUserId as jest.MockedFunction<typeof getTransactionByUserId>;
const mockGetAccountsByUserId = getAccountsByUserId as jest.MockedFunction<typeof getAccountsByUserId>;
const mockCreateTransaction = createTransaction as jest.MockedFunction<typeof createTransaction>;
const mockUpdateTransaction = updateTransaction as jest.MockedFunction<typeof updateTransaction>;
const mockDeleteTransaction = deleteTransaction as jest.MockedFunction<typeof deleteTransaction>;
const mockGetTransactionByVendor = getTransactionByVendor as jest.MockedFunction<typeof getTransactionByVendor>;

describe('Transactions', () => {
    beforeEach(() => {
        // Set up the mock responses
        mockGetTransactionByUserId.mockResolvedValue([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },

            {
                transactionId: 2,
                date: "2022-08-05",
                vendorName: 'OtherVendor',
                category: 'Dining' as TransactionCategory,
                amount: 500.0,
                description: "Another Transaction",
                accountId: 1,
                userId: 1,
            },

        ]);

        mockGetAccountsByUserId.mockResolvedValue([
            {
                id: 1,
                userId: '123',
                accountNumber: "Test Account",
                type: "CHECKING",
                routingNumber: "123456789",
                institution: "Heritage Bank",
                investmentRate: 0.01,
                startingBalance: 1000,
                currentBalance: 1000,
            },

            {
                id: 2,
                userId: '123',
                accountNumber: "Test Account",
                type: "CHECKING",
                routingNumber: "123456789",
                institution: "Keystone Bank",
                investmentRate: 0.01,
                startingBalance: 1000,
                currentBalance: 1000,
            },
        ]);

        mockCreateTransaction.mockResolvedValue({
            transactionId: 3,
            date: "2021-10-01",
            vendorName: 'VendorName',
            category: 'Groceries' as TransactionCategory,
            amount: 300.0,
            description: "New Transaction",
            accountId: 1,
            userId: 1,
        });

        mockGetTransactionByVendor.mockResolvedValue([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },
        ]);


        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        expect(screen.getByLabelText('transactionsTitle')).toBeInTheDocument();
    });

    it('renders the clear filters button', () => {
        expect(screen.getByLabelText('clearFilters')).toBeInTheDocument();
    });

    it('renders the sort transactions button', () => {
        expect(screen.getByLabelText('sortTransactions')).toBeInTheDocument();
    });

    it('renders the sort direction button', () => {
        expect(screen.getByLabelText('sortDirection')).toBeInTheDocument();
    });

    it('renders the add transaction modal button', () => {
        expect(screen.getByLabelText('addTransactionBtn')).toBeInTheDocument();
    });

    it('shows no transactions message when list is empty', async () => {
        // Update mock to return empty transactions list
        (getTransactionByUserId as jest.Mock).mockResolvedValueOnce([]);

        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByLabelText('noTransactions')).toBeInTheDocument();
        });
    });

    it('displays transactions table when data is available', async () => {
        // Update mock to return empty transactions list
        (getTransactionByUserId as jest.Mock).mockResolvedValueOnce([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },
        ]);

        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );
        await waitFor(() => {
            screen.getAllByText('transactions-table.date').forEach(item => {
                expect(item).toBeInTheDocument();
            });
            screen.getAllByText('transactions-table.name').forEach(item => {
                expect(item).toBeInTheDocument();
            });
            screen.getAllByText('transactions-table.category').forEach(item => {
                expect(item).toBeInTheDocument();
            });
            screen.getAllByText('transactions-table.amount').forEach(item => {
                expect(item).toBeInTheDocument();
            });
        });
    });

    it('renders transaction rows with correct data', async () => {
        (getTransactionByUserId as jest.Mock).mockResolvedValueOnce([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },
        ]);

        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );
        await waitFor(() => {
            screen.getAllByText('VendorName').forEach(item => {
                expect(item).toBeInTheDocument();
            });
            screen.getAllByText('$100.00').forEach(item => {
                expect(item).toBeInTheDocument();
            });
            screen.getAllByText('Income').forEach(item => {
                expect(item).toBeInTheDocument();
            });
        });
    });

    it('filters transactions by category', async () => {
        mockGetTransactionByUserId.mockResolvedValue([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },

            {
                transactionId: 2,
                date: "2022-08-05",
                vendorName: 'OtherVendor',
                category: 'Dining' as TransactionCategory,
                amount: 500.0,
                description: "Another Transaction",
                accountId: 1,
                userId: 1,
            },

        ]);

        await waitFor(() => {
            const categorySelect = screen.getByLabelText('allCategoriesDropDown');
            fireEvent.change(categorySelect, { target: { value: 'Income' } });

            expect(screen.getByText('VendorName')).toBeInTheDocument();
            expect(screen.queryByText('OtherVendor')).not.toBeInTheDocument();
        });
    });



    it('filters transactions by account', async () => {
        mockGetTransactionByUserId.mockResolvedValue([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },

            {
                transactionId: 2,
                date: "2022-08-05",
                vendorName: 'OtherVendor',
                category: 'Dining' as TransactionCategory,
                amount: 500.0,
                description: "Another Transaction",
                accountId: 2,
                userId: 1,
            },

        ]);
        mockGetAccountsByUserId.mockResolvedValue([
            {
                id: 1,
                userId: '123',
                accountNumber: "Test Account",
                type: "CHECKING",
                routingNumber: "123456789",
                institution: "Heritage Bank",
                investmentRate: 0.01,
                startingBalance: 1000,
                currentBalance: 1000,
            },

            {
                id: 2,
                userId: '123',
                accountNumber: "Test Account",
                type: "CHECKING",
                routingNumber: "123456789",
                institution: "Keystone Bank",
                investmentRate: 0.01,
                startingBalance: 1000,
                currentBalance: 1000,
            },
        ]);
        await waitFor(() => {
            const accountSelect = screen.getByLabelText('allAccountDropDown');
            fireEvent.change(accountSelect, { target: { value: 'Heritage Bank' } });

            const heritageBankNames = screen.getAllByText('Heritage Bank');
            expect(heritageBankNames[0]).toBeInTheDocument();
        });
    });

    it('filters transactions by date', async () => {
        mockGetTransactionByUserId.mockResolvedValue([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },

            {
                transactionId: 2,
                date: "2022-08-05",
                vendorName: 'OtherVendor',
                category: 'Dining' as TransactionCategory,
                amount: 500.0,
                description: "Another Transaction",
                accountId: 1,
                userId: 1,
            },

        ]);
        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );
        await waitFor(async () => {

            const datesDropDowns = screen.getAllByLabelText('allDatesDropDown');
            const dateDropDown = datesDropDowns[0];
            fireEvent.change(dateDropDown, { target: { value: 'date' } });

            // Wait for the date inputs to appear
            const minDate = await screen.findByPlaceholderText('Min Date');
            const maxDate = await screen.findByPlaceholderText('Max Date');

            // Change the dates
            fireEvent.change(minDate, { target: { value: '2023-10-01' } });
            fireEvent.change(maxDate, { target: { value: '2023-10-05' } });

            // Check that the dates have been changed
            expect(minDate).toHaveValue('2023-10-01');
            expect(maxDate).toHaveValue('2023-10-05');

            const vendorNames = screen.getAllByText('VendorName');
            const vendorName = vendorNames[0]
            expect(vendorName).toBeInTheDocument();
            // await waitFor(() => {
            //     expect(screen.queryByText('OtherVendor')).not.toBeInTheDocument();
            // });
        });
    });

    it('filters transactions by amount', async () => {
        mockGetTransactionByUserId.mockResolvedValue([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },

            {
                transactionId: 2,
                date: "2022-08-05",
                vendorName: 'OtherVendor',
                category: 'Dining' as TransactionCategory,
                amount: 500.0,
                description: "Another Transaction",
                accountId: 1,
                userId: 1,
            },

        ]);
        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );
        await waitFor(async () => {
            const amountDropDowns = screen.getAllByLabelText('allAmountsDropDown');
            const amountDropDown = amountDropDowns[0];
            fireEvent.change(amountDropDown, { target: { value: 'amount' } });

            // Wait for the amount inputs to appear
            const minAmount = await screen.findByPlaceholderText('Min Amount');
            const maxAmount = await screen.findByPlaceholderText('Max Amount');

            // Change the amounts
            fireEvent.change(minAmount, { target: { value: '100' } });
            fireEvent.change(maxAmount, { target: { value: '200' } });

            // Check that the amounts have been changed
            expect(minAmount).toHaveValue(100);
            expect(maxAmount).toHaveValue(200);

            const vendorNames = screen.getAllByText('VendorName');
            const vendorName = vendorNames[0]
            expect(vendorName).toBeInTheDocument();
            // await waitFor(() => {
            //     expect(screen.queryByText('OtherVendor')).not.toBeInTheDocument();
            // });
        });
    });

    it('opens and submits edit transaction modal', async () => {
        (validateTransaction as jest.Mock).mockReturnValue([]);

        (updateTransaction as jest.Mock).mockResolvedValueOnce([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },
        ]);
        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Open edit transaction modal
        const editButtons = await screen.findAllByLabelText('edit-transaction-btn');
        fireEvent.click(editButtons[0]);

        // Modify the description
        const editDescriptions = await screen.findAllByLabelText('edit-transaction-description');
        fireEvent.change(editDescriptions[0], { target: { value: 'Updated Description' } });

        // Submit the form
        const editSubmitButtons = await screen.findAllByLabelText('edit-transactions.submit');
        fireEvent.click(editSubmitButtons[0]);

        await waitFor(() => {
            expect(mockUpdateTransaction).toHaveBeenCalled();
        });
    });



    it('opens and submits create transaction modal', async () => {
        (validateTransaction as jest.Mock).mockReturnValue([]);

        const mockTransactions = [
            {
                transactionId: 1,
                date: "2022-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },
        ];

        (createTransaction as jest.Mock).mockResolvedValueOnce(mockTransactions);

        // Ensure date is not undefined
        mockTransactions.forEach(transaction => {
            expect(transaction.date).toBeDefined();
        });
        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Open create transaction modal
        const createButtons = await screen.findAllByLabelText('addTransactionModal');
        fireEvent.click(createButtons[0]);

        // Fill out the form

        const createAmounts = await screen.findAllByLabelText('transactions-table.amount') as HTMLInputElement[];
        fireEvent.change(createAmounts[0], { target: { value: '200.0' } });

        const createDates = await screen.findAllByLabelText('create-transaction-date') as HTMLInputElement[];
        fireEvent.change(createDates[0], { target: { value: '2023-10-01' } });

        const createVendors = await screen.findAllByLabelText('transactions-table.name') as HTMLInputElement[];
        fireEvent.change(createVendors[0], { target: { value: 'New Vendor' } });

        const createCategories = await screen.findAllByLabelText('transactions-table.category');
        fireEvent.change(createCategories[0] as HTMLInputElement, { target: { value: 'Income' } });


        // Submit the form
        const createSubmitButtons = await screen.findAllByLabelText('addTransactionBtn');
        fireEvent.click(createSubmitButtons[0]);


        await waitFor(() => {
            expect(createTransaction).toHaveBeenCalled();
        });
    });

    it('deletes a transaction', async () => {
        (deleteTransaction as jest.Mock).mockResolvedValueOnce([]);

        mockGetTransactionByVendor.mockResolvedValue([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },
        ]);

        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Press the delete button
        const deleteButtons = await screen.findAllByLabelText('delete-transaction-btn');
        fireEvent.click(deleteButtons[0]);


        await waitFor(() => {
            expect(deleteTransaction).toHaveBeenCalled();
        });
    });

    it('renders the transaction details modal', async () => {
        mockGetTransactionByVendor.mockResolvedValue([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },
        ]);
        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Open the details modal
        const detailsButtons = await screen.findAllByLabelText('transaction-arrow');
        fireEvent.click(detailsButtons[0]);

        await waitFor(() => {
            screen.getAllByLabelText('transactionDetailedInfo').forEach(item => {
                expect(item).toBeInTheDocument();
            });
        });
    });

});






