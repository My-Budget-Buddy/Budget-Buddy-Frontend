import { render, screen, waitFor } from "@testing-library/react";
import W2Step from "../src/pages/Tax/w2Step";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// // mock react-redux hooks
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(), // used to send actions to the store
    useSelector: jest.fn() // used to read data from the store
}));

// Mock the API module
jest.mock('../src/pages/Tax/taxesAPI', () => ({
    findW2sByTaxReturnIdAPI: jest.fn(),
}));

const { findW2sByTaxReturnIdAPI } = require('../src/pages/Tax/taxesAPI');
const { useSelector } = require('../src/util/redux/store');

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
    },
]

// // since useSelector is used to only return state of W2 from redux store, we mock it to return the mockW2State
jest.mock('../src/util/redux/store', () => ({
    useSelector: jest.fn()
}));

// mock config
jest.mock("../src/api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock" // mock with localhost url
    }
}));

beforeEach(() => {
    render(
        <BrowserRouter>
            <W2Step />
        </BrowserRouter>
    );
});

describe('W2 Table ', () => {
    findW2sByTaxReturnIdAPI.mockResolvedValue({ data: mockW2State });
    useSelector.mockResolvedValue({ data: mockW2State});
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
        });
     });
});

// describe("Spending transactions fetch exception", () => {
//     it("should render the error message when transactions fetch fails", async () => {
//         getTransactionByUserId.mockRejectedValue(new Error("Error fetching transactions:"));
//         const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
//         await waitFor(() => {
//           expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching transactions:", expect.any(Error));
//         });
//     });
// });

// describe("W2")