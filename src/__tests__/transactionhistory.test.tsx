import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
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

        // Change the category filter to 'Dining'
        fireEvent.change(categoryFilter, { target: { value: 'Dining' } });

        // Wait for the transactions to be filtered
        await waitFor(() => {
            const tableBody = container.querySelector('tbody');
            const { getByText, queryByText } = within(tableBody!);
            // Check that only the '-$100.00' transaction is displayed
            expect(getByText('-$100.00')).toBeInTheDocument();
            expect(queryByText('-$50.00')).not.toBeInTheDocument();
            expect(queryByText('-$75.00')).not.toBeInTheDocument();
        });
    });
});
