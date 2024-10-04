import React, { act } from 'react';
import Transactions from "../src/pages/Transactions/Transactions";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import { createTransaction, deleteTransaction, getAccountsByUserId, getTransactionByUserId, getTransactionByVendor, updateTransaction, validateTransaction } from '../src/utils/transactionService';
import { TransactionCategory } from '../src/types/models';
import TransactionHistory from '../src/pages/Transactions/TransactionHistory';

// Mock the useTranslation hook and Trans component
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            if (key === 'locale') return 'en-US';
            return key;
        }
    }),
    Trans: ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</>,
}));

//mock the config file
jest.mock("../src/api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

// Mock the transactionService functions
jest.mock('../src/utils/transactionService');

//mock the focus trap react in order for tests to run
jest.mock('focus-trap-react', () => {
    return ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
});

// mock BarChar
jest.mock("@mui/x-charts", () => ({
    BarChart: jest.fn().mockImplementation(({ children }) => children)
}));

// Mock CategoryIcon
jest.mock('../src/components/CategoryIcon', () => ({
    __esModule: true,
    default: ({ category }: { category: string }) => <div data-testid="mock-category-icon">{category}</div>,
    categoryColors: {},
}));

// Mock formatCurrency and formatDate functions
jest.mock('../src/utils/helpers', () => ({
    formatCurrency: (amount: number | bigint) => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            currencySign: 'standard',
        });
        return formatter.format(amount);
    },
    formatDate: (dateString: any) => dateString,
}));

// Define mock implementations for the functions in transaction service
const mockGetTransactionByUserId = getTransactionByUserId as jest.MockedFunction<typeof getTransactionByUserId>;
const mockGetAccountsByUserId = getAccountsByUserId as jest.MockedFunction<typeof getAccountsByUserId>;
const mockCreateTransaction = createTransaction as jest.MockedFunction<typeof createTransaction>;
const mockUpdateTransaction = updateTransaction as jest.MockedFunction<typeof updateTransaction>;
const mockGetTransactionByVendor = getTransactionByVendor as jest.MockedFunction<typeof getTransactionByVendor>;

describe('Transactions', () => {
    beforeEach(() => {
        // Set up the mock responses
        mockGetTransactionByUserId.mockResolvedValue([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },

            {
                transactionId: 2,
                date: "2022-08-05",
                vendorName: 'OtherVendor',
                category: 'Dining' as TransactionCategory,
                amount: 500.0,
                description: "Another Transaction",
                accountId: 1,
                userId: 1,
            },

        ]);

        mockGetAccountsByUserId.mockResolvedValue([
            {
                id: 1,
                userId: '123',
                accountNumber: "Test Account",
                type: "CHECKING",
                routingNumber: "123456789",
                institution: "Heritage Bank",
                investmentRate: 0.01,
                startingBalance: 1000,
                currentBalance: 1000,
            },

            {
                id: 2,
                userId: '123',
                accountNumber: "Test Account",
                type: "CHECKING",
                routingNumber: "123456789",
                institution: "Keystone Bank",
                investmentRate: 0.01,
                startingBalance: 1000,
                currentBalance: 1000,
            },
        ]);

        mockCreateTransaction.mockResolvedValue({
            transactionId: 3,
            date: "2021-10-01",
            vendorName: 'VendorName',
            category: 'Groceries' as TransactionCategory,
            amount: 300.0,
            description: "New Transaction",
            accountId: 1,
            userId: 1,
        });

        mockGetTransactionByVendor.mockResolvedValue([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },
        ]);


        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );
    });

    //clearing all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('opens and submits edit transaction modal', async () => {
        // Mock the validateTransaction function to return no validation errors
        (validateTransaction as jest.Mock).mockReturnValue([]);

        // Mock the updateTransaction function to return an updated transaction upon submission
        (updateTransaction as jest.Mock).mockResolvedValueOnce([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },
        ]);

        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Open the edit transaction modal
        const editButtons = await screen.findAllByLabelText('edit-transaction-btn');
        fireEvent.click(editButtons[0]);

        // Modify the transaction description in the modal
        const editDescriptions = await screen.findAllByLabelText('edit-transaction-description');
        fireEvent.change(editDescriptions[0], { target: { value: 'Updated Description' } });

        // Submit the edit transaction form
        const editSubmitButtons = await screen.findAllByLabelText('edit-transactions.submit');
        fireEvent.click(editSubmitButtons[0]);

        // Wait for the updateTransaction function to be called after form submission
        await waitFor(() => {
            expect(mockUpdateTransaction).toHaveBeenCalled(); // Assert that the updateTransaction API was called
        });
    });




    it('opens and submits create transaction modal', async () => {
        // Mock the validateTransaction function to return no validation errors
        (validateTransaction as jest.Mock).mockReturnValue([]);

        // Define a mock transaction to simulate a successful creation response
        const mockTransactions = [
            {
                transactionId: 1,
                date: "2022-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },
        ];

        // Mock the createTransaction function to return the mock transactions when called
        (createTransaction as jest.Mock).mockResolvedValueOnce(mockTransactions);

        // Ensure that the date for the mock transaction is defined
        mockTransactions.forEach(transaction => {
            expect(transaction.date).toBeDefined();
        });

        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Open the create transaction modal
        const createButtons = await screen.findAllByLabelText('addTransactionModal');
        fireEvent.click(createButtons[0]);

        // Fill out the create transaction form

        // Change the amount in the form
        const createAmounts = await screen.findAllByLabelText('transactions-table.amount') as HTMLInputElement[];
        fireEvent.change(createAmounts[0], { target: { value: '200.0' } });

        // Change the date in the form
        const createDates = await screen.findAllByLabelText('create-transaction-date') as HTMLInputElement[];
        fireEvent.change(createDates[0], { target: { value: '2023-10-01' } });

        // Change the vendor name in the form
        const createVendors = await screen.findAllByLabelText('transactions-table.name') as HTMLInputElement[];
        fireEvent.change(createVendors[0], { target: { value: 'New Vendor' } });

        // Change the category in the form
        const createCategories = await screen.findAllByLabelText('transactions-table.category');
        fireEvent.change(createCategories[0] as HTMLInputElement, { target: { value: 'Income' } });

        // Submit the create transaction form
        const createSubmitButtons = await screen.findAllByLabelText('addTransactionBtn');
        fireEvent.click(createSubmitButtons[0]);

        // Wait for the createTransaction function to be called after form submission
        await waitFor(() => {
            expect(createTransaction).toHaveBeenCalled(); // Assert that the createTransaction API was called
        });
    });

    it('deletes a transaction', async () => {
        // Mock the deleteTransaction function to resolve with an empty array (simulating successful deletion)
        (deleteTransaction as jest.Mock).mockResolvedValueOnce([]);

        // Mock the retrieval of transactions by vendor to return a sample transaction
        mockGetTransactionByVendor.mockResolvedValue([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },
        ]);

        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Find all delete buttons in the rendered component
        const deleteButtons = await screen.findAllByLabelText('delete-transaction-btn');
        fireEvent.click(deleteButtons[0]);

        // Wait for the deleteTransaction function to be called
        await waitFor(() => {
            expect(deleteTransaction).toHaveBeenCalled(); // Assert that the deleteTransaction function was invoked
        });
    });


    it('renders the transaction details modal', async () => {
        // Mock the retrieval of transactions by vendor to return a sample transaction
        mockGetTransactionByVendor.mockResolvedValue([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },
        ]);

        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Find all detail buttons in the rendered component (e.g., buttons to view more details about a transaction)
        const detailsButtons = await screen.findAllByLabelText('transaction-arrow');
        // Simulate a click on the first details button to open the details modal
        fireEvent.click(detailsButtons[0]);

        // Wait for the transaction detail information to be rendered in the modal
        await waitFor(() => {
            // Verify that all elements with the label 'transactionDetailedInfo' are in the document
            screen.getAllByLabelText('transactionDetailedInfo').forEach(item => {
                expect(item).toBeInTheDocument();
            });
            screen.getAllByLabelText('viewHistory').forEach(item => {
                expect(item).toBeInTheDocument();
            });
        });
    });

    it('clicks the view history button', async () => {
        // Mock the retrieval of transactions by vendor to return a sample transaction
        mockGetTransactionByVendor.mockResolvedValue([
            {
                transactionId: 1,
                date: "2023-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 100.0,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },
        ]);

        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Find all detail buttons in the rendered component (e.g., buttons to view more details about a transaction)
        const detailsButtons = await screen.findAllByLabelText('transaction-arrow');
        // Simulate a click on the first details button to open the details modal
        fireEvent.click(detailsButtons[0]);

        // Wait for the transaction detail information to be rendered in the modal
        await waitFor(() => {
            // Verify that all elements with the label 'transactionDetailedInfo' are in the document
            screen.getAllByLabelText('transactionDetailedInfo').forEach(item => {
                expect(item).toBeInTheDocument();
            });
            screen.getAllByLabelText('viewHistory').forEach(item => {
                expect(item).toBeInTheDocument();
            });
        });

        // Find the view history button and click it
        const viewHistoryButton = screen.getByLabelText('viewHistory');
        fireEvent.click(viewHistoryButton);
        return (
            <MemoryRouter initialEntries={['/dashboard/transactions/VendorName']}>
                <Routes>
                    <Route path="/:first/:second/:name" element={<TransactionHistory />} />
                </Routes>
            </MemoryRouter>
        );
    });

    it('resets minDate and maxDate when dateFilter is not "date"', async () => {
        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    {/* Define the /transactions route to render the Transactions component */}
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Find the allDatesDropDown and change its value to "date"
        const allDatesDropDowns = screen.getAllByLabelText('allDatesDropDown');
        const allDatesDropDown = allDatesDropDowns[0];
        fireEvent.change(allDatesDropDown, { target: { value: 'date' } });

        // Check that the elements related to minDate and maxDate are in the document
        // Wait for the date range inputs (Min Date and Max Date) to appear
        const minDate = await screen.findByPlaceholderText('Min Date');
        const maxDate = await screen.findByPlaceholderText('Max Date');
        expect(minDate).toBeInTheDocument();
        expect(maxDate).toBeInTheDocument();

        // Change the value of allDatesDropDown to "all"
        fireEvent.change(allDatesDropDown, { target: { value: 'all' } });

        // Check that the elements related to minDate and maxDate are no longer in the document
        expect(minDate).not.toBeInTheDocument();
        expect(maxDate).not.toBeInTheDocument();
    });

    it('resets minAmount and maxAmount when amountFilter is not "amount"', async () => {
        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    {/* Define the /transactions route to render the Transactions component */}
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Find the allAmountsDropDown and change its value to "amount"
        const allAmountsDropDowns = screen.getAllByLabelText('allAmountsDropDown');
        const allAmountsDropDown = allAmountsDropDowns[0];
        fireEvent.change(allAmountsDropDown, { target: { value: 'amount' } });

        // Check that the elements related to minAmount and maxAmount are in the document
        // Wait for the amount range inputs (Min Amount and Max Amount) to appear
        const minAmount = await screen.findByPlaceholderText('Min Amount');
        const maxAmount = await screen.findByPlaceholderText('Max Amount');
        expect(minAmount).toBeInTheDocument();
        expect(maxAmount).toBeInTheDocument();

        // Change the value of allAmountsDropDown to "all"
        fireEvent.change(allAmountsDropDown, { target: { value: 'all' } });

        // Check that the elements related to minAmount and maxAmount are no longer in the document
        expect(minAmount).not.toBeInTheDocument();
        expect(maxAmount).not.toBeInTheDocument();
    });

    it('alerts the errors and returns when there are errors', async () => {
        // Spy on window.alert
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });

        // Render the component
        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    {/* Define the /transactions route to render the Transactions component */}
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Mock the validateTransaction function to return validation errors
        (validateTransaction as jest.Mock).mockReturnValue(['Amount is excessively large.']);

        // Define a mock transaction to simulate a successful creation response
        const mockTransactions = [
            {
                transactionId: 1,
                date: "2022-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 1000000000000,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },
        ];

        // Mock the createTransaction function to return the mock transactions when called
        (createTransaction as jest.Mock).mockResolvedValueOnce(mockTransactions);

        // Open the create transaction modal
        const createButtons = await screen.findAllByLabelText('addTransactionModal');
        fireEvent.click(createButtons[0]);

        // Fill out the create transaction form

        // Change the amount in the form
        const createAmounts = await screen.findAllByLabelText('transactions-table.amount') as HTMLInputElement[];
        fireEvent.change(createAmounts[0], { target: { value: '200.0' } });

        // Change the date in the form
        const createDates = await screen.findAllByLabelText('create-transaction-date') as HTMLInputElement[];
        fireEvent.change(createDates[0], { target: { value: '2023-10-01' } });

        // Change the vendor name in the form
        const createVendors = await screen.findAllByLabelText('transactions-table.name') as HTMLInputElement[];
        fireEvent.change(createVendors[0], { target: { value: 'New Vendor' } });

        // Change the category in the form
        const createCategories = await screen.findAllByLabelText('transactions-table.category');
        fireEvent.change(createCategories[0] as HTMLInputElement, { target: { value: 'Income' } });

        // Submit the create transaction form
        const createSubmitButtons = await screen.findAllByLabelText('addTransactionBtn');
        fireEvent.click(createSubmitButtons[0]);

        // Check that window.alert has been called with the joined errors
        expect(alertSpy).toHaveBeenCalledWith('Amount is excessively large.');

        // Clean up the spy
        alertSpy.mockRestore();
    });

    it('alerts the errors and returns when there are errors in edit transaction', async () => {
        // Spy on window.alert
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });

        // Render the component
        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    {/* Define the /transactions route to render the Transactions component */}
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Mock the validateTransaction function to return validation errors
        (validateTransaction as jest.Mock).mockReturnValue(['Amount is excessively large.']);

        // Define a mock transaction to simulate a successful creation response
        const mockTransactions = [
            {
                transactionId: 1,
                date: "2022-10-01",
                vendorName: 'VendorName',
                category: 'Income' as TransactionCategory,
                amount: 1000000000000,
                description: "Test Transaction",
                accountId: 1,
                userId: 1,
            },
        ];

        // Mock the createTransaction function to return the mock transactions when called
        (updateTransaction as jest.Mock).mockResolvedValueOnce(mockTransactions);

        // Open the edit transaction modal
        const editButtons = await screen.findAllByLabelText('edit-transaction-btn');
        fireEvent.click(editButtons[0]);

        // Modify the transaction description in the modal
        const editDescriptions = await screen.findAllByLabelText('edit-transaction-description');
        fireEvent.change(editDescriptions[0], { target: { value: 'Updated Description' } });

        // Submit the edit transaction form
        const editSubmitButtons = await screen.findAllByLabelText('edit-transactions.submit');
        fireEvent.click(editSubmitButtons[0]);

        // Check that window.alert has been called with the joined errors
        expect(alertSpy).toHaveBeenCalledWith('Amount is excessively large.');

        // Clean up the spy
        alertSpy.mockRestore();
    });


});






