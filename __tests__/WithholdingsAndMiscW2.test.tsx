import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import WithholdingsAndMiscW2 from '../src/pages/Tax/WithholdingsAndMiscW2';
import { RootState } from '../src/util/redux/store';
import { setDeductionsInfo } from '../src/pages/Tax/deductionsSlice';
import { SaveDeductionsByTaxReturn, getDeductionsByTaxReturn } from '../src/pages/Tax/taxesAPI';
import '@testing-library/jest-dom/';

jest.mock('../src/pages/Tax/taxesAPI', () => ({
    getDeductionsByTaxReturn: jest.fn(),
    SaveDeductionsByTaxReturn: jest.fn(),
}));

const mockStore = configureStore([]);
const initialState: RootState = {
    auth: {
        isAuthenticated: false,
    },
    buckets: {
        buckets: [],
        totalReserved: 0,
    },
    budgets: {
        budgets: [],
        totalFundsAvailable: 0,
        spendingBudget: 0,
        totalReserved: 0,
        totalActuallySpent: 0,
        monthYear: '',
        months: [],
        selectedMonth: 0,
        selectedMonthString: '',
        selectedYear: 0
    },
    user: {
        userId: ''
    },
    deductions: {
        dedid: 0,
        dedtaxReturn: 0,
        deddeduction: 0,
        deddeductionName: '',
        dedamountSpent: 0,
        dednetDeduction: 0,
    },
    formStatus: {
        status: 0,
    },
    simpleFormStatus: {
        isSending: false,
    },
    w2: {
        w2state: '',
        w2id: 0,
        w2taxReturnId: 0,
        w2year: 0,
        w2userId: 0,
        w2employer: '',
        w2wages: 0,
        w2federalIncomeTaxWithheld: 0,
        w2stateIncomeTaxWithheld: 0,
        w2socialSecurityTaxWithheld: 0,
        w2medicareTaxWithheld: 0,
        w2imageKey: 0
    },
    taxReturn: {
        taxReturn: {},
        taxReturns: [],
    },
    otherIncome: {
        oitaxReturnId: 0,
        oilongTermCapitalGains: 0,
        oishortTermCapitalGains: 0,
        oiotherInvestmentIncome: 0,
        oinetBusinessIncome: 0,
        oiadditionalIncome: 0
    }
};

jest.mock("../src/api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

describe('WithholdingsAndMiscW2', () => {
    let store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        store = mockStore(initialState);
        (getDeductionsByTaxReturn as jest.Mock).mockResolvedValue({
            data: [
                {
                    id: 1,
                    taxReturn: 1,
                    deduction: 1,
                    deductionName: 'Health Savings Account',
                    amountSpent: 1000,
                    netDeduction: 1000,
                },
            ],
        });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/tax/1/W2/1']}>
                    <Routes>
                        <Route path="/tax/:returnId/:formType/:formId" element={<WithholdingsAndMiscW2 />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
    });

    it('renders the component', async () => {
        await waitFor(() => {
            expect(screen.getByText('Deduction Type')).toBeInTheDocument();
            expect(screen.getByText('Deduction Amount')).toBeInTheDocument();
        });
    });

    it('handles add click', async () => {
        fireEvent.click(screen.getByText('Add'));
        fireEvent.click(screen.getAllByText('Edit')[0]);
        await waitFor(() => {
            expect(screen.getByText('- Select -')).toBeInTheDocument();
        });
    });

    it('handles edit click, selects deduction type and amount, and saves', async () => {
        fireEvent.click(screen.getByText('Add'));
        // Simulate clicking the "Edit" button
        fireEvent.click(screen.getAllByText('Edit')[1]);

        // Wait for the "Save" button to appear
        await waitFor(() => {
            expect(screen.getByText('Save')).toBeInTheDocument();
        });

        // Simulate selecting a deduction type
        fireEvent.change(screen.getByLabelText('Deduction Type'), { target: { value: '1' } });

        // Simulate entering a deduction amount
        fireEvent.change(screen.getByLabelText('Deduction Amount'), { target: { value: '1000' } });

        // Simulate clicking the "Save" button
        fireEvent.click(screen.getByText('Save'));

        // Verify that the updated deduction type and amount are displayed on the screen
        await waitFor(() => {
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('1000')).toBeInTheDocument();
        });
    });

    it('handles delete click', async () => {

        await waitFor(() => {
            fireEvent.click(screen.getByText('Delete'));
        });

        await waitFor(() => {
            expect(screen.queryByText('Health Savings Account')).not.toBeInTheDocument();
        });
    });
});