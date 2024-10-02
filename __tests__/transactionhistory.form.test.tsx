import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import TransactionHistory from '../src/pages/Transactions/TransactionHistory';

// Mock react-i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
    Trans: ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</>,
}));

// Mock transactionService functions
jest.mock('../src/utils/transactionService', () => ({
    getTransactionByVendor: jest.fn(),
    getAccountsByUserId: jest.fn(),
    updateTransaction: jest.fn(),
    deleteTransaction: jest.fn(),
    createTransaction: jest.fn(),
    validateTransaction: jest.fn(),
}));

// Mock focus-trap-react to prevent focus-trap errors during testing
jest.mock('focus-trap-react', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock @mui/x-charts
jest.mock('@mui/x-charts', () => ({
    __esModule: true,
    BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-bar-chart">{children}</div>,
}));

// Mock for @trussworks/react-uswds
jest.mock('@trussworks/react-uswds', () => {
    const React = require('react') as typeof import('react');

    // Define interfaces
    interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
        children: React.ReactNode;
        isLarge?: boolean;
    }

    interface ModalRef {
        toggleModal: () => void;
        modalIsOpen: boolean;
    }

    interface ModalToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
        children: React.ReactNode;
        modalRef: React.RefObject<ModalRef>;
    }

    // Mock Modal component
    const Modal = React.forwardRef<ModalRef, ModalProps>(({ children, isLarge, ...props }, ref) => {
        const [isOpen, setIsOpen] = React.useState(false);

        React.useImperativeHandle(ref, () => ({
            toggleModal: () => setIsOpen(prev => !prev),
            modalIsOpen: isOpen,
        }));

        return isOpen ? (
            <div role="dialog" {...props}>
                {children}
            </div>
        ) : null;
    });

    // Mock ModalToggleButton component
    const ModalToggleButton = React.forwardRef<HTMLButtonElement, ModalToggleButtonProps>(
        ({ children, modalRef, ...props }, ref) => {
            const handleClick = () => {
                modalRef.current?.toggleModal();
            };

            return (
                <button {...props} onClick={handleClick} ref={ref}>
                    {children}
                </button>
            );
        }
    );

    // Mock other components with proper typings
    return {
        __esModule: true,
        Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
        Form: ({ children, large, ...props }: React.FormHTMLAttributes<HTMLFormElement> & { large?: boolean }) => <form {...props}>{children}</form>, // Exclude 'large'
        Icon: {
            Edit: () => <span data-testid="icon-edit">EditIcon</span>,
            Delete: () => <span data-testid="icon-delete">DeleteIcon</span>,
            NavigateNext: () => <span data-testid="icon-navigate-next">NavigateNextIcon</span>,
            AccountBalance: () => <span data-testid="icon-account-balance">AccountBalanceIcon</span>,
        },
        InputGroup: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
        InputPrefix: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>,
        Label: ({ children, htmlFor, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => <label htmlFor={htmlFor} {...props}>{children}</label>, // Pass 'htmlFor'
        Modal,
        ModalHeading: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h2 {...props}>{children}</h2>,
        ModalToggleButton,
        Select: ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => <select {...props}>{children}</select>,
        Table: ({ children, bordered, fullWidth, ...props }: React.TableHTMLAttributes<HTMLTableElement> & { bordered?: boolean; fullWidth?: boolean }) => <table {...props}>{children}</table>, // Exclude 'bordered' and 'fullWidth'
        TextInput: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
        Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />,
        Title: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...props}>{children}</h1>,
    };
});

// Mock CategoryIcon
jest.mock('../src/components/CategoryIcon', () => ({
    __esModule: true,
    default: ({ category }: { category: string }) => <div data-testid="mock-category-icon">{category}</div>,
    categoryColors: {},
}));

// Define Transaction type
interface Transaction {
    transactionId: number;
    date: string;
    vendorName: string;
    category: string;
    amount: number;
    description: string;
    accountId: number;
    userId: number;
}

describe('TransactionHistory Component', () => {
    let mockTransactions: Transaction[] = [];

    beforeEach(() => {
        const {
            getTransactionByVendor,
            getAccountsByUserId,
            updateTransaction,
            deleteTransaction,
            createTransaction,
            validateTransaction,
        } = require('../src/utils/transactionService');

        // Initialize mockTransactions with initial data
        mockTransactions = [
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
        ];

        // Mock getTransactionByVendor to return the current mockTransactions
        getTransactionByVendor.mockImplementation(() => Promise.resolve([...mockTransactions]));

        // Mock getAccountsByUserId to return accounts
        getAccountsByUserId.mockResolvedValue([
            {
                id: 1,
                institution: 'Test Bank',
                accountNumber: '12345678',
            },
        ]);

        // Mock updateTransaction to update mockTransactions
        updateTransaction.mockImplementation(async (updatedTransaction: Transaction) => {
            mockTransactions = mockTransactions.map((tx) =>
                tx.transactionId === updatedTransaction.transactionId ? { ...tx, ...updatedTransaction } : tx
            );
            return Promise.resolve(updatedTransaction);
        });

        // Mock deleteTransaction to remove from mockTransactions
        deleteTransaction.mockImplementation(async (transactionId: number) => {
            mockTransactions = mockTransactions.filter((tx) => tx.transactionId !== transactionId);
            return Promise.resolve({});
        });

        // Mock createTransaction to add to mockTransactions
        createTransaction.mockImplementation(async (newTransaction: Transaction) => {
            mockTransactions.push(newTransaction);
            return Promise.resolve(newTransaction);
        });

        // Mock validateTransaction to return empty array (no errors)
        validateTransaction.mockReturnValue([]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test Wrapper for Router
    function TestWrapper({ children }: { children: React.ReactNode }) {
        return (
            <MemoryRouter initialEntries={['/dashboard/transactions/VendorName']}>
                <Routes>
                    <Route path="/:first/:second/:name" element={children} />
                </Routes>
            </MemoryRouter>
        );
    }

    it('handles form submission correctly', async () => {
        const { container } = render(
            <TestWrapper>
                <TransactionHistory />
            </TestWrapper>
        );

        // Wait for data to load
        await waitFor(() => {
            expect(require('../src/utils/transactionService').getTransactionByVendor).toHaveBeenCalledWith('VendorName');
        });

        const addTransactionButton = container.querySelector('#addTransactionModal') as HTMLElement;
        expect(addTransactionButton).toBeInTheDocument();
        fireEvent.click(addTransactionButton);

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        // find the input fields directly
        const amountInput = container.querySelector('#create-transaction-amount') as HTMLInputElement;
        const descriptionInput = container.querySelector('#create-transaction-description') as HTMLTextAreaElement;

        expect(amountInput).toBeInTheDocument();
        expect(descriptionInput).toBeInTheDocument();

        // user input
        fireEvent.change(amountInput, { target: { value: '-200' } }); // - value for expense
        fireEvent.change(descriptionInput, { target: { value: 'Test Transaction' } });

        // form submission
        const submitButton = screen.getByRole('button', { name: 'transactions.submit' });
        expect(submitButton).toBeInTheDocument();
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        await waitFor(() => {
            // check `formatCurrency` formatting
            expect(screen.getByText('-$200.00')).toBeInTheDocument();
        });

        const { createTransaction } = require('../src/utils/transactionService');
        const date = new Date();
        const formattedDate = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
        expect(createTransaction).toHaveBeenCalledWith({
            userId: 1,
            accountId: 1, // Assuming the first account is selected by default
            vendorName: 'VendorName',
            amount: "-200",
            category: 'Groceries',
            description: 'Test Transaction',
            date: formattedDate,
        });
    });

    it('handles API errors correctly when creating a transaction', async () => {
        const { container } = render(
            <TestWrapper>
                <TransactionHistory />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(require('../src/utils/transactionService').getTransactionByVendor).toHaveBeenCalledWith('VendorName');
        });

        // Simulate clicking Add Transaction button
        const addTransactionButton = container.querySelector('#addTransactionModal') as HTMLElement;
        expect(addTransactionButton).toBeInTheDocument();
        fireEvent.click(addTransactionButton);

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        const { createTransaction } = require('../src/utils/transactionService');
        createTransaction.mockRejectedValue(new Error('Network Error'));

        // Mocking console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        // Skipping actual input interactions
        fireEvent.click(screen.getByRole('button', { name: 'transactions.submit' }));

        await waitFor(() => {
            expect(createTransaction).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith("Error creating transaction:", expect.any(Error));
        });

        expect(screen.getByRole('dialog')).toBeInTheDocument();

        consoleErrorSpy.mockRestore();
    });

    it('handles editing a transaction correctly', async () => {
        const { container } = render(
            <TestWrapper>
                <TransactionHistory />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(require('../src/utils/transactionService').getTransactionByVendor).toHaveBeenCalledWith('VendorName');
        });

        // Find the first edit button transactionId:3
        const editButtons = screen.getAllByTestId('icon-edit');
        expect(editButtons.length).toBeGreaterThan(0);

        // Simulate clicking the first edit button
        fireEvent.click(editButtons[0]);

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        const amountInput = screen.getByLabelText('transactions-table.amount') as HTMLInputElement;
        fireEvent.change(amountInput, { target: { value: '-150' } });

        const submitButton = screen.getByRole('button', { name: 'transactions.submit' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('transactions.history')).toBeInTheDocument();
        });

        const { updateTransaction } = require('../src/utils/transactionService');
        expect(updateTransaction).toHaveBeenCalledWith({
            "accountId": -1,
            "amount": "-150",  // Expected: -150 STR
            "category": "Dining",
            "date": "1973-01-01",
            "description": "",
            "transactionId": -1,
            "userId": -1,
            "vendorName": "VendorName",
        });
    });

    it('handles deleting a transaction correctly', async () => {
        console.log(mockTransactions);

        const { container } = render(
            <TestWrapper>
                <TransactionHistory />
            </TestWrapper>
        );

        await waitFor(() => {
            let containsEntertainment = screen.queryAllByText('Entertainment', { selector: 'div' });
            expect(containsEntertainment).toHaveLength(1)
            // expect(screen.queryByText('Test Transaction 3')).toBeInTheDocument();
            // expect(require('../utils/transactionService').getTransactionByVendor).toHaveBeenCalledWith('VendorName');
        });

        const deleteButtons = screen.getAllByTestId('icon-delete');
        expect(deleteButtons.length).toBeGreaterThan(0);

        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            let containsEntertainment = screen.queryAllByText('Entertainment', { selector: 'div' });
            expect(containsEntertainment).toHaveLength(0)
            //expect(screen.queryByText('Test Transaction 3')).not.toBeInTheDocument();
        });

        const { deleteTransaction } = require('../src/utils/transactionService');
        expect(deleteTransaction).toHaveBeenCalledWith(3); // transactionId
        expect(deleteTransaction).toHaveBeenCalledTimes(1);
    });

    it('calls handleSelectChange when account select changes', async () => {
        const { container } = render(
            <TestWrapper>
                <TransactionHistory />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(require('../src/utils/transactionService').getTransactionByVendor).toHaveBeenCalledWith('VendorName');
        });

        const addButton = screen.getByRole('button', { name: 'transactions.add-transaction' });
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        const accountSelect = container.querySelector('#create-transaction-account') as HTMLSelectElement;

        expect(accountSelect).toBeInTheDocument();

        // Change the select value
        fireEvent.change(accountSelect, { target: { value: '1' } });

        expect(accountSelect.value).toBe('1');
    });
});
