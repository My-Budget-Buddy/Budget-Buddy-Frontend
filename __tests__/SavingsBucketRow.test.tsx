import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAppDispatch, useAppSelector } from '../src/util/redux/hooks';
import { setIsSending } from '../src/util/redux/simpleSubmissionSlice';
import { putBucket } from '../src/pages/Budgets/components/requests/bucketRequests';
import SavingsBucketRow from '../src/pages/Budgets/components/subComponents/SavingsBucketRow';
import { useTranslation } from "react-i18next";
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'


jest.mock('../src/util/redux/hooks', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock("../src/api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

describe('SavingsBucketRow', () => {
    beforeEach(() => {
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the SavingsBucketRow', () => {

        const mockData = {
            id: 1,
            name: 'Test Name',
            amount_required: 100,
            amount_reserved: 50,
            is_currently_reserved: false,
        };

        render(
            <BrowserRouter>
                <SavingsBucketRow data={mockData}/>
            </BrowserRouter>
        );

        const checkbox = screen.getByLabelText('budgets.mark-as-reserved');

        expect(screen.getByText('Test Name')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
        expect(checkbox).not.toBeDisabled();
    });

    it('should render the SavingsBucketRow if reserved amount is greater than required', async () => {

        const mockData = {
            id: 1,
            name: 'Test Name',
            amount_required: 90,
            amount_reserved: 100,
            is_currently_reserved: true,
        };

        render(
            <BrowserRouter>
                <SavingsBucketRow data={mockData}/>
            </BrowserRouter>
        );

        const checkbox = screen.getByLabelText('budgets.mark-as-reserved');

        expect(screen.getByText('Test Name')).toBeInTheDocument();
        expect(screen.getByText('90')).toBeInTheDocument();
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toBeChecked();
        expect(checkbox).not.toBeDisabled();
    });

    it('should handleCheckboxCheck', async () => {
        const user = userEvent.setup();

        const mockData = {
            id: 1,
            name: 'Test Name',
            amount_required: 90,
            amount_reserved: 100,
            is_currently_reserved: true,
        };

        render(
            <BrowserRouter>
                <SavingsBucketRow data={mockData}/>
            </BrowserRouter>
        );

        const checkbox = screen.getByLabelText('budgets.mark-as-reserved');

        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toBeChecked();

        await waitFor(async () => {
            await user.click(checkbox);
            expect(checkbox).not.toBeChecked();
            await user.click(checkbox);
            expect(checkbox).toBeChecked();
        });
    });

    it('should handleReservedChange', async () => {
        const user = userEvent.setup();

        const mockData = {
            id: 1,
            name: 'Test Name',
            amount_required: 90,
            amount_reserved: 50,
            is_currently_reserved: false,
        };

        render(
            <BrowserRouter>
                <SavingsBucketRow data={mockData}/>
            </BrowserRouter>
        );

        const input = screen.getByDisplayValue('50');

        expect(input).toBeInTheDocument();
        expect(input).not.toBeDisabled();

        await waitFor(async () => {
            await user.clear(input);
            await user.type(input, '80');
            expect(input).toHaveValue(80);
        });
    });

    it('should call sendUpdatedBucket after timeout', async () => {

        const mockData = {
            id: 1,
            name: 'Test Name',
            amount_required: 90,
            amount_reserved: 50,
            is_currently_reserved: false,
        };

        render(
            <BrowserRouter>
                <SavingsBucketRow data={mockData}/>
            </BrowserRouter>
        );

        const input = screen.getByDisplayValue('50');

        await waitFor(async () => {
            fireEvent.change(input, { target: { value: '80' } });
        });
    });
});