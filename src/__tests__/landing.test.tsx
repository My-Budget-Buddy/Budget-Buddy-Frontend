import React from 'react';
import LandingPage from '../pages/Landing/LandingPage';
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

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