import React, { ReactNode } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAppDispatch, useAppSelector } from '../../../utils/redux/hooks';
import { setIsSending } from '../../../utils/redux/simpleSubmissionSlice';
import NewBucketModal from '../../modals/NewBucketModal';
import { postBucket } from '../../../api/requests/bucketRequests';

// Mock dependencies
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('focus-trap-react', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const React = require('react');
    return ({ children }: { children: ReactNode }) => <div>{children}</div>;
});

jest.mock('../../../utils/redux/hooks', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn(),
}));

jest.mock('../../../api/requests/bucketRequests', () => ({
    postBucket: jest.fn(),
}));

jest.mock('../../../utils/redux/simpleSubmissionSlice', () => ({
    setIsSending: jest.fn(),
}));

describe('NewBucketModal Component', () => {
    const dispatchMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
        (useAppSelector as unknown as jest.Mock).mockImplementation((selectorFn) => {
            if (selectorFn.name === 'simpleFormStatusSelector') {
                return false; // Mock the isSending state
            }
        });
    });

    test('renders modal and inputs correctly', () => {
        render(<NewBucketModal>Open Modal</NewBucketModal>);

        const openButton = screen.getByText('Open Modal');
        fireEvent.click(openButton);

        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
    });

    test('handles form input change', () => {
        render(<NewBucketModal>Open Modal</NewBucketModal>);

        fireEvent.click(screen.getByText('Open Modal'));

        const nameInput = screen.getByPlaceholderText('Name');
        const amountInput = screen.getByPlaceholderText('Amount');

        fireEvent.change(nameInput, { target: { value: 'New Bucket' } });
        fireEvent.change(amountInput, { target: { value: 100 } });

        expect(nameInput).toHaveValue('New Bucket');
        expect(amountInput).toHaveValue(100);
    });

    test('handles form submission successfully', async () => {
        (postBucket as jest.Mock).mockResolvedValue({}); // Mock successful response

        render(<NewBucketModal>Open Modal</NewBucketModal>);

        fireEvent.click(screen.getByText('Open Modal'));

        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'New Bucket' } });
        fireEvent.change(screen.getByPlaceholderText('Amount'), { target: { value: 100 } });

        const submitButton = screen.getByText('budgets.buttons.submit');
        fireEvent.click(submitButton);

        // Wait for the submission process
        await waitFor(() => {
            expect(postBucket).toHaveBeenCalledWith({
                userId: 1,
                bucketName: 'New Bucket',
                amountReserved: 0,
                amountRequired: "100",
                isActive: true,
                isReserved: false,
            });
            expect(dispatchMock).toHaveBeenCalledWith(setIsSending(true));
            expect(dispatchMock).toHaveBeenCalledWith(setIsSending(false));
        });
    });

    test('displays error when form submission fails', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        (postBucket as jest.Mock).mockRejectedValue(new Error('Failed to submit'));

        render(<NewBucketModal>Open Modal</NewBucketModal>);

        fireEvent.click(screen.getByText('Open Modal'));

        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'New Bucket' } });
        fireEvent.change(screen.getByPlaceholderText('Amount'), { target: { value: 100 } });

        const submitButton = screen.getByText('budgets.buttons.submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(postBucket).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith('ERROR!');
        });

        consoleErrorSpy.mockRestore();
    });

    test('resets form data when the modal is opened', () => {
        render(<NewBucketModal>Open Modal</NewBucketModal>);

        const openButton = screen.getByText('Open Modal');
        fireEvent.click(openButton);

        const nameInput = screen.getByPlaceholderText('Name');
        const amountInput = screen.getByPlaceholderText('Amount');

        fireEvent.change(nameInput, { target: { value: 'New Bucket' } });
        fireEvent.change(amountInput, { target: { value: 100 } });

        expect(nameInput).toHaveValue('New Bucket');
        expect(amountInput).toHaveValue(100);

        fireEvent.click(screen.getByText('budgets.buttons.go-back'));

        fireEvent.click(openButton);

        expect(screen.getByPlaceholderText('Name')).toHaveValue('');
        expect(screen.getByPlaceholderText('Amount')).toHaveValue(0);
    });
});
