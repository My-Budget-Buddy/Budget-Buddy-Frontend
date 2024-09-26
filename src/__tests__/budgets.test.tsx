import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Budgets from '../pages/Budgets/Budgets';

// Mock the components
jest.mock('../pages/Budgets/components/BudgetsComponent.tsx', () => () => <div>Mocked BudgetsComponent</div>);
jest.mock('../pages/Budgets/components/SummaryComponent.tsx', () => () => <div>Mocked SummaryComponent</div>);
jest.mock('../pages/Budgets/components/SavingsBucketsComponent', () => () => <div>Mocked SavingsBucketComponent</div>);

beforeEach(() => {
    render(<Budgets />);
});

describe('Budgets Component', () => {
    it('renders mocked components', () => {

        // Check for the presence of the mocked text
        expect(screen.getByText('Mocked BudgetsComponent')).toBeInTheDocument();
        expect(screen.getByText('Mocked SummaryComponent')).toBeInTheDocument();
        expect(screen.getByText('Mocked SavingsBucketComponent')).toBeInTheDocument();
    });
});