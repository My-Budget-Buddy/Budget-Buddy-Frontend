import React from 'react';
import SpendingMonth from '../../Spending/SpendingMonth';
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock("../../../api/config", () => ({
  config: {
    apiUrl: "http://localhost:mock",
  },
}));

// mocks react-i18next 
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</>,
}));

// mocks x-charts
jest.mock("@mui/x-charts", () => ({
  AxisConfig: jest.fn().mockImplementation(({ children }) => children),
  legendClasses: jest.fn().mockImplementation(({ children }) => children),
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

jest.mock("@mui/x-charts/BarChart", () => ({
  BarChart: jest.fn().mockImplementation(({ children }) => children)
}));

// mocks transactionService function
jest.mock("../../../api/transactionService", () => ({
  getTransactionByUserId: jest.fn()
}));

// Mock CategoryIcon
jest.mock('../../../components/CategoryIcon', () => ({
  __esModule: true,
  default: ({ category }: { category: string }) => <div data-testid="mock-category-icon">{category}</div>,
  categoryColors: {},
}));

jest.mock("../../../api/transactionService", () => ({
  getTransactionByUserId: jest.fn().mockResolvedValue([
    {
      accountId: 1,
      amount: 59.99,
      category: "Shopping",
      date: "2023-01-11",
      description: "Purchase of electronics",
      transactionId: 1,
      userId: 1,
      vendorName: "Amazon"
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
      accountId: 1,
      amount: 499.99,
      category: "Shopping",
      date: "2024-01-24",
      description: "Laptop purchase",
      transactionId: 10,
      userId: 1,
      vendorName: "Best Buy"
    }
  ])
}));

const mockSpendingCategories = [
  { displayName: 'Groceries', name: 'GROCERIES', value: 320, color: '#B0C4DE' },
  { displayName: 'Shopping', name: 'SHOPPING', value: 559.98, color: '#AFEEEE' },
];

beforeEach(() => {
  render(
    <MemoryRouter initialEntries={['/dashboard/spending/january']}>
      <Routes>
        <Route path="/dashboard/spending/:month" element={<SpendingMonth />} />
      </Routes>
    </MemoryRouter>
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

it('renders without crashing', async () => {
  await waitFor(() => {
    expect(document.getElementById('spending-month-title')).toBeInTheDocument();
  });
});

it('renders back to spending button correctly', async () => {
  await waitFor(() => {
    expect(screen.getByText('spending.backToAnnualSpendingOverview')).toBeInTheDocument();
  });
});

it('renders month select correctly', async () => {
  await waitFor(() => {
    expect(document.getElementById('month-select')).toBeInTheDocument();
  });
});

it('renders spending month bar chart correctly', async () => {
  await waitFor(() => {
    expect(document.getElementById('spending-month-bar-chart')).toBeInTheDocument();
  });
});

it('renders spending month pie chart correctly', async () => {

  await waitFor(() => {
    expect(document.getElementById('spending-month-pie-chart')).toBeInTheDocument();
  });
});

it('renders no data message and button when spendingCategories.length === 0', async () => {
  await waitFor(() => {
    expect(screen.getByText('spending.no-data')).toBeInTheDocument();
    expect(screen.getByText('transactions.add-transaction')).toBeInTheDocument();
  });
});