import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputSavingsBucketRow from '../../budgets/InputSavingsBucketRow';

describe('InputSavingsBucketRow', () => {
    it('should render the name of the bucket', () => {
        const mockData = { name: "Test Bucket", amount_required: 100, amount_reserved: 0, is_currently_reserved: false }; 

        render(<InputSavingsBucketRow data={mockData} />);

        expect(screen.getByText("Test Bucket")).toBeInTheDocument();
    });
});