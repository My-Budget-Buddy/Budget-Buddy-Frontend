import React from 'react';
import Budgets from "../pages/Budgets/Budgets";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { URL_getAllBucketsByUserId, URL_findAllBudgets } from "../api/services/BudgetService";

// Mock fetch function
global.fetch = jest.fn((url) => {
    if (url === URL_getAllBucketsByUserId) {
        return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ totalReserved: 500 })
        } as Response);
    }
    if (url === URL_findAllBudgets) {
        return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([
                { id: 1, category: "Housing", totalAmount: 1000 },
                { id: 2, category: "Food", totalAmount: 2000 }
            ])
        } as Response);
    }
    return Promise.reject(new Error('Invalid URL'));
});

jest.mock("../api/config", () => ({
    config: {
        apiUrl: "http://localhost:8125",
    },
}));

jest.mock("@mui/x-charts", () => ({
    AxisConfig: jest.fn().mockImplementation(({ children }) => children),
}));

jest.mock("@mui/x-charts/Gauge", () => {
    const gaugeClasses = {
        valueText: 'valueText',
        valueArc: 'valueArc'
    };
    return {
        Gauge: jest.fn().mockImplementation(({ children, ...props }) => (
            <div {...props}>{children}</div>
        )),
        gaugeClasses
    };
});

const mockStore = configureStore([]);
let store;

beforeEach(() => {
    store = mockStore({
        budgets: {
            budgets: [
                { id: 1, category: "Housing", totalAmount: 1000 },
                { id: 2, category: "Food", totalAmount: 2000 }
            ],
            totalFundsAvailable: 3000,
            spendingBudget: 2500,
            totalReserved: 500,
            totalActuallySpent: 2000,
            months: ["January", "February", "March"],
            selectedMonth: 1,
            selectedMonthString: "January",
            selectedYear: 2023,
            monthYear: "January 2023"
        },
        buckets: {
            totalReserved: 500
        },
        simpleFormStatus: { isSending: false },
    });

    render(
        <Provider store={store}>
            <Router>
                <Budgets />
            </Router>
        </Provider>
    );
});

afterEach(() => {
    jest.clearAllMocks();
});

it('renders without crashing', () => {
    expect(screen.getByText('Total Available Funds Across Account')).toBeInTheDocument();
});