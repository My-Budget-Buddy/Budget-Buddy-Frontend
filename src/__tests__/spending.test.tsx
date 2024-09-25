import React from 'react';
import Spending from "../pages/Spending/Spending";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock("@mui/x-charts", () => ({
  AxisConfig: jest.fn().mockImplementation(({ children }) => children),
}));

jest.mock("@mui/x-charts/PieChart", () => ({
  PieChart: jest.fn().mockImplementation(({ children }) => children),
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

jest.mock("../api/config", () => ({
  config: {
    apiUrl: "http://localhost:mock",
  },
}));

beforeEach(() => {
  render(
    <Router>
      <Spending />
    </Router>
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

it('renders without crashing', () => {
  expect(screen.getByText('spending.title')).toBeInTheDocument();
}); 