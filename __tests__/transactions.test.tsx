import React, { act } from 'react';
import Transactions from "../src/pages/Transactions/Transactions";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import { createTransaction, deleteTransaction, getAccountsByUserId, getTransactionByUserId, getTransactionByVendor, updateTransaction, validateTransaction } from '../src/utils/transactionService';
import { TransactionCategory } from '../src/types/models';
import exp from 'constants';
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

    //renders transactions title 
    it('renders without crashing', () => {
        expect(screen.getByLabelText('transactionsTitle')).toBeInTheDocument();
    });

    //renders the filter transactions button
    it('renders the clear filters button', () => {
        expect(screen.getByLabelText('clearFilters')).toBeInTheDocument();
    });

    it('clicks the clear filters button', async () => {
        // Find the clear filters button and click it
        const clearFiltersButton = screen.getByLabelText('clearFilters');
        fireEvent.click(clearFiltersButton);

        const categoryDropdown = screen.getByLabelText('allCategoriesDropDown') as HTMLSelectElement;
        const accountDropdown = screen.getByLabelText('allAccountDropDown') as HTMLSelectElement;

        // Wait for the clear filters button to be clicked
        await waitFor(() => {
            // Check that the clear filters button was clicked
            expect(categoryDropdown.value).toBe('All Categories');
            expect(accountDropdown.value).toBe('All Accounts');
        });
    });

    //renders the sort transactions button
    it('renders the sort transactions button', () => {
        expect(screen.getByLabelText('sortTransactions')).toBeInTheDocument();
    });
        

    //renders the sort by direction button
    it('renders the sort direction button', () => {
        expect(screen.getByLabelText('sortDirection')).toBeInTheDocument();
    });


    //renders the add transaction modal button
    it('renders the add transaction modal button', () => {
        expect(screen.getByLabelText('addTransactionBtn')).toBeInTheDocument();
    });


    it('sorts transactions by amount and ascending', async () => {
        // Find the sort transactions button and click it
        const sortTransactionsButtons = screen.getAllByLabelText('sortTransactions');
        const sortTransactionsButton = sortTransactionsButtons[0];
        fireEvent.click(sortTransactionsButton);
        fireEvent.change(sortTransactionsButton, { target: { value: 'amount' } });


        // Find the sort direction dropdown and change its value
        const sortDirectionDropdown = screen.getByLabelText('sortDirection');
        fireEvent.change(sortDirectionDropdown, { target: { value: 'asc' } });
        // Wait for the transactions to be sorted by amount
        // Check that the transactions are sorted by amount
        const amounts = await screen.findAllByText(/\$\d+\.\d{2}/);
        expect(amounts[0]).toHaveTextContent('$500.00');
        expect(amounts[1]).toHaveTextContent('$100.00');
    });

    it('sorts transactions by date', async () => {

        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    {/* Define the /transactions route to render the Transactions component */}
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );
        
        // Find the sort transactions button and click it
        const sortTransactionsButtons = screen.getAllByLabelText('sortTransactions');
        const sortTransactionsButton = sortTransactionsButtons[0];
        fireEvent.click(sortTransactionsButton);
        fireEvent.change(sortTransactionsButton, { target: { value: 'date' } });

        // Wait for the transactions to be sorted by date
        // Check that the transactions are sorted by date
        const dates = await screen.findAllByText(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
        expect(dates[0]).toHaveTextContent('2023-10-01');
        expect(dates[1]).toHaveTextContent('2022-08-05');
    });


    it('shows no transactions message when list is empty', async () => {
        // Update mock to return an empty transactions list when getTransactionByUserId is called
        (getTransactionByUserId as jest.Mock).mockResolvedValueOnce([]);

        // Render the component using MemoryRouter to simulate the route '/transactions'
        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    {/* Define the /transactions route to render the Transactions component */}
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Wait for the "no transactions" message to appear on the screen
        await waitFor(() => {
            // Check that the element with the 'noTransactions' aria-label is present in the document
            expect(screen.getByLabelText('noTransactions')).toBeInTheDocument();
        });
    });

    it('displays transactions table when data is available', async () => {
        // Mock the getTransactionByUserId function to return a non-empty list of transactions
        (getTransactionByUserId as jest.Mock).mockResolvedValueOnce([
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

        // Wait for the transactions table elements to appear
        await waitFor(() => {
            // Check that the 'date' header is displayed in the transactions table
            screen.getAllByText('transactions-table.date').forEach(item => {
                expect(item).toBeInTheDocument();
            });

            // Check that the 'name' header is displayed in the transactions table
            screen.getAllByText('transactions-table.name').forEach(item => {
                expect(item).toBeInTheDocument();
            });

            // Check that the 'category' header is displayed in the transactions table
            screen.getAllByText('transactions-table.category').forEach(item => {
                expect(item).toBeInTheDocument();
            });

            // Check that the 'amount' header is displayed in the transactions table
            screen.getAllByText('transactions-table.amount').forEach(item => {
                expect(item).toBeInTheDocument();
            });
        });
    });

    it('renders transaction rows with correct data', async () => {
        // Mock the getTransactionByUserId function to return a list with one transaction
        (getTransactionByUserId as jest.Mock).mockResolvedValueOnce([
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

        // Wait for the transaction rows to appear with the correct data
        await waitFor(() => {
            // Check that the vendor name 'VendorName' is rendered in the table
            screen.getAllByText('VendorName').forEach(item => {
                expect(item).toBeInTheDocument();
            });

            // Check that the transaction amount '$100.00' is rendered in the table
            screen.getAllByText('$100.00').forEach(item => {
                expect(item).toBeInTheDocument();
            });

            // Check that the transaction category 'Income' is rendered in the table
            screen.getAllByText('Income').forEach(item => {
                expect(item).toBeInTheDocument();
            });
        });
    });


    it('filters transactions by category', async () => {
        // Mock the getTransactionByUserId function to return a list of transactions with different categories
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

            //Second transaction with different information
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

        // Wait for the category dropdown and transactions to be rendered
        await waitFor(() => {
            // Select the dropdown element for filtering by category
            const categorySelect = screen.getByLabelText('allCategoriesDropDown');

            // Simulate selecting the 'Income' category from the dropdown
            fireEvent.change(categorySelect, { target: { value: 'Income' } });

            // Check that the transaction with the 'Income' category (VendorName) is displayed
            expect(screen.getByText('VendorName')).toBeInTheDocument();

            // Check that the transaction with the 'Dining' category (OtherVendor) is not displayed
            expect(screen.queryByText('OtherVendor')).not.toBeInTheDocument();
        });
    });



    it('filters transactions by account', async () => {
        // Mock the getTransactionByUserId function to return two transactions, each associated with different accounts
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
            //second transaction with different information
            {
                transactionId: 2,
                date: "2022-08-05",
                vendorName: 'OtherVendor',
                category: 'Dining' as TransactionCategory,
                amount: 500.0,
                description: "Another Transaction",
                accountId: 2,
                userId: 1,
            },
        ]);

        // Mock the getAccountsByUserId function to return two accounts, each from a different institution
        mockGetAccountsByUserId.mockResolvedValue([
            {
                id: 1,
                userId: '123',
                accountNumber: "Test Account",
                type: "CHECKING",
                routingNumber: "123456789",
                institution: "Heritage Bank",  // First account institution (Heritage Bank)
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
                institution: "Keystone Bank",  // Second account institution (Keystone Bank)
                investmentRate: 0.01,
                startingBalance: 1000,
                currentBalance: 1000,
            },
        ]);

        // Wait for the account dropdown and accounts to be rendered
        await waitFor(() => {
            // Select the dropdown element for filtering by account
            const accountSelect = screen.getByLabelText('allAccountDropDown');

            // Simulate selecting 'Heritage Bank' from the dropdown
            fireEvent.change(accountSelect, { target: { value: 'Heritage Bank' } });

            // Check that transactions related to 'Heritage Bank' are displayed
            const heritageBankNames = screen.getAllByText('Heritage Bank');
            expect(heritageBankNames[0]).toBeInTheDocument();
        });
    });


    it('filters transactions by date', async () => {
        // Mock the getTransactionByUserId function to return two transactions with different dates
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
            //second transaction with different information
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

        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Wait for the date filter dropdown and date inputs to be rendered
        await waitFor(async () => {
            // Get the date dropdown
            const datesDropDowns = screen.getAllByLabelText('allDatesDropDown');
            const dateDropDown = datesDropDowns[0];

            // Simulate changing the filter dropdown to 'date'
            fireEvent.change(dateDropDown, { target: { value: 'date' } });

            // Wait for the date range inputs (Min Date and Max Date) to appear
            const minDate = await screen.findByPlaceholderText('Min Date');
            const maxDate = await screen.findByPlaceholderText('Max Date');

            // Simulate setting the min and max date filters
            fireEvent.change(minDate, { target: { value: '2023-10-01' } });
            fireEvent.change(maxDate, { target: { value: '2023-10-05' } });

            // Assert that the input values were correctly updated
            expect(minDate).toHaveValue('2023-10-01');
            expect(maxDate).toHaveValue('2023-10-05');

            // Check that the transaction with the matching date ('2023-10-01') is displayed
            const vendorNames = screen.getAllByText('VendorName');
            const vendorName = vendorNames[0];
            expect(vendorName).toBeInTheDocument();
        });
    });

    it('filters transactions by amount', async () => {
        // Mock the getTransactionByUserId function to return two transactions with different amounts
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

        render(
            <MemoryRouter initialEntries={['/transactions']}>
                <Routes>
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Wait for the amount filter dropdown and inputs to be rendered
        await waitFor(async () => {
            // Get the amount filter dropdown 
            const amountDropDowns = screen.getAllByLabelText('allAmountsDropDown');
            const amountDropDown = amountDropDowns[0];

            // Simulate changing the filter dropdown to 'amount'
            fireEvent.change(amountDropDown, { target: { value: 'amount' } });

            // Wait for the amount range inputs (Min Amount and Max Amount) to appear
            const minAmount = await screen.findByPlaceholderText('Min Amount');
            const maxAmount = await screen.findByPlaceholderText('Max Amount');

            // Simulate setting the min and max amount filters
            fireEvent.change(minAmount, { target: { value: '100' } });
            fireEvent.change(maxAmount, { target: { value: '200' } });

            // Assert that the input values were correctly updated
            expect(minAmount).toHaveValue(100);
            expect(maxAmount).toHaveValue(200);

            // Check that the transaction with an amount within the range (100.0) is displayed
            const vendorNames = screen.getAllByText('VendorName');
            const vendorName = vendorNames[0];
            expect(vendorName).toBeInTheDocument();
        });
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
                    <Route path="/:first/:second/:name" element={<TransactionHistory/>} />
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


});






