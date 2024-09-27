import React from 'react';
import Spending from "../src/pages/Spending/Spending";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { current } from '@reduxjs/toolkit';

jest.mock("@mui/x-charts", () => ({
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
    root: 'mock-root-class'
  }
}));

jest.mock("@mui/x-charts/LineChart", () => ({
  LineChart: jest.fn().mockImplementation(({ children }) => children),
}));

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("../src/api/config", () => ({
  config: {
    apiUrl: "http://localhost:mock",
  },
}));

jest.mock("../src/utils/transactionService", () => ({
  getTransactionByUserId: jest.fn().mockResolvedValue([
    {
      accountId: 1,
      amount: 59.99,
      category: "Shopping",
      date: "2021-05-01",
      description: "Purchase of electronics",
      transactionId: 1,
      userId: 1,
      vendorName: "Amazon"
    },
    {
      accountId: 2,
      amount: 4.75,
      category: "Dining",
      date: "2024-01-16",
      description: "Coffee and snacks",
      transactionId: 2,
      userId: 1,
      vendorName: "Starbucks"
    },
    {
      accountId: 1,
      amount: 120,
      category: "Groceries",
      date: "2024-01-17",
      description: "Grocery shopping",
      transactionId: 3,
      userId: 1,
      vendorName: "Walmart"
    },
    {
      accountId: 3,
      amount: 999.99,
      category: "Shopping",
      date: "2024-01-18",
      description: "New iPhone purchase",
      transactionId: 4,
      userId: 1,
      vendorName: "Apple Store"
    },
    {
      accountId: 3,
      amount: 15.99,
      category: "Entertainment",
      date: "2024-01-19",
      description: "Monthly subscription",
      transactionId: 5,
      userId: 1,
      vendorName: "Netflix"
    },
    {
      accountId: 3,
      amount: 45.5,
      category: "Transportation",
      date: "2024-01-20",
      description: "Gas for car",
      transactionId: 6,
      userId: 1,
      vendorName: "Shell"
    },
    {
      accountId: 1,
      amount: 200,
      category: "Groceries",
      date: "2024-01-21",
      description: "Bulk shopping",
      transactionId: 7,
      userId: 1,
      vendorName: "Costco"
    },
    {
      accountId: 2,
      amount: 25,
      category: "Transportation",
      date: "2024-01-22",
      description: "Ride to airport",
      transactionId: 8,
      userId: 1,
      vendorName: "Uber"
    },
    {
      accountId: 3,
      amount: 9.99,
      category: "Entertainment",
      date: "2024-01-23",
      description: "Monthly subscription",
      transactionId: 9,
      userId: 1,
      vendorName: "Spotify"
    },
    {
      accountId: 1,
      amount: 499.99,
      category: "Shopping",
      date: "2024-09-24",
      description: "Laptop purchase",
      transactionId: 10,
      userId: 1,
      vendorName: "Best Buy"
    },
    {
      accountId: 2,
      amount: 2010.45,
      category: "Income",
      date: "2024-01-10",
      description: "Paycheck",
      transactionId: 11,
      userId: 1,
      vendorName: "Skillstorm"
    },
    {
      accountId: 2,
      amount: 2010.45,
      category: "Income",
      date: "2024-09-25",
      description: "Paycheck",
      transactionId: 12,
      userId: 1,
      vendorName: "Skillstorm"
    },
    {
      accountId: 2,
      amount: 2010.45,
      category: "Income",
      date: "2024-09-20",
      description: "Paycheck",
      transactionId: 13,
      userId: 1,
      vendorName: "Skillstorm"
    },
    {
      accountId: 2,
      amount: 199.99,
      category: "Shopping",
      date: "2024-09-20",
      description: "Electronic accessories",
      transactionId: 14,
      userId: 1,
      vendorName: "Best Buy"
    },
    {
      accountId: 2,
      amount: 20999.99,
      category: "Shopping",
      date: "2024-09-20",
      description: "Electronic accessories",
      transactionId: 15,
      userId: 1,
      vendorName: "Best Buy"
    }

  ]),
}));

beforeEach(() => {
  render(
    <MemoryRouter>
      <Spending />
    </MemoryRouter>
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

it('renders without crashing', () => {
  expect(screen.getByText('spending.title')).toBeInTheDocument();
});

it('renders the spending cards correctly', async () => {

  // Wait for the data to load and check if the cards are rendered
  await waitFor(() => {
    expect(screen.getByText('spending.spentThisWeek')).toBeInTheDocument();
    expect(screen.getByText('spending.depositedThisWeek')).toBeInTheDocument();
    expect(screen.getByText('spending.totalSpent')).toBeInTheDocument();
  });

  // check if prices populate with correct values
  expect(screen.getByTestId('price-0')).toHaveTextContent('$499.99');
  expect(screen.getByTestId('price-1')).toHaveTextContent('$2,010.45');
  expect(screen.getByTestId('price-2')).toHaveTextContent('23,121.19');

  // check if cards populate with correct details
  expect(screen.getByTestId('details-0')).toHaveTextContent('spending.spentThisWeek');
  expect(screen.getByTestId('details-1')).toHaveTextContent('spending.depositedThisWeek');
  expect(screen.getByTestId('details-2')).toHaveTextContent('spending.totalSpent');
});

it('renders the spending line chart correctly', async () => {
  // Wait for the data to load and check if the chart is rendered
  await waitFor(() => {
    expect(screen.getByText('spending.graphTitle')).toBeInTheDocument();
  });
});

it('renders the See Current Month button correctly', async () => {
  // Wait for the data to load and check if the button is rendered
  await waitFor(() => {
    expect(screen.getByText('spending.seeCurrentMonth')).toBeInTheDocument();
  });
});

it('renders the spending pie chart correctly', async () => {
  // Wait for the data to load and check if the chart is rendered
  await waitFor(() => {
    expect(document.getElementById('spending-pie-chart')).toBeInTheDocument();
  });
});