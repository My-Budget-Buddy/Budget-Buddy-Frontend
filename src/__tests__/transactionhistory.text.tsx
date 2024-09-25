import React from 'react';
import TransactionHistory from "../pages/Transactions/TransactionHistory";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock the useTranslation hook and Trans component
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
    Trans: ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</>,
}));

jest.mock("../api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

// Mock the BarChart component from @mui/x-charts
jest.mock("@mui/x-charts", () => ({
    BarChart: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
    AxisConfig: jest.fn().mockImplementation(({ children }) => children),
    useDrawingArea: jest.fn().mockReturnValue({
        width: 100,
        height: 100,
        left: 0,
        top: 0,
    }),
}));

jest.mock("@mui/x-charts/PieChart", () => ({
    PieChart: jest.fn().mockImplementation(({ children }) => children),
    pieArcLabelClasses: {
        root: 'mock-root-class',
    },
}));

jest.mock("@mui/x-charts/LineChart", () => ({
    LineChart: jest.fn().mockImplementation(({ children }) => children),
}));

// Mock the transactionService functions
jest.mock('../utils/transactionService', () => ({
    getTransactionByVendor: jest.fn().mockResolvedValue([
        {
            transactionId: 1,
            date: "2023-10-01",
            vendorName: 'VendorName',
            category: 'DINING',
            amount: 100.0,
            description: "Test Transaction",
            accountId: 1,
            userId: 1,
        },
    ]),
    getAccountsByUserId: jest.fn().mockResolvedValue([
        {
            id: 1,
            institution: "Test Bank",
            accountNumber: "12345678",
        },
    ]),
    // Mock other functions as needed
}));

// Render the page with the router
beforeEach(() => {
    render(
        <MemoryRouter initialEntries={['/dashboard/transactions/VendorName']}>
            <Routes>
                <Route path="/:first/:second/:name" element={<TransactionHistory />} />
            </Routes>
        </MemoryRouter>
    );
});

// Clean up mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

// Test to ensure the component renders without crashing
it('renders without crashing', () => {
    expect(screen.getByText('transactions.history')).toBeInTheDocument();
});
