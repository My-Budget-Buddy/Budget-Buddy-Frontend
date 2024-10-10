import React from 'react';
import LandingPage from '../../Landing/Landing';
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import exp from 'constants';


jest.mock("../../../api/config", () => ({
  config: {
    apiUrl: "http://localhost:mock",
  },
}));

//Image mocks
jest.setMock('../../../../public/images/budgeting-illustration.jpg', () => 'budgetImg');
jest.setMock('../../../../public/images/tax-illustration.jpg', () => 'taxImg');
jest.setMock('../../../../public/images/spending-illustration.jpg', () => 'transactionsImg');
jest.mock('../../../../public/images/hero.jpg', () => 'heroBg');

jest.mock('../../../components/landing/ReviewSection/ReviewSection.tsx', () => () => <div>Mocked Review Section</div>);

// Style mocks
jest.mock('../../Landing/Landing.css', () => ({}));


describe('Landing', () => {
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

  it('renders the background image', () => {
    const heroImage = screen.getByAltText('Hero');
    expect(heroImage).toHaveAttribute('src', 'heroBg');
  });

  it('renders the correct text and button', () => {
    expect(screen.getByText("BudgetBuddy:")).toBeInTheDocument();
    expect(screen.getByText("Your Personal Finance Assistant")).toBeInTheDocument();
    expect(screen.getByText('BudgetBuddy helps you track spending, manage budgets, and achieve financial goals with ease. Make every dollar count with BudgetBuddy.')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('renders the features section with correct content', () => {
    const featureTitles = ['Budgeting', 'Stay On Top Of Your Spending', 'Tax Filing'];
    featureTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    const featureDescriptions = [
      'Effective Budget Management:',
      'Spending Limits:',
      'Progress Tracking:',
      'Comprehensive Insights:',
      'User-Friendly Interface:',
      'Detailed Monitoring:',
      'Insightful Visualization:',
      'Vendor Tracking:',
      'Spending Categories:',
      'Seamless Tax Filing:',
      'Income Documentation:',
      'Accurate Calculations:',
      'Compliance and Accuracy:'
    ];
    featureDescriptions.forEach(description => {
      const elements = screen.getAllByText(description);
      expect(elements.length).toBeGreaterThan(0);
    });

    //   const featureImages = ['budgetImg', 'transactionsImg', 'taxImg'];
    featureTitles.forEach(title => {
      const imgElements = screen.getAllByRole('img');

      expect(imgElements.some(img => img.getAttribute('Alt') === title)).toBe(true);
    });
  });

  it('renders the ReviewSection component', () => {
    expect(screen.getByText('Mocked Review Section')).toBeInTheDocument();
  });
});


