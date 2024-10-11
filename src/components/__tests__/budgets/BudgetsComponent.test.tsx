import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BudgetsComponent from '../../budgets/BudgetsComponent';
import { updateBudgets, updateSelectedDate } from '../../../utils/redux/budgetSlice';
import '@testing-library/jest-dom';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock("../../../api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

const mockStore = configureStore([]);

// Helper function to get month and year strings
const getMonthYearStrings = (date: Date) => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const monthString = monthNames[month];
    const monthYear = `${year}-${String(month + 1).padStart(2, '0')}`;
    return { monthString, monthYear, year, monthNames };
};

// Get current month/year strings
const currentDate = new Date();
const { monthString: currentMonthString, monthYear: currentMonthYear, year: currentYear, monthNames } = getMonthYearStrings(currentDate);

const store = mockStore({
    simpleFormStatus: { isSending: false },
    budgets: {
        monthYear: currentMonthYear,
        selectedMonthString: currentMonthString,
        selectedYear: currentYear,
        budgets: [],
        months: monthNames,
    },
});

// Mock budget requests
jest.mock('../../../api/requests/budgetRequests', () => ({
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
jest.mock('../../../utils/transactionsCalculator', () => ({
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
        expect(screen.getByText(new RegExp(`${currentMonthString} ${currentYear} Budget`, 'i'))).toBeInTheDocument();
    });

    it('dispatches updateSelectedDate when previous month button is clicked', () => {
        const previousDate = new Date(currentDate);
        previousDate.setMonth(currentDate.getUTCMonth() - 1);
        const { monthString: previousMonthString, year: previousYear } = getMonthYearStrings(previousDate);

        fireEvent.click(screen.getByText(new RegExp(`${previousMonthString} ${previousYear}`, 'i')));
        const actions = store.getActions();
        expect(actions).toContainEqual(updateSelectedDate({ selectedMonth: previousDate.getUTCMonth(), selectedYear: previousYear }));

    });

    it('dispatches updateSelectedDate when next month button is clicked', () => {
        const nextDate = new Date(currentDate);
        nextDate.setMonth(currentDate.getUTCMonth() + 1);
        const { monthString: nextMonthString, year: nextYear } = getMonthYearStrings(nextDate);

        fireEvent.click(screen.getByText(new RegExp(`${nextMonthString} ${nextYear}`, 'i')));
        const actions = store.getActions();
        expect(actions).toContainEqual(updateSelectedDate({ selectedMonth: nextDate.getUTCMonth(), selectedYear: nextYear }));
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