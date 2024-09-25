import { TransactionCategory } from '../types/models';
import { validateTransaction, getTransactionByUserId, deleteTransaction, getAccountsByUserId, createTransaction, updateTransaction, getTransactionByVendor } from '../utils/transactionService';
import { createTransactionAPI, deleteTransactionAPI, getAccountsByUserIdAPI, getTransactionByUserIdAPI, getTransactionByVendorAPI, updateTransactionAPI } from "../pages/Tax/taxesAPI"; 
import { Transaction, Account } from "../types/models";

// Mock the API calls
jest.mock('../pages/Tax/taxesAPI');
jest.mock("../api/config", () => ({
  config: {
    apiUrl: "http://localhost:mock",
  },
}));

describe("API Functions", () => {
  const mockTransaction: Transaction = {
    transactionId: 1,
    userId: 1,
    vendorName: 'Vendor',
    amount: 100,
    date: '2022-01-01',
    category: "Category" as TransactionCategory,
    accountId: 1,
    description: 'Description',
  };

const mockAccount: Account = {
    id: 1,
    userId: '123',
    accountNumber: "Test Account",
    type: "CHECKING",
    routingNumber: "123456789",
    institution: "Test Bank",
    investmentRate: 0.01,
    startingBalance: 1000,
    currentBalance: 1000,
};

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getTransactionByUserId should return transactions for a user", async () => {
    (getTransactionByUserIdAPI as jest.Mock).mockResolvedValue({ data: [mockTransaction] });

    const result = await getTransactionByUserId(1);
    
    expect(getTransactionByUserIdAPI).toHaveBeenCalledWith(1);
    expect(result).toEqual([mockTransaction]);
  });

  test("deleteTransaction should call deleteTransactionAPI with correct id", async () => {
    await deleteTransaction(1);

    expect(deleteTransactionAPI).toHaveBeenCalledWith(1);
  });

  test("getAccountsByUserId should return accounts for a user", async () => {
    (getAccountsByUserIdAPI as jest.Mock).mockResolvedValue({ data: [mockAccount] });

    const result = await getAccountsByUserId(1);

    expect(getAccountsByUserIdAPI).toHaveBeenCalledWith(1);
    expect(result).toEqual([mockAccount]);
  });

test("createTransaction should create a new transaction", async () => {
    const newTransaction = {
        id: 1,
        vendorName: "Vendor",
        amount: 100,
        date: '2022-01-01',
        category: "Category" as TransactionCategory,
        userId: 123, // Add userId
        accountId: 1, // Add accountId
        description: 'Description' // Add description
    };
    (createTransactionAPI as jest.Mock).mockResolvedValue({ data: mockTransaction });

    const result = await createTransaction(newTransaction);

    expect(createTransactionAPI).toHaveBeenCalledWith(newTransaction);
    expect(result).toEqual(mockTransaction);
});

  test("updateTransaction should update an existing transaction", async () => {
    (updateTransactionAPI as jest.Mock).mockResolvedValue({ data: mockTransaction });

    const result = await updateTransaction(mockTransaction);

    expect(updateTransactionAPI).toHaveBeenCalledWith(mockTransaction.transactionId, mockTransaction);
    expect(result).toEqual(mockTransaction);
  });

  test("getTransactionByVendor should return transactions for a specific vendor", async () => {
    (getTransactionByVendorAPI as jest.Mock).mockResolvedValue({ data: [mockTransaction] });

    const result = await getTransactionByVendor("Vendor");

    expect(getTransactionByVendorAPI).toHaveBeenCalledWith("Vendor");
    expect(result).toEqual([mockTransaction]);
  });
});



describe('validateTransaction', () => {
    it('should return an empty array if all fields are valid', () => {
        const transaction = {
            vendorName: 'Example Vendor',
            date: '2022-01-01',
            amount: 100,
            category: 'Dining' as TransactionCategory, // Fix: Cast category to TransactionCategory
            accountId: 1234567890, // Updated accountId to be a number
            userId: 123, // Updated userId to be a number
            description: 'Example transaction',
        };

        const errors = validateTransaction(transaction);

        expect(errors).toEqual([]);
    });

    it('should return an array with error messages if fields are invalid', () => {
        const transaction = {
            vendorName: '',
            date: '2022-01-01',
            amount: -100,
            category: 'Invalid Category' as TransactionCategory,
            accountId: NaN,
            userId: 123,
            description: 'Example transaction',
        };

        const errors = validateTransaction(transaction);

        expect(errors).toEqual([
            'Vendor name is required.',
            'Amount must be greater than zero.',
            'Invalid category.',
            'Account is required.',
        ]);
    });

    it('should return an array with error message if vendor name is too long and date is empty', () => {
        const transaction = {
            vendorName: 'Trying to test if this vendor name is too long and exceeds the 100 character limit. This is a very long vendor name that should not be allowed.',
            date: '',
            amount: 100,
            category: 'Groceries' as TransactionCategory,
            accountId: 1234567890,
            userId: 123,
            description: 'Example transaction',
        };

        const errors = validateTransaction(transaction);

        expect(errors).toEqual([
            'Vendor name cannot exceed 100 characters.',
            'Date is required.',]);
    });

    it('should return an array with error message if date is in the future', () => {
        const transaction = {
            vendorName: 'Example Vendor',
            date: '2026-01-01',
            amount: 1000000000000,
            category: 'Income' as TransactionCategory,
            accountId: 1234567890,
            userId: 123,
            description: 'Example transaction',
        };

        const errors = validateTransaction(transaction);

        expect(errors).toEqual([
            'Date cannot be in the future.',
            'Amount is excessively large.']);
    });

    it('should return an array with error message if vendor name and category are empty', () => {
        const transaction = {
            vendorName: '',
            date: '2023-01-01',
            amount: 100,
            category: '' as TransactionCategory,
            accountId: 1234567890,
            userId: 123,
            description: 'Example transaction',
        };

        const errors = validateTransaction(transaction);

        expect(errors).toEqual([
            'Vendor name is required.',
            'Category is required.',
            'Invalid category.',]);
    });

    it('should return an array with error message if date in invalid', () => {
        const transaction = {
            vendorName: 'vendor',
            date: 'invalid date',
            amount: 100,
            category: 'Dining' as TransactionCategory,
            accountId: 1234567890,
            userId: 123,
            description: 'Example transaction',
        };

        const errors = validateTransaction(transaction);

        expect(errors).toEqual([
            'Date is invalid.',]);
    });

});