import TransactionsTable from "../../components/TransactionsTable/TransactionsTable.tsx";
import { Button } from '@trussworks/react-uswds';

const Transactions: React.FC = () => {
    return (

        //Parent Container
        <div className="min-h-screen bg-gray-100 p-4 pr-10 pl-10 flex flex-col gap-6">

            {/* Top Container */}
            <div className="flex justify-between items-center bg-transparent p-4 ">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <div className="flex gap-4">
                    <Button type="button" className="usa-button--secondary">Clear Filters</Button>
                    <select className="p-2 border rounded">
                        <option>Sort by date</option>
                        <option>Sort by amount</option>
                    </select>
                    <Button type="button" className="usa-button">Add Transaction</Button>
                </div>
            </div>

            {/* Middle Container */}
            <div className="flex justify-center items-center gap-4 bg-transparent p-4">
                <select className="p-2 w-40">
                    <option>All dates</option>
                </select>
                <select className="p-2 w-40">
                    <option>All Categories</option>
                    <option>Food</option>
                    <option>Transportation</option>
                    <option>Utilities</option>
                    <option>Entertainment</option>
                </select>
                <select className="p-2 w-40"  >
                    <option>All Accounts</option>
                    <option>Bank of America</option>
                    <option>Chase</option>
                    <option>Discover</option>

                </select>
                <select className="p-2 w-40">
                    <option>All Amounts</option>
                </select>
            </div>

            {/* Bottom Container */}
            <div className="flex-grow">
                <TransactionsTable />
            </div>
        </div>
    );
};


export default Transactions;