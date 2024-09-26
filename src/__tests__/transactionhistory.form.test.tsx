// transactionhistory.form.test.tsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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
jest.mock('../components/CategoryIcon', () => ({
    __esModule: true,
    default: ({ category }: { category: string }) => <div data-testid="mock-category-icon">{category}</div>,
    categoryColors: {},
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
            expect(require('../utils/transactionService').getTransactionByVendor).toHaveBeenCalledWith('VendorName');
        });

        // Simulate clicking Add Transaction button
        const addTransactionButton = container.querySelector('#addTransactionModal') as HTMLElement;
        expect(addTransactionButton).toBeInTheDocument();
        fireEvent.click(addTransactionButton);

        // Wait for the modal to be in the document
        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        // Now find the form and input elements inside the modal
        const amountInput = screen.getByLabelText('transactions-table.amount') as HTMLInputElement;
        const descriptionInput = screen.getByLabelText('budgets.notes') as HTMLTextAreaElement;

        // Ensure the elements are found
        expect(amountInput).toBeInTheDocument();
        expect(descriptionInput).toBeInTheDocument();

        // Simulate user input
        fireEvent.change(amountInput, { target: { value: '-200' } }); // - value for expense
        fireEvent.change(descriptionInput, { target: { value: 'Test Transaction' } });

        // Simulate form submission
        const submitButton = screen.getByRole('button', { name: 'transactions.submit' });
        expect(submitButton).toBeInTheDocument();
        fireEvent.click(submitButton);

        // Wait for the modal to close
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        await waitFor(() => {
            // check `formatCurrency` formatting
            expect(screen.getByText('-$200.00')).toBeInTheDocument();
        });

        const { createTransaction } = require('../utils/transactionService');
        expect(createTransaction).toHaveBeenCalledWith({
            userId: 1,
            accountId: 1, // Assuming the first account is selected by default
            vendorName: 'VendorName',
            amount: -200,
            category: 'Groceries',
            description: 'Test Transaction',
            date: expect.any(String), // Date is set automatically
        });
    });
});
