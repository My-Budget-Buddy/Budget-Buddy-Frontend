import Transactions from "../pages/Transactions/Transactions";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('../utils/transactionService');
jest.mock('../pages/Tax/taxesAPI');

//Mock the useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

beforeEach(() => {
    render(
        <Router>
            <Transactions />
        </Router>
    );
});

afterEach(() => {
    jest.clearAllMocks();
});

it('renders without crashing', () => {
    expect(screen.getByText('transactions.title')).toBeInTheDocument();
});