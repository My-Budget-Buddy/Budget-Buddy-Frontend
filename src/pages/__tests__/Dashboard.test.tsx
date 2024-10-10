import React from 'react';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import Dashboard from "../Dashboard";
//import { useAuthentication } from '../contexts/AuthenticationContext';
import { Provider } from 'react-redux';
import { store } from '../../utils/redux/store';
import { getAccountByID } from '../../api/taxesAPI';


// Mock @mui/x-charts components
jest.mock('@mui/x-charts', () => ({
  LineChart: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  Gauge: jest.fn().mockImplementation(({ id, width, height, value, valueMax, startAngle, endAngle, innerRadius, outerRadius, sx, text }) => (
    <div id={id} style={{ width, height }}>
      <div className="gauge-value">{value}</div>
      <div className="gauge-value-max">{valueMax}</div>
      <div className="gauge-text">{text({ value, valueMax })}</div>
    </div>
  )),
  gaugeClasses: {
    valueArc: 'mock-value-arc-class'
  }
}));



// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock API endpoint
jest.mock('../../api/config', () => ({
  config: {
    apiUrl: "http://localhost:mock",
  },
}));

// Mock authentication context
jest.mock('../../contexts/AuthenticationContext', () => {
  return {
    useAuthentication: () => ({
      profile: { firstName: 'John' }
    })
  };
});

// Mock getAccountByID function
jest.mock('../../api/taxesAPI', () => ({
  getAccountByID: jest.fn().mockResolvedValue({
    data: [
      {
        id: 1,
        type: 'checking',
        userId: 1,
        accountNumber: 123456,
        routingNumber: 654321,
        institution: 'Bank A',
        investmentRate: 0,
        startingBalance: 1000,
        currentBalance: 1500
      },
      {
        id: 2,
        type: 'savings',
        userId: 1,
        accountNumber: 789012,
        routingNumber: 210987,
        institution: 'Bank B',
        investmentRate: 0.5,
        startingBalance: 2000,
        currentBalance: 2500
      },
      {
        id: 3,
        type: 'investment',
        userId: 1,
        accountNumber: 345678,
        routingNumber: 876543,
        institution: 'Bank C',
        investmentRate: 1.5,
        startingBalance: 5000,
        currentBalance: 6000
      },
      {
        id: 4,
        type: 'credit',
        userId: 1,
        accountNumber: 901234,
        routingNumber: 432109,
        institution: 'Bank D',
        investmentRate: 0,
        startingBalance: 3000,
        currentBalance: 2000
      }
    ]
  })
}));

describe('Dashboard', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <Router>
          <Dashboard />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Dashboard page', () => {
    expect(document.getElementsByClassName('usa-logo__text')[0]).toBeInTheDocument();
  });

  it('renders the add account button', () => {
    const buttonAccount = screen.getByRole('button', { name: /dashboard.add-account/i })
    expect(buttonAccount).not.toBeDisabled();
    fireEvent.click(buttonAccount);
  });

  it('renders the view budget button', () => {
    const buttonBudget = screen.getByRole('button', { name: /dashboard.view-budgets/i })
    expect(buttonBudget).not.toBeDisabled();
    fireEvent.click(buttonBudget);
  });

  it('renders the view add transaction button', () => {
    const buttonAddTransaction = screen.getByRole('button', { name: /dashboard.add-transaction/i })
    expect(buttonAddTransaction).not.toBeDisabled();
    fireEvent.click(buttonAddTransaction);
  });

  it('renders the link for add account', () => {
    const link = screen.getByRole('link', { name: 'dashboard.add-account' });
    expect(link).toBeInTheDocument();
    fireEvent.click(link);
  });

  it('renders the link for view budgets', () => {
    const link = screen.getByRole('link', { name: 'dashboard.view-budgets' });
    expect(link).toBeInTheDocument();
    fireEvent.click(link);
  });

  it('renders the link for add transaction', () => {
    const link = screen.getByRole('link', { name: 'dashboard.add-transaction' });
    expect(link).toBeInTheDocument();
    fireEvent.click(link);
  });

  it('makes a call to getAccountByID', () => {
    const Account = getAccountByID();
    expect(Account).not.toBeNull();

  });

  it('render and verify accounts title', () => {
    const title = screen.getByText('accounts.title');
    expect(title).toBeInTheDocument();

  });

  it('render and verify recent-transactions title', () => {
    const title = screen.getByText('dashboard.recent-transactions');
    expect(title).toBeInTheDocument();

  });

  it('render and verify budgets.title title', () => {
    const title = screen.getByText('budgets.title');
    expect(title).toBeInTheDocument();
  });


  it('renders the chart container', () => {
    const chart = document.getElementById("chart-container");
    expect(chart).not.toBeNull();

  });

  it('renders the different account types', async () => {
    await waitFor(() => {
      expect(screen.getByText(/checking/i)).toBeInTheDocument();
      expect(screen.getByText(/savings/i)).toBeInTheDocument();
      expect(screen.getByText(/investment/i)).toBeInTheDocument();
      expect(screen.getByText(/credit/i)).toBeInTheDocument();

    });
  });

  it('renders the recent transactions', async () => {
    expect(screen.getByText('dashboard.recent-transactions')).toBeInTheDocument();
  });


});