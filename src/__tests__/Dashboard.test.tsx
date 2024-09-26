import React from 'react';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import Dashboard from "../pages/Dashboard/Dashboard";
//import { useAuthentication } from '../contexts/AuthenticationContext';
import { Provider } from 'react-redux';
import { store } from '../util/redux/store';


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
jest.mock('../api/config', () => ({
  config: {
      apiUrl: "http://localhost:mock",
  },
}));

// Mock authentication context
jest.mock('../contexts/AuthenticationContext', () => {
  return {
      useAuthentication: () => ({
          profile: { firstName: 'John' }
      })
  };
});

// Mock getAccountByID function
jest.mock('../pages/Tax/taxesAPI', () => ({
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
      const button = screen.getByRole('button', { name: /dashboard.add-account/i })
      expect(button).not.toBeDisabled();
  });
/*
  it('renders the add account button', () => {
    const button1 = screen.getByRole('button', { name: /dashboard.view-budgets/i })
    expect(button1).not.toBeDisabled();
});
*/


});