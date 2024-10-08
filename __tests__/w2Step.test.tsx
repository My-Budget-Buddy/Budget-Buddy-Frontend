import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import W2Step from '../src/pages/Tax/w2Step';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import "@testing-library/jest-dom";
import { createW2API } from '../src/pages/Tax/taxesAPI';

const initState = [
    {
        w2state: "FL",
        w2id: 2,
        w2taxReturnId: 1,
        w2year: 2024,
        w2userId: 1,
        w2employer: "Skillstorm",
        w2wages: 0,
        w2federalIncomeTaxWithheld: 0,
        w2stateIncomeTaxWithheld: 0,
        w2socialSecurityTaxWithheld: 0,
        w2medicareTaxWithheld: 0,
        w2imageKey: null,
    },
];

const mockW2State = [
    {
        state: "FL",
        id: 1,
        taxReturnId: 1,
        year: 2024,
        userId: 1,
        employer: "Skillstorm",
        wages: 0,
        federalIncomeTaxWithheld: 0,
        stateIncomeTaxWithheld: 0,
        socialSecurityTaxWithheld: 0,
        medicareTaxWithheld: 0,
        imageKey: null,
    },
]

const mockStore = configureStore([]);
const w2Store = mockStore({ w2: initState });
const { findW2sByTaxReturnIdAPI } = require('../src/pages/Tax/taxesAPI');

jest.mock("../src/api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock" // mock with localhost url
    }
}));

jest.mock("../src/pages/Tax/taxesAPI", () => ({
    findW2sByTaxReturnIdAPI: jest.fn(),
    createW2API: jest.fn(),
}));

describe('W2 Table', () => {
    beforeEach(() => {
        findW2sByTaxReturnIdAPI.mockResolvedValue({ data: mockW2State });
        render(
            <Provider store={w2Store}>
                <BrowserRouter>
                    <W2Step />
                </BrowserRouter>
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render table headers correctly', () => {
        expect(screen.getByText('State')).toBeInTheDocument();
        expect(screen.getByText('Employer')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
     });

     it('should render add & submit buttons correctly', () => {
        expect(document.getElementById('w2-add-button')).toBeInTheDocument();
        expect(document.getElementById('w2-submit-button')).toBeInTheDocument();
     });

     it('should render W2 states populate correctly', async () => {
        await waitFor(() => {
            expect(screen.getByTestId('w2-id-1')).toBeInTheDocument();
            expect(screen.getByTestId('w2-state-1')).toHaveTextContent('FL');
            expect(screen.getByTestId('w2-employer-1')).toHaveTextContent('Skillstorm');
            expect(document.getElementById('w2-edit-button')).toBeInTheDocument();
            expect(document.getElementById('w2-delete-button')).toBeInTheDocument();
        });
     });
});

describe('W2 Add New Form', () => {
    beforeEach(() => {
        findW2sByTaxReturnIdAPI.mockResolvedValue({ data: mockW2State });
        render(
            <Provider store={w2Store}>
                <BrowserRouter>
                    <W2Step />
                </BrowserRouter>
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('render the W2 edit for when add button is clicked', async () => {
        await waitFor(() => {
            const addBtn = document.getElementById("w2-add-button");
            addBtn?.click();
        });

    });

});

describe('W2 Edit Form', () => {
    beforeEach(() => {
        findW2sByTaxReturnIdAPI.mockResolvedValue({ data: mockW2State });
        render(
            <Provider store={w2Store}>
                <BrowserRouter>
                    <W2Step />
                </BrowserRouter>
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the W2 edit form', async () => {
        await waitFor(() => {
            expect(screen.getByTestId('w2-id-1')).toBeInTheDocument();
            const editBtn = document.getElementById("w2-edit-button");
            editBtn?.click();
        });

        expect(document.getElementById('state')).toBeInTheDocument();
        expect(document.getElementById('employer')).toBeInTheDocument();
        expect(document.getElementById('wages')).toBeInTheDocument();
        expect(document.getElementById('federalIncomeTaxWithheld')).toBeInTheDocument();
        expect(document.getElementById('stateIncomeTaxWithheld')).toBeInTheDocument();
        expect(document.getElementById('socialSecurityTaxWithheld')).toBeInTheDocument();
        expect(document.getElementById('medicareTaxWithheld')).toBeInTheDocument();
        expect(document.getElementById('w2-save-button')).toBeInTheDocument();
    });

    it('should save and submit the W2 form', async () => {

        await waitFor(() => {
            expect(screen.getByTestId('w2-id-1')).toBeInTheDocument();
            const editBtn = document.getElementById("w2-edit-button");
            editBtn?.click();
        });

        const state = document.getElementById('state');
        if (state) {
            fireEvent.change(state, { target: { value: 'CA' } });
        }

        const employer = document.getElementById('employer');
        if (employer) {
            fireEvent.change(employer, { target: { value: 'Google' } });
        }

        const wages = document.getElementById('wages');
        if (wages) {
            fireEvent.change(wages, { target: { value: 100000 } });
        }

        const federalIncomeTaxWithheld = document.getElementById('federalIncomeTaxWithheld');
        if (federalIncomeTaxWithheld) {
            fireEvent.change(federalIncomeTaxWithheld, { target: { value: 10000 } });
        }

        const stateIncomeTaxWithheld = document.getElementById('stateIncomeTaxWithheld');
        if (stateIncomeTaxWithheld) {
            fireEvent.change(stateIncomeTaxWithheld, { target: { value: 5000 } });
        }

        const socialSecurityTaxWithheld = document.getElementById('socialSecurityTaxWithheld');
        if (socialSecurityTaxWithheld) {
            fireEvent.change(socialSecurityTaxWithheld, { target: { value: 5000 } });
        }

        const medicareTaxWithheld = document.getElementById('medicareTaxWithheld');
        if (medicareTaxWithheld) {
            fireEvent.change(medicareTaxWithheld, { target: { value: 1000 } });
        }

        await waitFor(() => {
            expect(document.getElementById('state')).toHaveValue('CA');
            const saveBtn = document.getElementById("w2-save-button");
            saveBtn?.click();
        });

        const submitBtn = document.getElementById("w2-submit-button");
        submitBtn?.click();
    });
});

describe('W2 Form Errors', () => {
    beforeEach(() => {
        findW2sByTaxReturnIdAPI.mockResolvedValue({ data: mockW2State });
        render(
            <Provider store={w2Store}>
                <BrowserRouter>
                    <W2Step />
                </BrowserRouter>
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should display error message when form is not filled correctly', async () => {
        await waitFor(() => {
            expect(screen.getByTestId('w2-id-1')).toBeInTheDocument();
            const editBtn = document.getElementById("w2-edit-button");
            editBtn?.click();
        });

        const state = document.getElementById('state');
        if (state) {
        console.log("state: ", state);
            fireEvent.change(state, { target: { value: 'VIR' } });
            expect(screen.getByText('Must Use 2 Letter State Abbreviation')).toBeInTheDocument();
        }

        
    });
});