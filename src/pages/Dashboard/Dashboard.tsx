import { LineChart, Gauge } from "@mui/x-charts";
import { Accordion, Table, Icon, Button, ModalToggleButton, Modal, ModalHeading, ModalFooter, ModalRef } from "@trussworks/react-uswds";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface AccountTotals {
    checking?: number;
    credit?: number;
    savings?: number;
    investment?: number
}

interface AccountType {
    type: string,
    userId: number,
    accountNumber: number,
    routingNumber: number,
    institution: string,
    investmentRate: number,
    startingBalance: number,
    currentBalance: number
}

const Dashboard: React.FC = () => {
    const modalRef = useRef<ModalRef>(null)
    const [recentTransactions, setRecentTransactions] = useState(
        [{
            accountId: 1234,
            vendorName: "Publix",
            amount: 100,
            category: "Groceries",
            date: "2024-16-05",
            description: ""
        },
        {
            accountId: 1234,
            vendorName: "T-mobile",
            amount: 150,
            category: "Bills & Utilities",
            date: "2024-15-05",
            description: ""
        },
        {
            accountId: 1234,
            vendorName: "McDonalds",
            amount: 20,
            category: "Dining Out",
            date: "2024-13-05",
            description: ""
        }
    ])

    const [currentTransaction, setCurrentTransacation] = useState(recentTransactions[0])
    const [accountTotals, setAccountTotals] = useState({
        checking: 0,
        credit: 0,
        savings: 0,
        investment: 0
    })
    const [netCash, setNetCash] = useState(0)

    //---Calculate net cash---
    // useEffect(()=> {
    //     setNetCash(accountTotals.checking + accountTotals.investment + accountTotals.savings - accountTotals.credit)
    // }, [accountTotals])


    // ----Get Accounts----
    //backend: /accounts/userId
    // useEffect(() => {
    //     fetch("http://localhost:8080/accounts/123", {
    //         credentials: "include",
    //         method: "GET",
    //     })
    //     .then((data) => {
    //         if (data.ok){
    //             return data.json()
    //         }else{
    //             console.log("Error fetching account data")
    //         }
    //     })
    //     .then((accounts)=> {
    //         let totals= accounts.reduce((prev: AccountTotals, account: AccountType)=> {
    //             const accountType = account.type.toLowerCase() as keyof AccountTotals
    //             prev[accountType]! += account.currentBalance
    //             return prev
    //         }, {checking: 0,
    //             credit: 0,
    //             savings: 0,
    //             investment: 0})
    //         setAccountTotals(totals)
    //     })
    //     .catch((error)=> {
    //         console.log('There was an error getting account data', error)
    //     })
    // }, [])

    // ----Recent Transactions ---
    // using getTransactionFromLast7Days
    // useEffect(() => {
    //     fetch([backendurl], {
    //         credentials: "include",
    //         method: "GET",
    //     })
    //     .then((data) => {
    //         return data.json()
    //     })
    //     .then((transactions)=> {
    //         setRecentTransactions(transactions)
    //     })
    //     .catch((error)=> {
    //         console.log('There was an error getting recent transactions', error)
    //     })
    // }, [])


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
                                        <ModalToggleButton modalRef={modalRef} opener className="usa-button--unstyled" onClick={() => setCurrentTransacation(recentTransactions[idx])}>
                                            <Icon.NavigateNext />
                                        </ModalToggleButton>
                                    </td>
                                </tr>
                            </>
                        ))}
                    </tbody>
                </Table>
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
            <Modal ref={modalRef} id="example-modal" aria-labelledby="modal-heading" aria-describedby="modal-description">
                <ModalHeading id="modal-heading">
                    {currentTransaction.category}: {currentTransaction.vendorName}
                </ModalHeading>
                <div className="usa-prose">
                    <div id="modal-description" className="flex justify-between">
                        <p>Account: {currentTransaction.accountId}</p>
                        <p>{currentTransaction.date}</p>
                    </div>
                    <p className="text-center">
                        <Icon.AttachMoney />{currentTransaction.amount}
                    </p>
                </div>
                <ModalFooter className="text-center">
                    <ModalToggleButton modalRef={modalRef} closer>
                        Go Back
                    </ModalToggleButton>
                </ModalFooter>
            </Modal>
        </div>
        
    )
}

export default Dashboard
