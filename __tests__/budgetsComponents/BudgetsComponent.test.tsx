import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BudgetsComponent from '../../src/pages/Budgets/components/BudgetsComponent';
import { updateBudgets, updateSelectedDate } from '../../src/util/redux/budgetSlice';
import '@testing-library/jest-dom';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock("../../src/api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

const mockStore = configureStore([]);
const store = mockStore({
    simpleFormStatus: { isSending: false },
    budgets: {
        monthYear: '2024-9',
        selectedMonthString: 'September',
        selectedYear: 2024,
        budgets: [],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    },
});

// Mock budget requests
jest.mock('../../src/pages/Budgets/components/requests/budgetRequests', () => ({
    getBudgetsByMonthYear: jest.fn().mockResolvedValue([]),
}));

const mockGetTransactions = jest.fn().mockResolvedValue([
    { id: 1, category: 'GROCERIES', amount: 50 },
    { id: 2, category: 'SHOPPING', amount: 100 },
    { id: 3, category: 'GROCERIES', amount: 30 },
]);
// Mock implementation of mapTransactionsToCategories
const mockMapTransactionsToCategories = jest.fn().mockReturnValue({
    GROCERIES: [
        { id: 1, category: 'GROCERIES', amount: 50 },
        { id: 3, category: 'GROCERIES', amount: 30 },
    ],
    SHOPPING: [
        { id: 2, category: 'SHOPPING', amount: 100 },
    ],
});

// Mock transactions calculator
jest.mock('../../src/pages/Budgets/components/util/transactionsCalculator', () => ({
    getCompleteBudgets: jest.fn().mockResolvedValue([]),
    getCategoriesTransactionsMap: jest.fn(async (monthYear: string) => {
        const transactions = await mockGetTransactions(monthYear);
        const mapOfTransactionsByCategory = mockMapTransactionsToCategories(transactions);
        return mapOfTransactionsByCategory;
    }),
}));

describe('BudgetsComponent', () => {
    beforeEach(() => {
        store.clearActions();
        render(
            <Provider store={store}>
                <BudgetsComponent />
            </Provider>
        );
    });

    it('renders without crashing', () => {
        expect(screen.getByText(/September 2024 Budget/i)).toBeInTheDocument();
    });

    it('dispatches updateSelectedDate when previous month button is clicked', () => {
        fireEvent.click(screen.getByText(/August 2024/i));
        const actions = store.getActions();
        expect(actions).toContainEqual(updateSelectedDate({ selectedMonth: 7, selectedYear: 2024 }));
    });

    it('dispatches updateSelectedDate when next month button is clicked', () => {
        fireEvent.click(screen.getByText(/October 2024/i));
        const actions = store.getActions();
        expect(actions).toContainEqual(updateSelectedDate({ selectedMonth: 9, selectedYear: 2024 }));
    });

    test('renders no budgets message when budgets list is empty', () => {
        expect(screen.getByText(/no-budgets/i)).toBeInTheDocument();
    });

    test('sorts budgets when column headers are clicked', () => {
        const budgets = [
            { id: 1, category: 'Food', totalAmount: 200, spentAmount: 150, isReserved: false, notes: '' },
            { id: 2, category: 'Transport', totalAmount: 100, spentAmount: 50, isReserved: false, notes: '' },
        ];
        (store.getState() as any).budgets.budgets = budgets;

        fireEvent.click(screen.getByText('budgets.category', { exact: false, selector: 'th' }));
        let actions = store.getActions();
        expect(actions).toContainEqual(updateBudgets([...budgets].sort((a, b) => b.category.localeCompare(a.category))));

        fireEvent.click(screen.getByText('budgets.budgeted', { exact: false, selector: 'th' }));
        actions = store.getActions();
        expect(actions).toContainEqual(updateBudgets([...budgets].sort((a, b) => a.totalAmount - b.totalAmount)));
    });
});