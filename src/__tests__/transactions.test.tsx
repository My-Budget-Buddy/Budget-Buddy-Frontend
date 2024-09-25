import React from 'react';
import Transactions from "../pages/Transactions/Transactions";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import { getAccountsByUserId, getTransactionByUserId } from '../utils/transactionService';
import { TransactionCategory } from '../types/models';
import exp from 'constants';

// Mock the useTranslation hook and Trans component
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
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

// jest.mock('../components/CategoryIcon', () => {
//     return {
//         __esModule: true,
//         default: jest.fn().mockImplementation(({ category, color }) => {
//             return <div data-testid={`category-icon-${category}`} style={{ color }} />;
//         }),
//     };
// });

// Define mock implementations for the functions
const mockGetTransactionByUserId = getTransactionByUserId as jest.MockedFunction<typeof getTransactionByUserId>;
const mockGetAccountsByUserId = getAccountsByUserId as jest.MockedFunction<typeof getAccountsByUserId>;

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
            institution: "Test Bank",
            investmentRate: 0.01,
            startingBalance: 1000,
            currentBalance: 1000,
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
    expect(screen.getByLabelText('addTransactionModal')).toBeInTheDocument();
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

