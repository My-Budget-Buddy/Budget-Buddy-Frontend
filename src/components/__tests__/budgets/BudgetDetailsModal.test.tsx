import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Transaction, TransactionCategory } from '../../../types/models';
import BudgetDetailsModal from '../../modals/BudgetDetailsModal';

// Mock the i18next translation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock the formatCurrency helper function
jest.mock('../../../utils/helpers', () => ({
    formatCurrency: jest.fn((amount) => `$${amount.toFixed(2)}`),
}));

// Sample data for testing
const mockTransactions: Transaction[] = [
    {
        transactionId: 1,
        userId: 123,
        accountId: 456,
        vendorName: 'Vendor 1',
        amount: 50.75,
        description: 'First transaction description',
        category: TransactionCategory.GROCERIES, // Assuming enum is available
        date: '2024-10-01',
    },
    {
        transactionId: 2,
        userId: 123,
        accountId: 456,
        vendorName: 'Vendor 2',
        amount: 120.0,
        description: null,
        category: TransactionCategory.DINING, // Assuming enum is available
        date: '2024-10-02',
    },
];

describe('BudgetDetailsModal Component', () => {
    const defaultProps = {
        category: 'Groceries',
        budgeted: 500,
        actual: 400,
        remaining: 100,
        notes: 'Sample notes for the budget.',
        transactions: mockTransactions,
        isReserved: false,
    };

    test('renders budget details correctly', () => {
        render(<BudgetDetailsModal {...defaultProps} />);

        // Note dangling colon
        expect(screen.getByText('budgets.category:')).toBeInTheDocument();
        expect(screen.getByText('Groceries')).toBeInTheDocument();

        expect(screen.getByText('budgets.budgeted:')).toBeInTheDocument();
        expect(screen.getByText('$500.00')).toBeInTheDocument();

        expect(screen.getByText('budgets.actual:')).toBeInTheDocument();
        expect(screen.getByText('$400.00')).toBeInTheDocument();

        expect(screen.getByText('budgets.remaining:')).toBeInTheDocument();
        expect(screen.getByText('$100.00')).toBeInTheDocument();
    });

    test('displays the notes correctly', () => {
        render(<BudgetDetailsModal {...defaultProps} />);

        // Check that the notes textarea is disabled and displays the correct value
        const notesTextarea = screen.getByLabelText('budgets.notes:');
        expect(notesTextarea).toBeInTheDocument();
        expect(notesTextarea).toHaveValue('Sample notes for the budget.');
        expect(notesTextarea).toBeDisabled();
    });

    test('renders transaction history table correctly', () => {
        render(<BudgetDetailsModal {...defaultProps} />);

        // Check that the transaction history title and total are displayed correctly
        expect(screen.getByText('Groceries budgets.transaction-history')).toBeInTheDocument();
        expect(screen.getByText('2 budgets.transaction-total')).toBeInTheDocument();

        // Check that the transactions are displayed in the table
        const transactionRows = screen.getAllByRole('row');
        expect(transactionRows).toHaveLength(3); // 1 header row + 2 transaction rows

        expect(screen.getByText('2024-10-01')).toBeInTheDocument();
        expect(screen.getByText('Vendor 1')).toBeInTheDocument();
        expect(screen.getByText('$50.75')).toBeInTheDocument();

        expect(screen.getByText('2024-10-02')).toBeInTheDocument();
        expect(screen.getByText('Vendor 2')).toBeInTheDocument();
        expect(screen.getByText('$120.00')).toBeInTheDocument();
    });

    test('displays correctly when there are no transactions', () => {
        const emptyTransactionsProps = { ...defaultProps, transactions: [] };
        render(<BudgetDetailsModal {...emptyTransactionsProps} />);

        // Check that the transaction history is shown as empty
        expect(screen.getByText('0 budgets.transaction-total')).toBeInTheDocument();
        const transactionRows = screen.getAllByRole('row');
        expect(transactionRows).toHaveLength(1); // Only header row should be present
    });
});
