// TransactionsTable.tsx
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState} from 'react';
import {Table, Icon, Card, CardHeader, CardBody, CardGroup} from '@trussworks/react-uswds';

interface Transaction {
    id: number;
    date: string;
    name: string;
    category: string;
    amount: number;
    note: string;
    account: string;
}

const transactionsInit: Transaction[] = [
    { id: 1, date: '02/20', name: 'Metro by T-Mobile', category: 'Bills & Utilities', amount: 30.00, note: '', account: '***1703' },
    { id: 2, date: '02/20', name: 'Publix', category: 'Groceries', amount: 15.85, note: '', account: '***6612' },
    { id: 3, date: '02/19', name: 'McDonalds', category: 'Dining Out', amount: 5.00, note: '', account: '***3231' },
    { id: 4, date: '02/18', name: 'Shell', category: 'Transportation', amount: 20.00, note: '', account: '***1703' },
    { id: 5, date: '02/18', name: 'Walmart', category: 'Groceries', amount: 50.00, note: '', account: '***6612' },
];

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

const TransactionsTable: React.FC = () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [transactions, setTransactions] = useState<Transaction[]>(transactionsInit);

    return (
        <CardGroup>
            <Card gridLayout={{col: 12}}>
                <CardHeader className="flex justify-center mb-5">
                    <h1>List of Transactions</h1>
                </CardHeader>
                <CardBody>
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
                </CardBody>
            </Card>
        </CardGroup>
    );
};

export default TransactionsTable;
