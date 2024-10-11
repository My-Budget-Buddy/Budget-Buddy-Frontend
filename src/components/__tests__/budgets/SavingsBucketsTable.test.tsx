import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Icon, Table } from "@trussworks/react-uswds";
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from "react-router-dom";

import SavingsBucketsTable from '../../budgets/SavingsBucketsTable';
import { useAppDispatch, useAppSelector } from '../../../utils/redux/hooks';
import { updateBuckets } from '../../../utils/redux/bucketSlice';
import { SavingsBucketRowProps } from '../../../types/budgetInterfaces';
import { getBuckets } from '../../../api/requests/bucketRequests';
import { useTranslation } from 'react-i18next';

jest.mock('../../../utils/redux/hooks');

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            if (key === 'locale') return 'en-US';
            return key;
        }
    }),
}));

jest.mock("../../../api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

jest.mock('../../../utils/redux/bucketSlice');
jest.mock('../../../types/budgetInterfaces');
jest.mock('../../../api/requests/bucketRequests');

const mockBuckets = [
    { 
        data: {
            id: 1,
            name: 'Bucket A', 
            amount_required: 100, 
            amount_reserved: 150, 
            is_currently_reserved: true 
        }
    },
    { 
        data: {
            id: 3, 
            name: 'Bucket C', 
            amount_required: 50, 
            amount_reserved: 20, 
            is_currently_reserved: true 
        }
    },
    { 
        data: {
            id: 2, 
            name: 'Bucket B', 
            amount_required: 200, 
            amount_reserved: 150, 
            is_currently_reserved: false 
        }
    },
];

const mockStore = configureStore([]);

describe('SavingsBucketsTable', () => {
    // let store: any;
    const dispatchMock = jest.fn();
    
    beforeEach(() => {
        jest.clearAllMocks();
        (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => selector({
            buckets: { buckets: mockBuckets, totalReserved: 0 },
            simpleFormStatus: { isSending: false }
        }));
        (useAppDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
        (getBuckets as unknown as jest.Mock).mockResolvedValue(mockBuckets);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the SavingsBucketsTable component', async () => {
        
        const initialState = {buckets: {buckets: mockBuckets, totalReserved: 0}};
        const store = mockStore(initialState);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <SavingsBucketsTable />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText('budgets.name')).toBeInTheDocument();
        expect(screen.getByText('budgets.required')).toBeInTheDocument();
        expect(screen.getByText('budgets.reserved')).toBeInTheDocument();
        expect(screen.getByText('budgets.actions')).toBeInTheDocument();

        expect(screen.getByText('Bucket A')).toBeInTheDocument();
    });

    it('should sort the buckets by name in descending order', async () => {
        const user = userEvent.setup();

        (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => selector({
            buckets: { buckets: mockBuckets, totalReserved: 0 },
            simpleFormStatus: { isSending: true }
        }));

        const initialState = {buckets: {buckets: mockBuckets, totalReserved: 0}};
        const store = mockStore(initialState);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <SavingsBucketsTable />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(async () => {
            await user.click(screen.getByText('budgets.name'));
        });

        const bucketNames = screen.getAllByTestId('bucket-name').map(el => el.textContent);
        expect(bucketNames).toEqual(['Bucket C', 'Bucket B', 'Bucket A']);
    });

    it('should sort the buckets by required amount in ascending order', async () => {
        const user = userEvent.setup();

        const initialState = {buckets: {buckets: mockBuckets, totalReserved: 0}};
        const store = mockStore(initialState);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <SavingsBucketsTable />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(async () => {
            await user.click(screen.getByText('budgets.required'));
        });

        const bucketNames = screen.getAllByTestId('bucket-name').map(el => el.textContent);
        expect(bucketNames).toEqual(['Bucket C', 'Bucket A', 'Bucket B']);
    });

    it('should sort the buckets by reserved amount in descending order', async () => {
        const user = userEvent.setup();

        const initialState = {buckets: {buckets: mockBuckets, totalReserved: 0}};
        const store = mockStore(initialState);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <SavingsBucketsTable />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(async () => {
            await user.click(screen.getByText('budgets.reserved'));
            await user.click(screen.getByText('budgets.reserved'));
        });

        const bucketNames = screen.getAllByTestId('bucket-name').map(el => el.textContent);
        expect(bucketNames).toEqual(['Bucket A', 'Bucket B', 'Bucket C']);
    });
});