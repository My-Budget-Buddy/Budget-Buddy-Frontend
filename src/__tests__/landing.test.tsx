import React from 'react';
import LandingPage from '../pages/Landing/LandingPage';
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';


jest.mock("../api/config", () => ({
    config: {
      apiUrl: "http://localhost:mock",
    },
}));

//Image mocks
jest.mock('../../assets/budgets/Mar-Business_11.jpg', () => 'budgetImg');
jest.mock('../../assets/taxes/Wavy_Tech-03_Single-12.jpg', () => 'taxImg');
jest.mock('../../assets/transactions/20943914.jpg', () => 'transactionsImg');
jest.mock('../../assets/hero.jpg', () => 'heroBg');

// Style mocks
jest.mock('./LandingPage.css', () => ({}));

beforeEach(() => {
    render(
        <Router>
        <LandingPage />
        </Router>
    );
});
  
afterEach(() => {
    jest.clearAllMocks();
});

it('renders without crashing', () => {
    expect(screen.getByText('Your Personal Finance Assistant')).toBeInTheDocument();
}); 