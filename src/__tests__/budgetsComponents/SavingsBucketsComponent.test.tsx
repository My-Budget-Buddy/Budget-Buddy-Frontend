import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/';
import { useTranslation } from 'react-i18next';
import SavingsBucketComponent from '../../pages/Budgets/components/SavingsBucketsComponent';
import SavingsBucketTable from '../../pages/Budgets/components/subComponents/SavingsBucketsTable';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock the SavingsBucketTable component
jest.mock('../../pages/Budgets/components/subComponents/SavingsBucketsTable', () => () => <div>Mocked SavingsBucketTable</div>);

describe('SavingsBucketComponent', () => {
    test('renders the component with translated text', () => {
        const { getByText } = render(<SavingsBucketComponent />);

        // Check if the translated text is rendered
        expect(getByText('budgets.savings-bucket')).toBeInTheDocument();
    });

    test('renders the SavingsBucketTable component', () => {
        const { getByText } = render(<SavingsBucketComponent />);

        // Check if the SavingsBucketTable component is rendered
        expect(getByText('Mocked SavingsBucketTable')).toBeInTheDocument();
    });
});