import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAppDispatch, useAppSelector } from '../src/util/redux/hooks';
import { setIsSending } from '../src/util/redux/simpleSubmissionSlice';
import { putBucket } from '../src/pages/Budgets/components/requests/bucketRequests';
import SavingsBucketRow from '../src/pages/Budgets/components/subComponents/SavingsBucketRow';
import { useTranslation } from "react-i18next";
import '@testing-library/jest-dom';

jest.mock('../src/util/redux/hooks', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn(),
}));

const mockData = {
    id: 1,
    name: 'Test Name',
    amount_required: 100,
    amount_reserved: 50,
    is_currently_reserved: false,
};

describe('SavingsBucketRow', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the SavingsBucketRow component', () => { 
        
        render(<SavingsBucketRow data={mockData}/>);
        
        // await waitFor(() => {
            expect(screen.getByText('Test Name')).toBeInTheDocument();
        // });
    });
});