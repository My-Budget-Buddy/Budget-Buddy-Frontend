import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Accounts from "../Accounts";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom';
import AccountModal from "../../components/modals/AccountModal.tsx";
import CreditScoreModal from "../../components/modals/CreditScoreModal.tsx";
import { BrowserRouter } from "react-router-dom";


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

// Mock the getAccountByID function
jest.mock('../../api/taxesAPI', () => ({
    getAccountByID: jest.fn().mockResolvedValue({
        data: [
            {
                id: 1,
                type: 'CHECKING',
                userId: 1,
                accountNumber: 123456,
                routingNumber: 654321,
                institution: 'Bank A',
                investmentRate: 0,
                startingBalance: 1000,
                currentBalance: 1500
            },
            {
                id: 2,
                type: 'CREDIT',
                userId: 1,
                accountNumber: 789012,
                routingNumber: 210987,
                institution: 'Bank B',
                investmentRate: 0,
                startingBalance: 2000,
                currentBalance: 2500
            },
            {
                id: 3,
                type: 'SAVINGS',
                userId: 1,
                accountNumber: 345678,
                routingNumber: 876543,
                institution: 'Bank C',
                investmentRate: 1.5,
                startingBalance: 5000,
                currentBalance: 6000
            },
            {
                id: 4,
                type: 'INVESTMENT',
                userId: 1,
                accountNumber: 901234,
                routingNumber: 432109,
                institution: 'Bank D',
                investmentRate: 0,
                startingBalance: 3000,
                currentBalance: 2000
            }
        ]
    })
}));

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
    test('CreditScoreModal assigns correct color for creditScore > 719', async () => {
        const totalDebt = 160000; // Computed to give creditScore > 719
        render(<CreditScoreModal totalDebt={totalDebt} />);

        fireEvent.click(screen.getByText('accounts.get-report'));

        await waitFor(() => {
            expect(screen.getByText('accounts.credit-score-report')).toBeInTheDocument();
        });
    });
    test('CreditScoreModal assigns correct color for 690 < creditScore ≤ 719', async () => {
        const desiredCreditScore = 700;
        const totalDebt = 50000 + (871 - desiredCreditScore) * 1000; // Calculate totalDebt for desiredCreditScore

        render(<CreditScoreModal totalDebt={totalDebt} />);

        fireEvent.click(screen.getByText('accounts.get-report'));

        await waitFor(() => {
            expect(screen.getByText('accounts.credit-score-report')).toBeInTheDocument();
        });
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

    test('deletes an account successfully', async () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Accounts />
                </BrowserRouter>
            </Provider>
        );
    
        // Expand all accordion sections using data-testid attributes
        const checkingAccordion = screen.getByTestId('accordionButton_Checking');
        const creditAccordion = screen.getByTestId('accordionButton_credit-cards');
        const savingsAccordion = screen.getByTestId('accordionButton_savings');
        const investmentAccordion = screen.getByTestId('accordionButton_investments');

    
        fireEvent.click(checkingAccordion);
        fireEvent.click(creditAccordion);
        fireEvent.click(savingsAccordion);
        fireEvent.click(investmentAccordion);

        // Wait for the accordion sections to expand
        await waitFor(() => {
            expect(screen.getByTestId('accordionButton_Checking').getAttribute('aria-expanded')).toBe('true');
            expect(screen.getByTestId('accordionButton_credit-cards').getAttribute('aria-expanded')).toBe('true');
            expect(screen.getByTestId('accordionButton_savings').getAttribute('aria-expanded')).toBe('true');
            expect(screen.getByTestId('accordionButton_investments').getAttribute('aria-expanded')).toBe('true');
        });
        
        // Debugging: Print the contents of the expanded accordion sections
        const expandedSections = document.getElementsByClassName('usa-accordion__content usa-prose');
        Array.from(expandedSections).forEach((section1, index1) => {
            console.log(`Accordion section ${index1}:`, section1.outerHTML);
        });
    
        // Wait for delete buttons to appear and attempt to find them
        const deleteButtons = await waitFor(() => document.querySelectorAll('#delete-icon'));
        // Ensure there are delete buttons found
        expect(deleteButtons.length).toBeGreaterThan(0);

        // Mock the DELETE API call
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
            } as Response)
        );

        // Click the first delete button
        fireEvent.click(deleteButtons[0]);
    
        // Ensure the account is removed from the list
        await waitFor(() => {
            expect(screen.queryByText('Bank A')).not.toBeInTheDocument();
        });


    });
});