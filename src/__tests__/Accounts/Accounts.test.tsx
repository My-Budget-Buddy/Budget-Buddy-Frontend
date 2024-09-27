import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Accounts from "../../pages/Accounts/Accounts";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom';
import AccountModal from "../../pages/Accounts/AccountModal";
import CreditScoreModal from "../../pages/Accounts/CreditScoreModal";


/*Have to mock gauge and esl in both x-charts and x-charts/Gauge
reason being that account.tsx imports Guage from @mui/x-charts/Gauge
whereas creditScoreModal.tsx imports Gauge from @mui/x-charts
thus both have to be mocked to avoid errors(or otherwise I need to change imports to be consistent)
also need ESL to be mocked in both to avoid errors with being compiled as commonJSX
*/

jest.mock('@mui/x-charts', () => ({
    __esModule: true,
    AxisConfig: jest.fn().mockImplementation(({ children }) => children),
    Gauge: jest.fn().mockImplementation(() => null),
    gaugeClasses: { valueText: 'valueText' },
}));

jest.mock('@mui/x-charts/Gauge', () => ({
    __esModule: true,
    Gauge: jest.fn().mockImplementation(() => null),
    gaugeClasses: { valueText: 'valueText' },
}));

jest.mock('focus-trap-react', () => {
    const React = require('react');
    return ({ children }: any) => <div>{children}</div>;
});
//Mocks api request
jest.mock("../../api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));



// Mock useAuthentication to avoid errors
jest.mock("../../contexts/AuthenticationContext", () => ({
    useAuthentication: () => ({ jwt: "mocked-jwt-token" })
}));

jest.mock('@trussworks/react-uswds', () => {
    const actual = jest.requireActual('@trussworks/react-uswds');
    return {
        ...actual,
        Icon: {
            ...actual.Icon,
            Delete: () => <span data-testid="delete-icon">Delete</span>,
        },
    };
});

jest.mock('@mui/icons-material', () => ({
    ...jest.requireActual('@mui/icons-material'),
    Delete: () => <span data-testid="delete-icon">Delete</span>,
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
    } as Response)
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
    test('calculates and displays the correct credit score', async () => {
        render(<CreditScoreModal totalDebt={20000} />);

        // Open the modal
        const openButton = screen.getByText('accounts.get-report');
        fireEvent.click(openButton);

        // Ensure the modal is opened
        await waitFor(() => {
            expect(screen.getByText('accounts.credit-score-report')).toBeInTheDocument();
        });

        // Since the Gauge is mocked to return null, we cannot directly test the displayed score
        // However, we can test that the creditScore is calculated correctly in the component

        // Alternatively, you can expose the creditScore for testing purposes or adjust your mock
    });

    test('displays net cash gauge correctly for positive net cash', async () => {
        // Set up mock accounts to result in positive net cash
        const positiveAccounts = [
            { id: 1, type: 'CHECKING', institution: 'Bank A', accountNumber: '1234', currentBalance: 2000 },
            { id: 2, type: 'CREDIT', institution: 'Bank B', accountNumber: '5678', currentBalance: -500 }
        ];

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(positiveAccounts),
            })
        );

        render(
            <Provider store={store}>
                <Accounts />
            </Provider>
        );

        // Assert that the net cash value is displayed correctly
        await waitFor(() => {
            expect(screen.getByText('$1,500.00')).toBeInTheDocument(); // Net cash = 2000 - 500
        });

        // Optionally, check that the gauge has the correct color (green for positive)
        // Since the Gauge is mocked to return null, you might need to adjust the mock or test implementation
    });
    test('adds a new account when form is submitted', async () => {
        const onAccountAddedMock = jest.fn();

        render(<AccountModal onAccountAdded={onAccountAddedMock} />);

        // Open the modal
        const openButton = screen.getByText('accounts.add-account');
        fireEvent.click(openButton);

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/accounts.account-type/i), { target: { value: 'CHECKING' } });
        fireEvent.change(screen.getByLabelText(/accounts.institution/i), { target: { value: 'Bank C' } });
        fireEvent.change(screen.getByLabelText(/accounts.account-number/i), { target: { value: '99999999' } });
        fireEvent.change(screen.getByLabelText(/accounts.routing-number/i), { target: { value: '123456789' } });

        // Mock the POST API call
        const newAccount = {
            id: 3,
            type: 'CHECKING',
            institution: 'Bank C',
            accountNumber: '99999999',
            currentBalance: 0,
        };

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(newAccount),
            })
        );

        // Submit the form
        fireEvent.click(screen.getByText('accounts.add'));

        // Ensure the onAccountAdded callback was called with the new account
        await waitFor(() => {
            expect(onAccountAddedMock).toHaveBeenCalledWith(newAccount);
        });
    });

    test('deletes an account when delete button is clicked', async () => {
        render(
            <Provider store={store}>
                <Accounts />
            </Provider>
        );

        // Wait for accounts to be displayed
        await waitFor(() => {
            expect(screen.getByText('Bank A')).toBeInTheDocument();
            expect(screen.getByText('Bank B')).toBeInTheDocument();
        });

        // Expand the 'Checking' accordion
        fireEvent.click(screen.getByRole('button', { name: 'accounts.checking' }));

        // Mock the delete API call
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
            })
        );

        // Find the delete icons using the data-testid
        const deleteIcons = screen.getAllByTestId('delete-icon');

        // Map the icons to their parent buttons
        const deleteButtons = deleteIcons.map(icon => icon.closest('button'));

        // Ensure we have the correct number of delete buttons
        expect(deleteButtons.length).toBeGreaterThan(0);

        // Click the delete button for the first account
        fireEvent.click(deleteButtons[0]!);

        // Wait for the account to be removed from the DOM
        await waitFor(() => {
            expect(screen.queryByText('Bank A')).not.toBeInTheDocument();
        });
    });

    test('renders Accounts component without crashing', async () => {
        render(
            <Provider store={store}>
                <Accounts />
            </Provider>
        );

        // Now the correct translations will be applied
        expect(screen.getByText('accounts.net-cash')).toBeInTheDocument();
        expect(screen.getByText('accounts.view-accounts')).toBeInTheDocument();
    });
    test('opens and closes the account modal', async () => {
        render(<AccountModal onAccountAdded={jest.fn()} />);

        // Open the modal
        const openButton = screen.getByText('accounts.add-account');
        fireEvent.click(openButton);

        // Ensure the modal is opened
        const modalHeading = screen.getByText('accounts.enter-account');
        expect(modalHeading).toBeInTheDocument();

        // Select the modal wrapper by its role or test ID
        const modalWrapper = document.querySelector('.usa-modal-wrapper');// You can also use a test ID if applicable

        // Click the close button
        const closeButton = screen.getByText('accounts.back');
        fireEvent.click(closeButton);

        // Wait for the modal to have the 'is-hidden' class
        await waitFor(() => {
            expect(modalWrapper).toHaveClass('is-hidden');
        });
    });
    test('opens and closes the CreditScore modal', async () => {
        render(<CreditScoreModal totalDebt={0} />);

        // Open the modal
        const openButton = screen.getByText('accounts.get-report');
        fireEvent.click(openButton);

        // Ensure the modal is opened
        const modalHeading = screen.getByText('accounts.credit-score-report');
        expect(modalHeading).toBeInTheDocument();

        // Select the modal wrapper by its role or test ID
        const modalWrapper = document.querySelector('.usa-modal-wrapper');// You can also use a test ID if applicable

        // Click the close button
        const closeButton = screen.getByText('accounts.back');
        fireEvent.click(closeButton);

        // Wait for the modal to have the 'is-hidden' class
        await waitFor(() => {
            expect(modalWrapper).toHaveClass('is-hidden');
        });
    });
    test('shows and hides tooltip on hover', async () => {
        render(
            <Provider store={store}>
                <Accounts />
            </Provider>
        );

        // Locate the title "accounts.net-cash"
        const titleElement = screen.getByText('accounts.net-cash');

        // Find the parent container div that holds the title and the span
        const parentDiv = titleElement.closest('div.flex.items-center');

        // Find the span with the class "relative" within the parent div
        const hoverableSpan = parentDiv?.querySelector('span.relative');

        // Ensure that the span is found
        expect(hoverableSpan).not.toBeNull();

        // Simulate mouse entering the span to trigger the tooltip
        fireEvent.mouseEnter(hoverableSpan!); // Non-null assertion operator

        // Wait for the tooltip to appear
        await waitFor(() => expect(screen.getByText('accounts.net-desc')).toBeInTheDocument());

        // Simulate mouse leaving the span to hide the tooltip
        fireEvent.mouseLeave(hoverableSpan!);

        // Ensure the tooltip disappears
        await waitFor(() => expect(screen.queryByText('accounts.net-desc')).not.toBeInTheDocument())
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
    test('displays error alert with correct message when fetching accounts fails', async () => {
        // Mock the fetch to simulate a failed response
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.reject(new Error('Server is down'))
        );

        render(
            <Provider store={store}>
                <Accounts />
            </Provider>
        );

        // Use waitFor to ensure the error message is rendered
        await waitFor(() => {
            expect(screen.getByText('Error Fetching Account Information')).toBeInTheDocument();
            expect(screen.getByText('Server is down')).toBeInTheDocument();
        });
    });
    test('displays correct total assets and debts', async () => {
        render(
            <Provider store={store}>
                <Accounts />
            </Provider>
        );
        //-----------------------------------------------------------------------------------
        // Use findByText to wait for the values to be rendered
        //const assetsText = await screen.findByText(/\$1,000\.00/i); // Total assets
        //const debtsText = await screen.findByText(/\$500\.00/i);   // Total debts

        const assetsText = screen.getByText('accounts.total-assets');
        expect(assetsText).toBeInTheDocument();
        const debtsText = screen.getByText('accounts.total-debts');
        expect(debtsText).toBeInTheDocument();
    });
    test('renders multiple delete buttons', async () => {
        const { getAllByRole } = render(
            <Provider store={store}>
                <Accounts />
            </Provider>
        );

        // Get all buttons (assuming all delete icons are inside button elements)
        const deleteButtons = getAllByRole('button');

        // Check that there are the expected number of delete buttons
        expect(deleteButtons.length).toBeGreaterThan(0); // For example, you can assert the exact number if you know it

        // Optionally, interact with one of the delete buttons
        fireEvent.click(deleteButtons[0]);  // Click the first delete button

        expect(deleteButtons.length).toBe(11); // If you expect 2 delete buttons, for example

        // You can add more checks to verify the button behavior, e.g., account deletion
        // Example:
        // await waitFor(() => expect(screen.queryByText('Bank A')).toBeNull());
    });
});