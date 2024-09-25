import React from 'react';
import LandingPage from '../pages/Landing/LandingPage';
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import exp from 'constants';


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
jest.mock('../pages/Landing/ReviewSection.tsx', () => () => <div>Mocked Review Section</div>);

// Style mocks
jest.mock('./LandingPage.css', () => ({}));


describe('LandingPage', () => {
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
  
      const featureImages = ['budgetImg', 'transactionsImg', 'taxImg'];
      featureImages.forEach(image => {
        const imgElements = screen.getAllByAltText(/image/i);
        expect(imgElements.some(img => img.getAttribute('src') === image)).toBe(true);
      });
    });
  
    it('renders the ReviewSection component', () => {
      expect(screen.getByText('Mocked Review Section')).toBeInTheDocument();
    });
  });