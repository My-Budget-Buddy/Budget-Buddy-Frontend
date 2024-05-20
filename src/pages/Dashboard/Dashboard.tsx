import { LineChart, Gauge } from "@mui/x-charts";
import { Accordion, Table, Icon, Button, ModalToggleButton, Modal, ModalRef } from "@trussworks/react-uswds";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface AccountTotals {
    checking?: number;
    credit?: number;
    savings?: number;
    investment?: number
}

interface AccountType {
    type: string;
    userId: number;
    accountNumber: number;
    routingNumber: number;
    institution: string;
    investmentRate: number;
    startingBalance: number;
    currentBalance: number
}

interface TransactionType {
    accountId: number;
    amount: number;
    category: string;
    date: string;
    description: string;
    transactionId: number;
    userId: number;
    vendorName: string;
}

const Dashboard: React.FC = () => {
    const modalRef = useRef<ModalRef>(null)
    const [accountTotals, setAccountTotals] = useState({
        checking: 0,
        credit: 0,
        savings: 0,
        investment: 0
    })
    const [netCash, setNetCash] = useState(0)
    const [recentTransactions, setRecentTransactions] = useState<TransactionType[]>([])
    const [currentTransaction, setCurrentTransaction] = useState<TransactionType | null>(null)
    const [monthlyTransactions, setMonthlyTransactions] = useState<TransactionType[]>([])


    // ---Calculate net cash---
    // useEffect(()=> {
    //     setNetCash(accountTotals.checking + accountTotals.investment + accountTotals.savings - accountTotals.credit)
    // }, [accountTotals])


    // ----Get Accounts----
    // backend: /accounts/userId
    // useEffect(() => {
    //     const fetchAccounts = async () => {
    //         try{
    //             const response = await axios.get("http://localhost:8080/accounts/123", {
    //                 // withCredentials: true,
    //             })
    //             const accounts = response.data
    //             console.log("accounts: ", accounts)
    //             let totals= accounts.reduce((prev: AccountTotals, account: AccountType)=> {
    //                 const accountType = account.type.toLowerCase() as keyof AccountTotals
    //                 prev[accountType]! += account.currentBalance
    //                 return prev
    //             }, {checking: 0,
    //                 credit: 0,
    //                 savings: 0,
    //                 investment: 0})
    //             setAccountTotals(totals)
    //         }catch (err){
    //             console.log("There was an error fetching account data: ", err)
    //         }
    //     }
    //     fetchAccounts()
    // }, [])


    // ----Recent Transactions ---
    // backend: /transactions/recentTransactions/userId
    // useEffect(() => {
    //     const fetchTransactions = async () => {
    //         try{
    //             const response = await axios.get("http://localhost:8083/transactions/recentTransactions/123", {
    //                 // withCredentials: true,
    //             })
    //             setRecentTransactions(response.data)
    //         }catch (err){
    //             console.log("There was an error fetching recent tranactions: ", err)
    //         }
    //     }
    //     fetchTransactions()
    // }, [])


    // --- Monthly Transactions --
    // backend: /transactions/currentMonthTransactions/userId


    return (
        <div className="flex flex-col flex-wrap ">
            <h1>Welcome [add user name]</h1>
            <div className="flex">
                <div id="chart-container" className="flex-auto w-2/3">
                    <h1>Chart</h1>
                    <LineChart
                        series={[
                            {
                            data: [2, 5.5, 2, 8.5, 1.5, 5],
                            },
                        ]}
                        // width={500}
                        height={300}
                    />
                </div>
                <div id="accounts-container" className="flex-auto w-1/3">
                    <h1>Accounts</h1>
                    <Accordion bordered={false} items={
                        [{
                            title: (
                                <div className="flex justify-between">
                                    <p><Icon.AccountBalance/> Checkings</p>
                                    <p>Total: <Icon.AttachMoney/>{accountTotals.checking}</p>
                                </div>
                            ),
                            content: (<p>test</p>),
                            expanded: false,
                            id: "Checking",
                            headingLevel: "h4",
                        }
                        ,
                        {
                            title: (
                                <div className="flex justify-between">
                                    <p><Icon.CreditCard/> Credit Cards</p>
                                    <p>Total: <Icon.AttachMoney/>{accountTotals.credit}</p>
                                </div>
                            ),
                            content: (<p>test</p>),
                            expanded: false,
                            id: "credit-cards",
                            headingLevel: "h4",
                        },
                        {
                            title: (
                                <div className="flex justify-between">
                                    <p><Icon.AccountBalance/> Net Cash</p>
                                    <p>Total: <Icon.AttachMoney/>{netCash}</p>
                                </div>
                            ),
                            content: (<p>test</p>),
                            expanded: false,
                            id: "net-cash",
                            headingLevel: "h4",
                        },
                        {
                            title: (
                                <div className="flex justify-between">
                                    <p><Icon.AccountBalance/> Savings</p>
                                    <p>Total: <Icon.AttachMoney/>{accountTotals.savings}</p>
                                </div>
                            ),
                            content: (<p>test</p>),
                            expanded: false,
                            id: "savings",
                            headingLevel: "h4",
                        },
                        {
                            title: (
                                <div className="flex justify-between">
                                    <p><Icon.AccountBalance/> investments</p>
                                    <p>Total: <Icon.AttachMoney/>{accountTotals.investment}</p>
                                </div>
                            ),
                            content: (<p>test</p>),
                            expanded: false,
                            id: "investments",
                            headingLevel: "h4",
                        }]
                    } />
                </div>
            </div>
            <div id="transactions-container" className="flex flex-col flex-wrap">
                <h1>Recent Transactions</h1>
                {recentTransactions.length ? 
                <>
                    <Table className="w-full">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map((recentTransaction, idx)=> (
                                <>
                                    <tr key={idx}>
                                        <td>{recentTransaction.date}</td>
                                        <td>{recentTransaction.vendorName}</td>
                                        <td>{recentTransaction.category}</td>
                                        <td><Icon.AttachMoney />{recentTransaction.amount}</td>
                                        <td >
                                            <ModalToggleButton modalRef={modalRef} opener className="usa-button--unstyled" onClick={() => setCurrentTransaction(recentTransactions[idx])}>
                                                <Icon.NavigateNext />
                                            </ModalToggleButton>
                                        </td>
                                    </tr>
                                </>
                            ))}
                        </tbody>
                    </Table>
                </>
                : "No Recent Transactions"}
                <Link to="/dashboard/transactions" className="text-center">
                    <Button type="submit" >View All Transactions</Button>
                </Link>
            </div>
            <div id="budgets-container">
                <h1>Budgets</h1>
                <div className="flex items-center">
                    <Gauge width={150} height={150} value={60} />
                    <div className="w-3/5 flex flex-col items-center">
                        <div id="budget-items" className="grid-row flex-justify">
                            <p>[Budget name]</p>
                            <p><Icon.AttachMoney />[Amount spent so far]</p>
                        </div>
                        <div id="budget-items" className="grid-row flex-justify">
                            <p>[Budget name]</p>
                            <p><Icon.AttachMoney />[Amount spent so far]</p>
                        </div>
                        <div id="budget-items" className="grid-row flex-justify">
                            <p>[Budget name]</p>
                            <p><Icon.AttachMoney />[Amount spent so far]</p>
                        </div>
                        <Link to="/dashboard/budgets">
                            <Button className="mt-10" type="submit" >View Full Budget</Button>
                        </Link>
                    </div>
                </div>
            </div>
            <Modal ref={modalRef} id="transaction-info-modal" isLarge>
                {currentTransaction && (
                    <div className="flex flex-col justify-center bg-white w-full max-w-xl rounded-2xl">
                        {/* Top Container: Date and View History Button */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex gap-4 items-center">
                                <div className="flex items-center justify-between px-4 py-2 bg-white border border-black rounded-xl">
                                    <div>{currentTransaction.date}</div>
                                </div>   
                                <ModalToggleButton modalRef={modalRef} closer>
                                    Go Back
                                </ModalToggleButton>
                            </div>
                        </div>

                        <div className="border-t border-black my-4"></div>

                        {/* Bottom Container: Info Details */}
                        <div className="flex gap-6">
                            {/* Left Container */}
                            <div className="flex flex-col w-2/3">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold">{currentTransaction.vendorName}</h3>
                                    <p className="mt-2 text-xl">${currentTransaction.amount.toFixed(2)}</p>
                                    <p className="mt-4 text-lg">{currentTransaction.category}</p>
                                    <div className="mt-6 p-4 bg-gray-200 rounded-lg">
                                        <p className="text-md">{currentTransaction.description || 'No notes available'}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Right Container */}
                            <div className="flex flex-col w-1/3">
                                <div className="border-l border-black pl-6 h-full">
                                    <h4 className="text-xl">Account</h4>
                                    <div className="flex items-center mt-3 text-sm text-gray-500">
                                        <Icon.AccountBalance className="mr-2" />
                                        <div>{currentTransaction.accountId}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
        
    )
}

export default Dashboard
