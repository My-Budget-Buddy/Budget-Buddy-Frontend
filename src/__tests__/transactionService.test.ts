import { TransactionCategory } from '../types/models';
import { validateTransaction } from '../utils/transactionService';

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

});