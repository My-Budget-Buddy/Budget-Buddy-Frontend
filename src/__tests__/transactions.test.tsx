import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Transactions from '../pages/Transactions/Transactions';
import { validateTransaction, getTransactionByUserId, deleteTransaction, getAccountsByUserId, createTransaction, updateTransaction, getTransactionByVendor } from '../utils/transactionService';
import { createTransactionAPI, deleteTransactionAPI, getAccountsByUserIdAPI, getTransactionByUserIdAPI, getTransactionByVendorAPI, updateTransactionAPI } from "../pages/Tax/taxesAPI"; 
import '@testing-library/jest-dom';
import { Account, Transaction, TransactionCategory } from '../types/models';

// Mock the API calls
jest.mock('../pages/Tax/taxesAPI');

jest.mock('../utils/transactionService');

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: {
        changeLanguage: jest.fn(),
        language: 'en',
      },
    }),
  }));

describe('Transactions component', () => {
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

    const mockAccount: Account = {
        id: 1,
        userId: '123',
        accountNumber: "Test Account",
        type: "CHECKING",
        routingNumber: "123456789",
        institution: "Test Bank",
        investmentRate: 0.01,
        startingBalance: 1000,
        currentBalance: 1000,
    };
    beforeEach(() => {
    // Mock the transactionService functions
    (getTransactionByUserIdAPI as jest.Mock).mockResolvedValue({ data: [mockTransaction] });
    (deleteTransaction as jest.Mock).mockResolvedValue({data: null});
    (getAccountsByUserId as jest.Mock).mockResolvedValue({ data: [mockAccount] });
    (createTransaction as jest.Mock).mockResolvedValue({ data: [mockTransaction] });
    (updateTransaction as jest.Mock).mockResolvedValue({data: [mockTransaction]});
    (getTransactionByVendor as jest.Mock).mockResolvedValue({ data: [mockTransaction] });
    (validateTransaction as jest.Mock).mockReturnValue({data: []});
        render(
            <Router>
                <Transactions />
            </Router>
        );
    });

    // test('renders without crashing', () => {
    //     const transactionsComponent = screen.getByTestId('transactions');
    //     expect(transactionsComponent).toBeInTheDocument();
    // });

    test('renders transaction title', () => {
        expect(screen.getByText('transactions.list-of-transactions')).toBeInTheDocument();
    });

    // test('renders transaction table', () => {
    //     expect(screen.getByTestId('transaction-table')).toBeInTheDocument();
    // });
});