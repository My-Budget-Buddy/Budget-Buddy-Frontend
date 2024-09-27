import React from 'react';
import { render, screen, waitFor, fireEvent, within, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import TransactionHistory from '../pages/Transactions/TransactionHistory';

// Mock react-i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
    Trans: ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</>,
}));

// Mock transactionService functions
jest.mock('../utils/transactionService', () => ({
    getTransactionByVendor: jest.fn(),
    getAccountsByUserId: jest.fn(),
    updateTransaction: jest.fn(),
    deleteTransaction: jest.fn(),
    createTransaction: jest.fn(),
    validateTransaction: jest.fn(),
}));

// Mock @mui/x-charts
jest.mock('@mui/x-charts', () => ({
    BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

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

// Mock focus-trap to prevent focus-trap errors during testing
jest.mock('focus-trap', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        activate: jest.fn(),
        deactivate: jest.fn(),
        pause: jest.fn(),
        unpause: jest.fn(),
    })),
}));

describe('TransactionHistory Component', () => {
    beforeEach(() => {
        const {
            getTransactionByVendor,
            getAccountsByUserId,
            updateTransaction,
            deleteTransaction,
            createTransaction,
            validateTransaction,
        } = require('../utils/transactionService');

        getTransactionByVendor.mockResolvedValue([
            {
                transactionId: 1,
                date: '2023-10-01',
                vendorName: 'VendorName',
                category: 'Dining',
                amount: -100.0,
                description: 'Test Transaction 1',
                accountId: 1,
                userId: 1,
            },
            {
                transactionId: 2,
                date: '2023-10-02',
                vendorName: 'VendorName',
                category: 'Groceries',
                amount: -50.0,
                description: 'Test Transaction 2',
                accountId: 1,
                userId: 1,
            },
            {
                transactionId: 3,
                date: '2023-10-03',
                vendorName: 'VendorName',
                category: 'Entertainment',
                amount: -75.0,
                description: 'Test Transaction 3',
                accountId: 1,
                userId: 1,
            },
        ]);

        getAccountsByUserId.mockResolvedValue([
            {
                id: 1,
                institution: 'Test Bank',
                accountNumber: '12345678',
            },
        ]);

        updateTransaction.mockResolvedValue({
            transactionId: 1,
            date: '2023-10-01',
            vendorName: 'VendorName',
            category: 'Dining',
            amount: -150.0, // updated amount
            description: 'Updated Transaction',
            accountId: 1,
            userId: 1,
        });

        deleteTransaction.mockResolvedValue({});

        createTransaction.mockResolvedValue({
            transactionId: 4,
            date: '2023-10-04',
            vendorName: 'VendorName',
            category: 'Groceries',
            amount: -200.0,
            description: 'New Transaction',
            accountId: 1,
            userId: 1,
        });

        validateTransaction.mockReturnValue([]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test Wrapper Component
    function TestWrapper({ children }: { children: React.ReactNode }) {
        return (
            <MemoryRouter initialEntries={['/dashboard/transactions/VendorName']}>
                <Routes>
                    <Route path="/:first/:second/:name" element={children} />
                </Routes>
            </MemoryRouter>
        );
    }

    it('filters transactions by category', async () => {
        const { container } = render(
            <TestWrapper>
                <TransactionHistory />
            </TestWrapper>
        );

        // Wait for data to be loaded
        await waitFor(() => {
            expect(require('../utils/transactionService').getTransactionByVendor).toHaveBeenCalled();
        });

        // Ensure transactions are displayed
        const vendorNames = screen.getAllByText('VendorName');
        expect(vendorNames.length).toBeGreaterThan(0);

        // Get the category filter select element
        const categoryFilter = container.querySelector('#allCategoriesDropDown') as HTMLElement;

        // Change the category filter to Dining
        fireEvent.change(categoryFilter, { target: { value: 'Dining' } });

        // Wait for the transactions to be filtered
        await waitFor(() => {
            const tableBody = container.querySelector('tbody');
            const { getByText, queryByText } = within(tableBody!);
            // Check that only the -$100.00 transaction is displayed
            expect(getByText('-$100.00')).toBeInTheDocument();
            expect(queryByText('-$50.00')).not.toBeInTheDocument();
            expect(queryByText('-$75.00')).not.toBeInTheDocument();
        });
    });

    it('filters transactions by date range', async () => {
        const { container } = render(
            <TestWrapper>
                <TransactionHistory />
            </TestWrapper>
        );

        // Wait for data to be loaded
        await waitFor(() => {
            expect(require('../utils/transactionService').getTransactionByVendor).toHaveBeenCalled();
        });

        // Get the date filter select element
        const dateFilter = container.querySelector('#allDatesDropDown') as HTMLElement;

        // Change the date filter to 'date' to show date range inputs
        fireEvent.change(dateFilter, { target: { value: 'date' } });

        // Wait for the date range inputs to appear
        await waitFor(() => {
            expect(container.querySelector('#min-date')).toBeInTheDocument();
            expect(container.querySelector('#max-date')).toBeInTheDocument();
        });

        // Set minDate to 2023-10-02 and maxDate to 2023-10-03
        const minDateInput = container.querySelector('#min-date') as HTMLInputElement;
        const maxDateInput = container.querySelector('#max-date') as HTMLInputElement;

        fireEvent.change(minDateInput, { target: { value: '2023-10-02' } });
        fireEvent.change(maxDateInput, { target: { value: '2023-10-03' } });

        // Wait for the transactions to be filtered
        await waitFor(() => {
            const tableBody = container.querySelector('tbody');
            const { getByText, queryByText } = within(tableBody!);
            expect(getByText('-$50.00')).toBeInTheDocument();
            expect(getByText('-$75.00')).toBeInTheDocument();
            expect(queryByText('-$100.00')).not.toBeInTheDocument();
        });
    });

    it('clears filters when "Clear Filters" button is clicked', async () => {
        const { container } = render(
            <TestWrapper>
                <TransactionHistory />
            </TestWrapper>
        );

        // Apply a category filter
        const categoryFilter = container.querySelector('#allCategoriesDropDown') as HTMLElement;
        fireEvent.change(categoryFilter, { target: { value: 'Dining' } });

        // Wait for the transactions to be filtered
        await waitFor(() => {
            const tableBody = container.querySelector('tbody');
            const { getByText, queryByText } = within(tableBody!);
            expect(getByText('-$100.00')).toBeInTheDocument();
            expect(queryByText('-$50.00')).not.toBeInTheDocument();
            expect(queryByText('-$75.00')).not.toBeInTheDocument();
        });

        // Click 'Clear Filters' button
        const clearFiltersButton = container.querySelector('#clearFilterBtn') as HTMLElement;
        fireEvent.click(clearFiltersButton);

        // Wait for all transactions to be displayed
        await waitFor(() => {
            const tableBody = container.querySelector('tbody');
            const { getByText } = within(tableBody!);
            expect(getByText('-$100.00')).toBeInTheDocument();
            expect(getByText('-$50.00')).toBeInTheDocument();
            expect(getByText('-$75.00')).toBeInTheDocument();
        });
    });

    it('sorts transactions by amount in ascending order', async () => {
        const { container } = render(
            <TestWrapper>
                <TransactionHistory />
            </TestWrapper>
        );

        // Change the sort order to amount
        const sortByDropdown = container.querySelector('#sortByDropdown') as HTMLSelectElement;
        fireEvent.change(sortByDropdown, { target: { value: 'amount' } });

        // Change the sort direction to asc
        const directionDropdown = container.querySelector('#directionDropdown') as HTMLSelectElement;
        fireEvent.change(directionDropdown, { target: { value: 'asc' } });

        // Wait for the transactions to be sorted
        await waitFor(() => {
            const tableBody = container.querySelector('tbody');
            const rows = tableBody?.querySelectorAll('tr');
            expect(rows).toHaveLength(3);

            // Get the amounts from the rows
            const amounts = Array.from(rows!).map(row => {
                const amountCell = row.querySelector('td:nth-child(5)');
                return amountCell?.textContent;
            });

            // The expected order is -$50.00, -$75.00, -$100.00
            expect(amounts).toEqual(['-$50.00', '-$75.00', '-$100.00']);
        });
    });

    it('opens detailed info modal when clicking on a bar in the chart', async () => {
        const { container } = render(
            <TestWrapper>
                <TransactionHistory />
            </TestWrapper>
        );

        // Wait for data to be loaded
        await waitFor(() => {
            expect(require('../utils/transactionService').getTransactionByVendor).toHaveBeenCalled();
        });


        // Simulate clicking on a bar
        const barChart = container.querySelector('.bar-chart');
        if (barChart) {
            fireEvent.click(barChart);

            // Wait for the modal
            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });

            // Verify that the modal displays correct transaction details
            expect(screen.getByText('transactions.transaction-detailed-information')).toBeInTheDocument();

            // Close the modal
            const closeButton = screen.getByRole('button', { name: /Close/i });
            fireEvent.click(closeButton);

            // Wait for the modal to close
            await waitFor(() => {
                expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            });
        }
    });

    it('filters transactions by amount range', async () => {
        const { container } = render(
            <TestWrapper>
                <TransactionHistory />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(require('../utils/transactionService').getTransactionByVendor).toHaveBeenCalled();
        });

        const amountFilter = container.querySelector('#allAmountsDropDown') as HTMLSelectElement;
        fireEvent.change(amountFilter, { target: { value: 'amount' } });

        await waitFor(() => {
            expect(container.querySelector('#min-amount')).toBeInTheDocument();
            expect(container.querySelector('#max-amount')).toBeInTheDocument();
        });

        const minAmountInput = container.querySelector('#min-amount') as HTMLInputElement;
        const maxAmountInput = container.querySelector('#max-amount') as HTMLInputElement;
        fireEvent.change(minAmountInput, { target: { value: '-80' } });
        fireEvent.change(maxAmountInput, { target: { value: '-60' } });

        await waitFor(() => {
            const tableBody = container.querySelector('tbody');
            const { getByText, queryByText } = within(tableBody!);
            expect(getByText('-$75.00')).toBeInTheDocument();
            expect(queryByText('-$100.00')).not.toBeInTheDocument();
            expect(queryByText('-$50.00')).not.toBeInTheDocument();
        });
    });

    it('changes sort order and direction', async () => {
        const { container } = render(
            <TestWrapper>
                <TransactionHistory />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(require('../utils/transactionService').getTransactionByVendor).toHaveBeenCalled();
        });

        const sortByDropdown = container.querySelector('#sortByDropdown') as HTMLSelectElement;
        fireEvent.change(sortByDropdown, { target: { value: 'amount' } });

        const directionDropdown = container.querySelector('#directionDropdown') as HTMLSelectElement;
        fireEvent.change(directionDropdown, { target: { value: 'asc' } });

        await waitFor(() => {
            const tableBody = container.querySelector('tbody');
            const rows = tableBody?.querySelectorAll('tr');
            expect(rows).toHaveLength(3);

            const amounts = Array.from(rows!).map(row => {
                const amountCell = row.querySelector('td:nth-child(5)');
                return amountCell?.textContent;
            });

            expect(amounts).toEqual(['-$50.00', '-$75.00', '-$100.00']);
        });
    });

    it('handles no accounts gracefully', async () => {
        const { getAccountsByUserId } = require('../utils/transactionService');
        getAccountsByUserId.mockResolvedValue([]);

        render(
            <TestWrapper>
                <TransactionHistory />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(getAccountsByUserId).toHaveBeenCalled();
        });

        // Component renders fine with no accounts
        expect(screen.getByText('transactions.add-transaction')).toBeInTheDocument();
    });

    it('handles no transactions gracefully', async () => {
        const { getTransactionByVendor } = require('../utils/transactionService');
        getTransactionByVendor.mockResolvedValue([]);

        render(
            <TestWrapper>
                <TransactionHistory />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(getTransactionByVendor).toHaveBeenCalled();
        });

        // Component renders fine with no transactions
        expect(screen.getByText('transactions.add-transaction')).toBeInTheDocument();
    });
});