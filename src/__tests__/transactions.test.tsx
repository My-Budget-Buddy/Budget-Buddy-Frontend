import React from 'react';
import Transactions from "../pages/Transactions/Transactions";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Transaction, TransactionCategory } from '../types/models';


// Mock react-router-dom useNavigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

// Mock React's useState
const mockSetTransactions = jest.fn();
jest.spyOn(React, 'useState').mockReturnValue([[], mockSetTransactions]);

// Mock useRef
const mockInfoRef = { current: { /* mock properties of ModalRef if necessary */ } };
jest.spyOn(React, 'useRef').mockReturnValue(mockInfoRef);

// Mock transactionService, including mockTransaction inside the mock itself
jest.mock('../utils/transactionService', () => {
    const mockTransaction: Transaction = {
        transactionId: 1,
        userId: 1,
        vendorName: 'Vendor',
        amount: 100,
        date: '2022-01-01',
        category: "Category" as TransactionCategory,
        accountId: 1,
        description: 'Description',
    };

    const mockAccount = { accountId: 1, accountName: 'Test Account' }; // Mock account data

    return {
        getTransactionByUserId: jest.fn().mockResolvedValue([mockTransaction]),
        getAccountsByUserId: jest.fn().mockResolvedValue([mockAccount]), // Mock accounts data
    };
});

// Mock API config
jest.mock("../api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

beforeEach(() => {
    render(<Transactions />);
});

afterEach(() => {
    jest.clearAllMocks();
});

it('renders without crashing', () => {
    expect(screen.getByText('transactions.title')).toBeInTheDocument();
});
