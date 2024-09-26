import React from 'react';
import Spending from "../pages/Spending/Spending";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import { current } from '@reduxjs/toolkit';

const setCurrentWeekSpending = jest.fn();
const setPreviousWeekSpending = jest.fn();
const setCurrentWeekDeposits = jest.fn();
const setPreviousWeekDeposits = jest.fn();

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

jest.mock("../api/config", () => ({
  config: {
    apiUrl: "http://localhost:mock",
  },
}));