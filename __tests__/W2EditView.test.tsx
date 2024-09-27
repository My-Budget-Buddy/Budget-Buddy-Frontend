import { render, screen, fireEvent } from '@testing-library/react';
import W2EditView from '../src/pages/Tax/W2EditView';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';

jest.mock("../src/api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

const mockStore = configureStore([]);
const store = mockStore({
    simpleFormStatus: { isSending: false },
    budgets: {
        monthYear: '2024-9',
        selectedMonthString: 'September',
        selectedYear: 2024,
        budgets: [],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    },
});

// MOCKED COMPONENTS

jest.mock('../src/pages/Tax/PersonalInfoStep', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Personal Information Content</div>),
}));

jest.mock('../src/pages/Tax/w2Step', () => ({
    __esModule: true,
    default: jest.fn(() => <div>File W2s Content</div>),
}));

jest.mock('../src/pages/Tax/FinancialInformationStepW2', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Other Income Content</div>),
}));

jest.mock('../src/pages/Tax/WithholdingsAndMiscW2', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Deductions Content</div>),
}));

jest.mock('../src/pages/Tax/ReviewAndSubmitStepW2', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Review and submit Content</div>),
}));

describe('W2EditView', () => {
    beforeEach(() => {
        render(
            <W2EditView />
        );
    })

    it('renders step indicator with correct steps', () => {
        const steps = ['Personal Information', 'File W2s', 'Other Income', 'Deductions', 'Review and submit'];
        steps.forEach(async step => {
            const stepIndicator = (await screen.findAllByText(step, { selector: 'span' })).find((el) => el.className === 'usa-step-indicator__segment-label')
            expect(stepIndicator).toBeInTheDocument();
        });
    });

    it('initially renders PersonalInfoStep component', () => {
        expect(screen.getByText('Personal Information Content', { selector: 'div' })).toBeInTheDocument();
    });

    it('navigates to next step on Next button click', () => {
        fireEvent.click(screen.getByText('Next'));
        expect(screen.getByText('File W2s Content')).toBeInTheDocument();
    });

    it('navigates to previous step on Prev button click', () => {
        fireEvent.click(screen.getByText('Next'));
        fireEvent.click(screen.getByText('Prev'));
        expect(screen.getByText('Personal Information Content')).toBeInTheDocument();
    });

    it('Next button is disabled on the last step', () => {
        for (let i = 0; i < 4; i++) {
            fireEvent.click(screen.getByText('Next'));
        }
        expect(screen.getByText('Next')).toBeDisabled();
    });

    it('Prev button is disabled on the first step', () => {
        expect(screen.getByText('Prev')).toBeDisabled();
    });
});