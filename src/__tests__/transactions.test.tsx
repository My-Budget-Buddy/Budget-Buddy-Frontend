import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Transactions from '../pages/Transactions/Transactions';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));


describe('Transactions component', () => {
    test('renders without crashing', () => {
        render(
            <Router>
                <Transactions />
            </Router>
        );
        // Add any assertions you want here. For example, you can check if a certain text appears on the screen:
        expect(screen.getByText('transactions.title')).toBeInTheDocument();
    });
});