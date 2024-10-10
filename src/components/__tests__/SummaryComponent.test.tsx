import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import SummaryComponent from '../SummaryComponent';
import { store } from '../../utils/redux/store';
import { useTranslation } from 'react-i18next';
import { MockStore } from 'redux-mock-store';

// --- MOCKS ---

// Mock Translation
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock Gauge
jest.mock("@mui/x-charts/Gauge", () => {
    const gaugeClasses = {
        valueText: 'valueText',
        valueArc: 'valueArc'
    };
    return {
        Gauge: jest.fn().mockImplementation(({ children, ...props }) => (
            <div>
                <div>{JSON.stringify(props)}</div>
                <div>{children}</div>
            </div>
        )),
        gaugeClasses
    };
});

// Mock app selector and dispatch
jest.mock('../../utils/redux/hooks', () => ({
    useAppSelector: jest.fn().mockImplementation((selector) => selector({
        budgets: {
            spendingBudget: 1000,
            totalReserved: 200,
            totalActuallySpent: 300,
            selectedMonthString: 'January',
            selectedYear: 2023,
            monthYear: '2023-01',
        },
        buckets: {
            totalReserved: 200,
        },
        simpleFormStatus: {
            isSending: false,
        },
    })),
    useDispatch: () => jest.fn(),
}));

// Mock currency formatting
jest.mock('../../utils/helpers', () => ({
    formatCurrency: (value: number) => `$${Number(value).toFixed(2)}`,
}));

// Mock summary requests
jest.mock('../../api/requests/summaryRequests', () => ({
    getMonthlySummary: jest.fn().mockResolvedValue({
        summaryId: 1,
        totalBudgetAmount: 1000,
    }),
    createMonthlySummary: jest.fn().mockResolvedValue({
        summaryId: 1,
        totalBudgetAmount: 1000,
    }),
}));

// Mock bucket requests
jest.mock('../../api/requests/bucketRequests', () => ({
    getBuckets: jest.fn().mockResolvedValue([]),
}));

// Mock budget requests
jest.mock('../../api/requests/budgetRequests', () => ({
    getBudgetsByMonthYear: jest.fn().mockResolvedValue([]),
}));

// Mock transactions calculator
jest.mock('../../utils/transactionsCalculator', () => ({
    getCompleteBudgets: jest.fn().mockResolvedValue([]),
}));

// Mock account requests
jest.mock('../../api/requests/accountRequests', () => ({
    getTotalAvailableFunds: jest.fn().mockResolvedValue(1000),
}));

// Mock implementation of EditSpendingBudgetModal
const MockEditSpendingBudgetModal = ({ summaryId, totalBudgetAmount }: { summaryId: number; totalBudgetAmount: number }) => {
    return (
        <div>
            <p>Summary ID: {summaryId}</p>
            <p>Total Budget Amount: {totalBudgetAmount}</p>
        </div>
    );
};


// Use Jest to mock the EditSpendingBudgetModal component
jest.mock('../modals/EditSpendingBudgetModal', () => {
    return {
        __esModule: true,
        default: (props: any) => <MockEditSpendingBudgetModal  {...props} />,
    };
});

describe('SummaryComponent', () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
                <Router>
                    <SummaryComponent />
                </Router>
            </Provider>
        );
    });

    it('renders total funds available', () => {
        expect(screen.getByText('budgets.total-funds')).toBeInTheDocument();
        expect(screen.getByText('$500.00')).toBeInTheDocument(); // 1000 - 200
    });

    it('renders left to spend', () => {
        expect(screen.getByText('budgets.left-to-spend January 2023')).toBeInTheDocument();
        expect(screen.getByText('$500.00')).toBeInTheDocument(); // 1000 - 200 - 300
    });

    it('renders spending budget', () => {
        expect(screen.getByText('budgets.spending-budget', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('$1000.00')).toBeInTheDocument();
    });

    it('renders allocated budget', () => {
        expect(screen.getByText('budgets.allocated')).toBeInTheDocument();
        expect(screen.getByText('$200.00')).toBeInTheDocument();
    });

    it('renders remaining budget', () => {
        expect(screen.getByText('budgets.remaining')).toBeInTheDocument();
        expect(screen.getByText('$500.00')).toBeInTheDocument(); // 1000 - 200 - 300
    });
});