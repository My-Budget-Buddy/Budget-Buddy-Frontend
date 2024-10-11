import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/';
import { useTranslation } from 'react-i18next';
import SavingsBucketComponent from '../../budgets/SavingsBucketsComponent';
import SavingsBucketsTable from '../../budgets/SavingsBucketsTable';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock the SavingsBucketsTable component
jest.mock('../../budgets/SavingsBucketsTable', () => () => <div>Mocked SavingsBucketsTable</div>);

describe('SavingsBucketComponent', () => {
    test('renders the component with translated text', () => {
        const { getByText } = render(<SavingsBucketComponent />);

        // Check if the translated text is rendered
        expect(getByText('budgets.savings-bucket')).toBeInTheDocument();
    });

    test('renders the SavingsBucketsTable component', () => {
        const { getByText } = render(<SavingsBucketComponent />);

        // Check if the SavingsBucketsTable component is rendered
        expect(getByText('Mocked SavingsBucketsTable')).toBeInTheDocument();
    });
});