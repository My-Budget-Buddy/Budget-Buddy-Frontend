// TransactionsTable.tsx
import React from 'react';
import { Table, Icon } from '@trussworks/react-uswds';

const transactions = [
    { date: '02/20', name: 'Metro by T-Mobile', category: 'Bills & Utilities', amount: '30.00' },
    { date: '02/20', name: 'Publix', category: 'Groceries', amount: '15.85' },
    { date: '02/19', name: 'McDonalds', category: 'Dining Out', amount: '5.00' },
    { date: '02/18', name: 'Shell', category: 'Transportation', amount: '20.00' },
    { date: '02/18', name: 'Walmart', category: 'Groceries', amount: '50.00' },
];

const TransactionsTable: React.FC = () => {
    return (
        <div className="bg-transparent overflow-hidden w-full ">
            <Table fullWidth striped >
                <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Name</th>
                    <th scope="col">Category</th>
                    <th scope="col">Actions</th>
                    <th scope="col">Amount</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((transaction, index) => (
                    <tr key={index}>
                        <td>{transaction.date}</td>
                        <td>{transaction.name}</td>
                        <td>{transaction.category}</td>
                        <td>
                            <button className="mr-2">
                                <Icon.Edit />
                            </button>
                            <button>
                                <Icon.Delete />
                            </button>
                        </td>
                        <td><Icon.AttachMoney />{transaction.amount}</td>
                        <td><Icon.NavigateNext /></td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default TransactionsTable;
