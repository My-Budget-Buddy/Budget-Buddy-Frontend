// Import necessary models and utility functions
import { TransactionCategory, Transaction, Account } from "../../types/models";
import {
    validateTransaction,
    getTransactionByUserId,
    deleteTransaction,
    getAccountsByUserId,
    createTransaction,
    updateTransaction,
    getTransactionByVendor
} from "../transactionService";
import {
    createTransactionAPI,
    deleteTransactionAPI,
    getAccountsByUserIdAPI,
    getTransactionByUserIdAPI,
    getTransactionByVendorAPI,
    updateTransactionAPI
} from "../taxesAPI";

// Mock the API calls
jest.mock("../taxesAPI"); // Mock API calls in `taxesAPI`
jest.mock("../config", () => ({
    config: {
        apiUrl: "http://localhost:mock" // Mock the API URL to avoid actual HTTP requests
    }
}));

// Group the tests for API functions in a single `describe` block
describe("API Functions", () => {
    // Mock transaction object used in the tests
    const mockTransaction: Transaction = {
        transactionId: 1,
        userId: 1,
        vendorName: "Vendor",
        amount: 100,
        date: "2022-01-01",
        category: "Category" as TransactionCategory,
        accountId: 1,
        description: "Description"
    };

    // Mock account object used in the tests
    const mockAccount: Account = {
        id: 1,
        userId: "123",
        accountNumber: "Test Account",
        type: "CHECKING",
        routingNumber: "123456789",
        institution: "Test Bank",
        investmentRate: 0.01,
        startingBalance: 1000,
        currentBalance: 1000
    };

    // Clear mocks after each test to avoid state leakage
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test case for `getTransactionByUserId`
    test("getTransactionByUserId should return transactions for a user", async () => {
        // Mock resolved value of the API call
        (getTransactionByUserIdAPI as jest.Mock).mockResolvedValue({ data: [mockTransaction] });

        // Call the service function
        const result = await getTransactionByUserId(1);

        // Assert that API call was made with the correct userId
        expect(getTransactionByUserIdAPI).toHaveBeenCalledWith(1);
        // Assert that the result matches the mock transaction
        expect(result).toEqual([mockTransaction]);
    });

    // Test case for `deleteTransaction`
    test("deleteTransaction should call deleteTransactionAPI with correct id", async () => {
        // Call the service function to delete a transaction
        await deleteTransaction(1);

        // Assert that API call was made with the correct transaction id
        expect(deleteTransactionAPI).toHaveBeenCalledWith(1);
    });

    // Test case for `getAccountsByUserId`
    test("getAccountsByUserId should return accounts for a user", async () => {
        // Mock resolved value of the API call
        (getAccountsByUserIdAPI as jest.Mock).mockResolvedValue({ data: [mockAccount] });

        // Call the service function
        const result = await getAccountsByUserId(1);

        // Assert that API call was made with the correct userId
        expect(getAccountsByUserIdAPI).toHaveBeenCalledWith(1);
        // Assert that the result matches the mock account
        expect(result).toEqual([mockAccount]);
    });

    // Test case for `createTransaction`
    test("createTransaction should create a new transaction", async () => {
        const newTransaction = {
            id: 1,
            vendorName: "Vendor",
            amount: 100,
            date: "2022-01-01",
            category: "Category" as TransactionCategory,
            userId: 123, // Add userId
            accountId: 1, // Add accountId
            description: "Description" // Add description
        };

        // Mock resolved value of the API call
        (createTransactionAPI as jest.Mock).mockResolvedValue({ data: mockTransaction });

        // Call the service function to create a transaction
        const result = await createTransaction(newTransaction);

        // Assert that API call was made with the correct transaction details
        expect(createTransactionAPI).toHaveBeenCalledWith(newTransaction);
        // Assert that the result matches the mock transaction
        expect(result).toEqual(mockTransaction);
    });

    // Test case for `updateTransaction`
    test("updateTransaction should update an existing transaction", async () => {
        // Mock resolved value of the API call
        (updateTransactionAPI as jest.Mock).mockResolvedValue({ data: mockTransaction });

        // Call the service function to update a transaction
        const result = await updateTransaction(mockTransaction);

        // Assert that API call was made with the correct transactionId and updated transaction details
        expect(updateTransactionAPI).toHaveBeenCalledWith(mockTransaction.transactionId, mockTransaction);
        // Assert that the result matches the mock transaction
        expect(result).toEqual(mockTransaction);
    });

    // Test case for `getTransactionByVendor`
    test("getTransactionByVendor should return transactions for a specific vendor", async () => {
        // Mock resolved value of the API call
        (getTransactionByVendorAPI as jest.Mock).mockResolvedValue({ data: [mockTransaction] });

        // Call the service function to get transactions by vendor
        const result = await getTransactionByVendor("Vendor");

        // Assert that API call was made with the correct vendor name
        expect(getTransactionByVendorAPI).toHaveBeenCalledWith("Vendor");
        // Assert that the result matches the mock transaction
        expect(result).toEqual([mockTransaction]);
    });
});

// Group the tests for `validateTransaction` in a single `describe` block
describe("validateTransaction", () => {
    // Test case where all fields are valid
    it("should return an empty array if all fields are valid", () => {
        const transaction = {
            vendorName: "Example Vendor",
            date: "2022-01-01",
            amount: 100,
            category: "Dining" as TransactionCategory, // Fix: Cast category to TransactionCategory
            accountId: 1234567890, // Updated accountId to be a number
            userId: 123, // Updated userId to be a number
            description: "Example transaction"
        };

        // Call the validation function
        const errors = validateTransaction(transaction);

        // Assert that no validation errors were found
        expect(errors).toEqual([]);
    });

    // Test case where invalid fields are provided
    it("should return an array with error messages if fields are invalid", () => {
        const transaction = {
            vendorName: "",
            date: "2022-01-01",
            amount: -100,
            category: "Invalid Category" as TransactionCategory,
            accountId: NaN,
            userId: 123,
            description: "Example transaction"
        };

        // Call the validation function
        const errors = validateTransaction(transaction);

        // Assert that validation errors match expected messages
        expect(errors).toEqual([
            "Vendor name is required.",
            "Amount must be greater than zero.",
            "Invalid category.",
            "Account is required."
        ]);
    });

    // Test case for long vendor name and empty date
    it("should return an array with error message if vendor name is too long and date is empty", () => {
        const transaction = {
            vendorName:
                "Trying to test if this vendor name is too long and exceeds the 100 character limit. This is a very long vendor name that should not be allowed.",
            date: "",
            amount: 100,
            category: "Groceries" as TransactionCategory,
            accountId: 1234567890,
            userId: 123,
            description: "Example transaction"
        };

        // Call the validation function
        const errors = validateTransaction(transaction);

        // Assert that validation errors match expected messages
        expect(errors).toEqual(["Vendor name cannot exceed 100 characters.", "Date is required."]);
    });

    // Test case for date in the future
    it("should return an array with error message if date is in the future", () => {
        const transaction = {
            vendorName: "Example Vendor",
            date: "2026-01-01",
            amount: 1000000000000,
            category: "Income" as TransactionCategory,
            accountId: 1234567890,
            userId: 123,
            description: "Example transaction"
        };

        // Call the validation function
        const errors = validateTransaction(transaction);

        // Assert that validation errors match expected messages
        expect(errors).toEqual(["Date cannot be in the future.", "Amount is excessively large."]);
    });

    // Test case for empty vendor name and category
    it("should return an array with error message if vendor name and category are empty", () => {
        const transaction = {
            vendorName: "",
            date: "2023-01-01",
            amount: 100,
            category: "" as TransactionCategory,
            accountId: 1234567890,
            userId: 123,
            description: "Example transaction"
        };

        // Call the validation function
        const errors = validateTransaction(transaction);

        // Assert that validation errors match expected messages
        expect(errors).toEqual(["Vendor name is required.", "Category is required.", "Invalid category."]);
    });
});
