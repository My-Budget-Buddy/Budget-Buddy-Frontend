import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import FinancialInformationStepW2 from '../pages/Tax/FinancialInformationStepW2';
import { otherIncome, setOtherIncomeInfo } from '../pages/Tax/otherIncomeSlice';
import { getOtherIncomeAPI, updateTaxReturnAPI } from '../pages/Tax/taxesAPI';
import { store } from '../util/redux/store';

import * as TaxesApi from '../pages/Tax/taxesAPI';



jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn()
}));

// Mock the taxesAPI module
jest.mock('../pages/Tax/taxesAPI', () => ({
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
        otherIncome:{
            oilongTermCapitalGains: 100,
              oishortTermCapitalGains: 50,
              oiotherInvestmentIncome: 20,
              oinetBusinessIncome: 30,
              oiadditionalIncome: 10
        }
    }),
    updateTaxReturnAPI: jest.fn()
}));

jest.mock("../api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: jest.fn().mockReturnValue({})
}));

jest.mock('../pages/Tax/taxesAPI', () => ({
    getOtherIncomeAPI: jest.fn().mockResolvedValue({
        data: {
            longTermCapitalGains: 1000,
            shortTermCapitalGains: 500,
            otherInvestmentIncome: 200,
            netBusinessIncome: 300,
            additionalIncome: 400
        }
    })
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


    
});