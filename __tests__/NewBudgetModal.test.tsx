import React, { ReactNode } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAppDispatch, useAppSelector } from '../src/util/redux/hooks';
import { TransactionCategory } from '../src/types/models';
import NewCategoryModal from '../src/pages/Budgets/components/modals/NewBudgetModal';
import { createBudget } from '../src/pages/Budgets/components/requests/budgetRequests';

// Mock dependencies
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('../src/util/redux/hooks', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn(),
}));

jest.mock('../src/pages/Budgets/components/requests/budgetRequests', () => ({
    createBudget: jest.fn(),
}));

jest.mock('../src/util/redux/simpleSubmissionSlice', () => ({
    setIsSending: jest.fn(),
}));

jest.mock('focus-trap-react', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const React = require('react');
    return ({ children }: { children: ReactNode }) => <div>{children}</div>;
});

describe('NewCategoryModal Component', () => {
    const dispatchMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
        (useAppSelector as unknown as jest.Mock).mockImplementation((selectorFn) => {
            // Mocking the return value for budgetsStore
            if (selectorFn.toString().includes('budgets')) {
                return {
                    monthYear: '2024-09',
                    budgets: [{ category: TransactionCategory.DINING }],
                };
            }
        });
    });

    test('renders modal and form inputs correctly', () => {
        render(<NewCategoryModal />);

        expect(screen.getByLabelText('budgets.category')).toBeInTheDocument();
        expect(screen.getByLabelText('budgets.budgeted')).toBeInTheDocument();
        expect(screen.getByLabelText('budgets.reserve-from-funds')).toBeInTheDocument();
    });

    test('handles resetting the form upon reopening the modal', () => {
        render(<NewCategoryModal />);

        const openModal = document.getElementById('Add-New-Budget') as HTMLButtonElement;

        fireEvent.click(openModal);

        const totalAmountInput = screen.getByLabelText('budgets.budgeted');
        // there is a dangling colon in the label text
        const categorySelect = screen.getByLabelText('budgets.category');
        const notes = document.getElementById('notes') as HTMLSelectElement;
        fireEvent.change(notes, { target: { value: 'Notes for a new budget' } });

        fireEvent.change(categorySelect, { target: { value: TransactionCategory.SHOPPING } });
        fireEvent.change(totalAmountInput, { target: { value: 500 } });

        const closeModal = screen.getByText('budgets.buttons.go-back');

        fireEvent.click(closeModal);

        fireEvent.click(openModal);

        expect(totalAmountInput).toHaveValue(0);
        expect(categorySelect).toHaveValue("default");
        expect(notes).toHaveValue("");
    });

    test('handles form input changes', () => {
        render(<NewCategoryModal />);

        const categorySelect = screen.getByLabelText('budgets.category');
        const totalAmountInput = screen.getByLabelText('budgets.budgeted');
        // there is a dangling colon in the label text
        const notesTextarea = screen.getByLabelText('budgets.notes:');
        const reserveCheckbox = screen.getByLabelText('budgets.reserve-from-funds');

        fireEvent.change(categorySelect, { target: { value: TransactionCategory.SHOPPING } });
        fireEvent.change(totalAmountInput, { target: { value: 500 } });
        fireEvent.change(notesTextarea, { target: { value: 'Budget notes' } });
        fireEvent.click(reserveCheckbox);

        expect(categorySelect).toHaveValue(TransactionCategory.SHOPPING);
        expect(totalAmountInput).toHaveValue(500);
        expect(notesTextarea).toHaveValue('Budget notes');
        expect(reserveCheckbox).toBeChecked();
    });

    test('displays validation errors for missing or incorrect inputs', () => {
        render(<NewCategoryModal />);

        const submitButton = screen.getByText('budgets.buttons.submit');

        // Total amount error
        fireEvent.change(screen.getByLabelText('budgets.budgeted'), { target: { value: -10 } });
        fireEvent.click(submitButton);

        expect(screen.getByText('budgets.greater-than-0')).toBeInTheDocument();

        // Category not selected error
        fireEvent.change(screen.getByLabelText('budgets.budgeted'), { target: { value: 100 } });
        fireEvent.change(screen.getByLabelText('budgets.category'), { target: { value: 'default' } });
        fireEvent.click(submitButton);

    });

    test('handles form submission successfully', async () => {
        // Mock the resolved promise for createBudget
        (createBudget as jest.Mock).mockResolvedValue({});

        render(<NewCategoryModal />);

        // Find and interact with the category select dropdown
        const categorySelect = screen.getByLabelText('budgets.category');

        fireEvent.change(categorySelect, { target: { value: TransactionCategory.SHOPPING } });

        const totalAmount = document.getElementById('totalAmount') as HTMLSelectElement;
        // Fill in other form fields
        fireEvent.change(totalAmount, { target: { value: 500 } });
        const notes = document.getElementById('notes') as HTMLSelectElement;
        fireEvent.change(notes, { target: { value: 'Notes for a new budget' } });

        expect(categorySelect).toHaveValue(TransactionCategory.SHOPPING);
        expect(totalAmount).toHaveValue(500);
        expect(notes).toHaveValue('Notes for a new budget');

        const submitButton = screen.getByText('budgets.buttons.submit');

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(createBudget).toHaveBeenCalledWith({
                userId: 1,
                category: TransactionCategory.SHOPPING,
                totalAmount: "500",
                isReserved: false,
                notes: 'Notes for a new budget',
                monthYear: '2024-09', // Adjust according to your mocked state
            });
        });
    });

    test('handles submission errors successfully', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        // Mock the resolved promise for createBudget
        (createBudget as jest.Mock).mockRejectedValue(new Error());

        render(<NewCategoryModal />);

        const categorySelect = screen.getByLabelText('budgets.category');

        fireEvent.change(categorySelect, { target: { value: TransactionCategory.SHOPPING } });

        const totalAmount = document.getElementById('totalAmount') as HTMLSelectElement;
        fireEvent.change(totalAmount, { target: { value: 500 } });

        const submitButton = screen.getByText('budgets.buttons.submit');

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('ERROR!');
        });

        consoleErrorSpy.mockRestore();
    });
});
