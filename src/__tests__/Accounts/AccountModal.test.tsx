import { render, screen, fireEvent } from "@testing-library/react";
import AccountModal from "../../pages/Accounts/AccountModal";
import { BrowserRouter as Router } from 'react-router-dom';
import Account from "../../pages/Accounts/Accounts";
import '@testing-library/jest-dom';
import { act, ReactNode } from "react";
import { gaugeClasses } from "@mui/x-charts";


/*Testing with Jest
#1 Look over the actual component and identify the elements you want to test.
#2 Figure out which components are dependencies to run the test.
#3 Render the page and after each clear all mocks
#2 Write a test that renders the component and uses the getByText or getByLabelText query to find the elements you want to test.
#3 

*/
// Mock useAuthentication to avoid errors
jest.mock("../../contexts/AuthenticationContext", () => ({
    useAuthentication: () => ({ jwt: "mocked-jwt-token" })
}));

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

//Mocks api request
jest.mock("../../api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

//since rendering Accounts, need to mock all charts
jest.mock("@mui/x-charts", () => ({
    AxisConfig: jest.fn().mockImplementation(({ children }) => children),
}));

jest.mock("@mui/x-charts/Gauge", () => ({
    Gauge: jest.fn().mockImplementation(({ children }) => children),
    gaugeClasses: jest.fn().mockImplementation(({ children }) => children),
}));

jest.mock("@mui/x-charts/PieChart", () => ({
    PieChart: jest.fn().mockImplementation(({ children }) => children),
}));

jest.mock("@mui/x-charts/LineChart", () => ({
    LineChart: jest.fn().mockImplementation(({ children }) => children),
}));


//jest.mock('../../pages/Accounts/Accounts', () => () => <div>Mocked Account Component</div>);

describe("AccountModal Component", () => {
    beforeEach(() => {
        render(
            <Router>
                <Account />
            </Router>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders and opens the modal", async () => {
        const { getByText, getByLabelText } = render(
            <AccountModal onAccountAdded={jest.fn()} />
        );

        // Find the "Add Account" button and click it to open the modal
        const openButton = getByText(/add-account/i);
        await act(async () => {
            fireEvent.click(openButton);
        });

        // Verify the modal heading and inputs
        const modalHeading = getByText(/enter-account/i);
        expect(modalHeading).toBeInTheDocument();

        const accountTypeInput = getByLabelText(/account-type/i);
        expect(accountTypeInput).toBeInTheDocument();
    });
});


// Mock Modal and other components from @trussworks/react-uswds


// jest.mock('@trussworks/react-uswds', () => ({
//     Label: ({ children, htmlFor }: any) => (
//         <label htmlFor={htmlFor}>
//             {children}
//         </label>
//     ),
//     Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
//     Modal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
//     ModalToggleButton: ({ children, modalRef, ...rest }: { children: ReactNode, modalRef: any }) => <button {...rest}>{children}</button>,
//     Button: ({ children }: { children: ReactNode }) => <button>{children}</button>,
//     TextInput: (props: any) => <input {...props} />,
//     Select: (props: any) => <select {...props} />,
//     Fieldset: ({ children }: { children: ReactNode }) => <fieldset>{children}</fieldset>,
//     ButtonGroup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
//     ModalFooter: ({ children }: { children: ReactNode }) => <footer>{children}</footer>,
//     ModalHeading: ({ children }: { children: ReactNode }) => <h1>{children}</h1>,
//     Alert: ({ children }: { children: ReactNode }) => <div>{children}</div>
// }));

// describe("AccountModal Component", () => {
//     it("renders and opens the modal", async () => {
//         // Render the AccountModal component directly
//         const { getByText, getByLabelText } = render(
//             <AccountModal onAccountAdded={jest.fn()} />
//         );

//         // Find the "Add Account" button and click it to open the modal
//         const openButton = getByText(/add-account/i);
//         await act(async () => {
//             fireEvent.click(openButton);
//         });

//         // Verify that the modal is rendered
//         const modalHeading = getByText(/enter-account/i);
//         expect(modalHeading).toBeInTheDocument();

//         // Verify that the account type input is rendered
//         const accountTypeInput = getByLabelText(/account-type/i);
//         expect(accountTypeInput).toBeInTheDocument();

//         // Fill in the form inputs
//         fireEvent.change(accountTypeInput, { target: { value: 'CHECKING' } });
//         fireEvent.change(getByLabelText(/institution/i), { target: { value: 'Test Bank' } });
//         fireEvent.change(getByLabelText(/account-number/i), { target: { value: '12345678' } });

//         // Submit the form
//         const submitButton = getByText(/add/i);
//         await act(async () => {
//             fireEvent.click(submitButton);
//         });

//         // You can add more assertions here to verify if the API was called or if the modal closed
//     });
// });