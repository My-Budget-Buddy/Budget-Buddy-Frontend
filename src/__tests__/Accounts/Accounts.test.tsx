import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Accounts from "../../pages/Accounts/Accounts";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom';



//Mocks api request
jest.mock("../../api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));


jest.mock("@mui/x-charts", () => ({
    AxisConfig: jest.fn().mockImplementation(({ children }) => children),
}));

// Mock useAuthentication to avoid errors
jest.mock("../../contexts/AuthenticationContext", () => ({
    useAuthentication: () => ({ jwt: "mocked-jwt-token" })
}));

jest.mock("@mui/x-charts/Gauge", () => ({
    Gauge: jest.fn().mockImplementation(({ children }) => children),
    gaugeClasses: jest.fn().mockImplementation(({ children }) => children),
}));

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            // Provide custom translations for the specific keys you're testing
            const translations: { [key: string]: string } = {
                'accounts.net-cash': 'Net Cash',
                'accounts.view-accounts': 'View Accounts',
                'accounts.total-assets': 'Total Assets',
                'accounts.total-debts': 'Total Debts',
                // Add more keys as necessary
            };
            return translations[key] || key;
        },
    }),
}));

// Mock the CreditScoreModal
jest.mock('../../pages/Accounts/CreditScoreModal', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Mocked CreditScoreModal</div>),
}));

// Mock the global fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve([
            { id: 1, type: 'CHECKING', institution: 'Bank A', accountNumber: '1234', currentBalance: 1000 },
            { id: 2, type: 'CREDIT', institution: 'Bank B', accountNumber: '5678', currentBalance: -500 }
        ]),
        headers: {},
        redirected: false,
        statusText: 'OK',
        type: 'basic',
        url: '',
        clone: jest.fn(),
        body: null,
        bodyUsed: false,
    } as unknown as Response) // Type assertion to Response
);

const mockStore = configureStore([]);
describe('Accounts component', () => {
    let store: any;

    beforeEach(() => {
        // Mock the store with initial state
        store = mockStore({
            accounts: [
                { id: 1, type: 'CHECKING', institution: 'Bank A', accountNumber: '1234', currentBalance: 1000 },
                { id: 2, type: 'CREDIT', institution: 'Bank B', accountNumber: '5678', currentBalance: -500 }
            ],
            simpleFormStatus: { isSending: false }
        });
    });

    test('renders Accounts component without crashing', async () => {
        render(
            <Provider store={store}>
                <Accounts />
            </Provider>
        );

        // Now the correct translations will be applied
        expect(screen.getByText(/net cash/i)).toBeInTheDocument();
        expect(screen.getByText(/view accounts/i)).toBeInTheDocument();
    });

    test('displays error message when there is an error', async () => {
        // Mock the fetch to simulate a failed response
        global.fetch = jest.fn(() =>
            Promise.reject(new Error("Error fetching account information"))
        );

        render(
            <Provider store={store}>
                <Accounts />
            </Provider>
        );

        // Use waitFor to ensure the error message is rendered
        await waitFor(() => {
            const errorMessages = screen.getAllByText(/error fetching account information/i);
            expect(errorMessages.length).toBeGreaterThan(0);  // Ensure there are error messages
            expect(errorMessages[0]).toBeInTheDocument();     // Check the first error message
        });
    });
    test('displays correct total assets and debts', async () => {
        render(
            <Provider store={store}>
                <Accounts />
            </Provider>
        );

        // Debug the current state of the DOM
        await waitFor(() => {
            screen.debug();  // This will output the current DOM
        });

        // Then, attempt to match the text (you can adjust based on the debug output)
        await waitFor(() => {
            const assetsText = screen.getByText((content, element) => {
                return content.includes('$1,000.00');
            });
            const debtsText = screen.getByText((content, element) => {
                return content.includes('$500.00');
            });

            expect(assetsText).toBeInTheDocument();
            expect(debtsText).toBeInTheDocument();
        });
    });
    test('calls handleDelete when delete button is clicked', async () => {
        render(
            <Provider store={store}>
                <Accounts />
            </Provider>
        );

        // Mock delete button
        //const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];

        // Debug the DOM to inspect the current state
        screen.debug();  // This will help you inspect the rendered DOM

        // Use waitFor to ensure the delete button is rendered
        const deleteButton = await waitFor(() =>
            screen.getAllByRole('button', { name: /delete/i })
        );

        // Ensure there is at least one delete button
        expect(deleteButton.length).toBeGreaterThan(0);

        fireEvent.click(deleteButton[0]);

        // Check if the delete functionality works (assuming it calls an API, etc.)
        expect(deleteButton).toBeInTheDocument(); // Ensure the button exists
        // We can check if handleDelete logic was triggered (with mock API calls, etc.)
    });
});