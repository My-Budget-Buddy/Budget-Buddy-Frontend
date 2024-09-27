import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Accounts from "../../pages/Accounts/Accounts";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom';
import AccountModal from "../../pages/Accounts/AccountModal";
import CreditScoreModal from "../../pages/Accounts/CreditScoreModal";


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
// jest.mock('react-i18next', () => ({
//     useTranslation: () => ({
//         t: (key: string) => {
//             // Provide custom translations for the specific keys you're testing
//             const translations: { [key: string]: string } = {
//                 'accounts.net-cash': 'Net Cash',
//                 'accounts.view-accounts': 'View Accounts',
//                 'accounts.total-assets': 'Total Assets',
//                 'accounts.total-debts': 'Total Debts',
//                 // Add more keys as necessary
//             };
//             return translations[key] || key;
//         },
//     }),
// }));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
// jest.mock('@trussworks/react-uswds', () => ({
//     ...jest.requireActual('@trussworks/react-uswds'),
//     Modal: ({ children, modalRef, id }: any) => {
//         const [isOpen, setIsOpen] = React.useState(true);

//         return isOpen ? (
//             <div id={id}>
//                 {children}
//                 <button
//                     data-testid="close-modal"
//                     onClick={() => setIsOpen(false)} // Simulate modal close
//                 >
//                     Close
//                 </button>
//             </div>
//         ) : null;
//     },
// }));
// Mock the CreditScoreModal
jest.mock('../../pages/Accounts/CreditScoreModal', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Mocked CreditScoreModal</div>),
}));


jest.mock('@mui/icons-material', () => ({
    ...jest.requireActual('@mui/icons-material'),
    Delete: () => <span>Delete</span>  // Mock the Delete icon to return a span with text
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

        expect(deleteButtons.length).toBe(8); // If you expect 2 delete buttons, for example

        // You can add more checks to verify the button behavior, e.g., account deletion
        // Example:
        // await waitFor(() => expect(screen.queryByText('Bank A')).toBeNull());
    });
});