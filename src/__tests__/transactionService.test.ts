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
            accountId: 0,
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

    // it('should return an array with error message if vendor name is too long', () => {
    //     const transaction = {
    //         vendorName: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut',
    //         date: '2022-01-01',
    //         amount: 100,
    //         category: 'Food',
    //         accountId: '1234567890',
    //     };

    //     const errors = validateTransaction(transaction);

    //     expect(errors).toEqual(['Vendor name cannot exceed 100 characters.']);
    // });

    // it('should return an array with error message if date is in the future', () => {
    //     const transaction = {
    //         vendorName: 'Example Vendor',
    //         date: '2023-01-01',
    //         amount: 100,
    //         category: 'Food',
    //         accountId: '1234567890',
    //     };

    //     const errors = validateTransaction(transaction);

    //     expect(errors).toEqual(['Date cannot be in the future.']);
    // });

    // Add more test cases for other validation rules...
});