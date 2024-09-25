import React from 'react';
import TransactionHistory from "../pages/Transactions/TransactionHistory";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock the useTranslation hook - thanks for the example, Anthony!
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock("../api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

// Render the page w/ the router
beforeEach(() => {
    render(
        <Router>
            <TransactionHistory />
        </Router>
    );
});

// Clean up mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

// Render the page without crashing
it('renders without crashing', () => {
    expect(screen.getByText('transactionhistory.title')).toBeInTheDocument();
});

// TODO FIX ERROR WITH COMPONENT @mui/x-charts