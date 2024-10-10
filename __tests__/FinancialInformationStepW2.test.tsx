import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import FinancialInformationStepW2 from '../src/pages/Tax/FinancialInformationStepW2';
import { otherIncome, setOtherIncomeInfo } from '../src/utils/redux/otherIncomeSlice';
import { addOtherIncomeAPI, getOtherIncomeAPI, updateTaxReturnAPI } from '../src/pages/Tax/taxesAPI';
import { store } from '../src/utils/redux/store';

import * as TaxesApi from '../src/pages/Tax/taxesAPI';



jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn()
}));

// Mock the taxesAPI module
jest.mock('../src/pages/Tax/taxesAPI', () => ({
    getOtherIncomeAPI: jest.fn().mockResolvedValue({
        data: {
            longTermCapitalGains: 1000,
            shortTermCapitalGains: 500,
            otherInvestmentIncome: 200,
            netBusinessIncome: 300,
            additionalIncome: 400
        }
    }),
    addOtherIncomeAPI: jest.fn().mockResolvedValue({
        otherIncome: {
            oilongTermCapitalGains: 100,
            oishortTermCapitalGains: 50,
            oiotherInvestmentIncome: 20,
            oinetBusinessIncome: 30,
            oiadditionalIncome: 10
        }
    }),
    updateTaxReturnAPI: jest.fn()
}));

jest.mock("../src/api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: jest.fn().mockReturnValue({})
}));


describe('FinancialInformationStepW2', () => {

    // Correctly fetches other income data from the API and updates the state
    it('should update state with fetched other income data when API call is successful', async () => {


        render(<FinancialInformationStepW2 />);

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'otherIncome/setOtherIncomeInfo',
                payload: {
                    oitaxReturnId: undefined,
                    oilongTermCapitalGains: 1000,
                    oishortTermCapitalGains: 500,
                    oiotherInvestmentIncome: 200,
                    oinetBusinessIncome: 300,
                    oiadditionalIncome: 400,

                }
            });
        });

    });

    // Handles API errors gracefully and sets default values when fetching other income data fails
    it('should set default values when API call fails', async () => {
        (getOtherIncomeAPI as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

        render(<FinancialInformationStepW2 />);

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'otherIncome/setOtherIncomeInfo',
                payload: {
                    oitaxReturnId: NaN,
                    oilongTermCapitalGains: 0,
                    oishortTermCapitalGains: 0,
                    oiotherInvestmentIncome: 0,
                    oinetBusinessIncome: 0,
                    oiadditionalIncome: 0
                }
            });
        });
    });

    it('should display error if longTermCapitalGains is less than 2 characters', async () => {
        render(
            <Router>
                <FinancialInformationStepW2 />
            </Router>
        );

        const input = screen.getByLabelText('Long Term Capital Gains');
        fireEvent.change(input, { target: { name: 'formType', value: 'a' } });

        waitFor(() => {
            expect(screen.getByText('Form type must be at least 2 characters long.')).toBeInTheDocument();
            expect(mockDispatch).not.toHaveBeenCalled();
        });
    });

    it('should display error if shortTermCapitalGains is less than 3 characters', async () => {
        render(
            <Router>
                <FinancialInformationStepW2 />
            </Router>
        );

        const input = screen.getByLabelText('Short Term Capital Gains');
        fireEvent.change(input, { target: { name: 'status', value: 'ab' } });

        waitFor(() => {
            expect(screen.getByText('Status must be at least 3 characters long.')).toBeInTheDocument();
            expect(mockDispatch).not.toHaveBeenCalled();
        });
    });

    it('should dispatch setOtherIncomeInfo if no error', () => {
        render(
            <Router>
                <FinancialInformationStepW2 />
            </Router>
        );
        
        const input = screen.getByLabelText('Long Term Capital Gains');
        fireEvent.change(input, { target: { name: 'formType', value: 'ab' } });

        expect(mockDispatch).toHaveBeenCalled();
    });

    it('should call addOtherIncomeAPI on save', () => {

        render(
            <Router>
                <FinancialInformationStepW2 />
            </Router>
        );

        const button = screen.getByText('Save');
        fireEvent.click(button);

        expect(addOtherIncomeAPI).toHaveBeenCalled();
    });
});