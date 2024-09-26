import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SummaryComponent from '../../pages/Budgets/components/SummaryComponent';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { store } from "../../util/redux/store.ts";

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

jest.mock("../../api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

global.fetch = jest.fn(() => {
    return Promise.resolve({
        json: () => Promise.resolve({}),
        ok: true,
        status: 200,
    } as Response);
});


jest.mock('../../pages/Budgets/components/requests/bucketRequests', () => ({
    getBuckets: jest.fn(),
}));
jest.mock('../../util/redux/bucketSlice', () => ({
    updateBuckets: jest.fn(),
}));
jest.mock('../../pages/Budgets/components/requests/budgetRequests', () => ({
    getBudgetsByMonthYear: jest.fn(),
}));
jest.mock('../../pages/Budgets/components/util/transactionsCalculator', () => ({
    getCompleteBudgets: jest.fn(),
}));
jest.mock('../../util/redux/budgetSlice', () => ({
    updateBudgets: jest.fn(),
}));
jest.mock('../../pages/Budgets/components/requests/accountRequests', () => ({
    getTotalAvailableFunds: jest.fn(),
}));

//const mockStore = configureStore([]);

beforeEach(() => {
    render(
        <Provider store={store}>
            <Router>
                <SummaryComponent />
            </Router>
        </Provider>
    );
});

describe('Budgets Component', () => {
    it('renders budget total funds', () => {
        expect(screen.getByText('budgets.total-funds')).toBeInTheDocument();
    });
});