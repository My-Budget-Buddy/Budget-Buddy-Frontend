import { LineChart, Gauge } from "@mui/x-charts";
import { Accordion, Table, Icon, Button, ModalToggleButton, Modal, ModalRef } from "@trussworks/react-uswds";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface InitialAccountType {
    type: string;
    userId: number;
    accountNumber: number;
    routingNumber: number;
    institution: string;
    investmentRate: number;
    startingBalance: number;
    currentBalance: number
}

interface AllAccountsType {
    id: string,
    type: string;
    balance: number;
    accounts: AccountType[];
}

interface AccountType {
    accountNumber: number;
    routingNumber: number;
    currentBalance: number;
    institution: string;
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

interface MonthlyTransactionType {
    date: string;
    total: number;
}

const Dashboard: React.FC = () => {
    const modalRef = useRef<ModalRef>(null)
    const [allAccounts, setAllAccounts] = useState<AllAccountsType[]>([])
    const [netCash, setNetCash] = useState(0)
    const [recentTransactions, setRecentTransactions] = useState<TransactionType[]>([])
    const [currentTransaction, setCurrentTransaction] = useState<TransactionType | null>(null)
    const [monthlyTransactions, setMonthlyTransactions] = useState<MonthlyTransactionType[]>([])
    const [monthlySpend, setMonthlySpend] = useState(0)
    // ---Calculate net cash---
    useEffect(()=> {
        let total=0
        allAccounts.map((acc)=> {
            if(acc.id === "checking"){
                total += acc.balance
            }else{
                total -= acc.balance
            }
        })
        setNetCash(total)
    }, [allAccounts])


    // ----Get Accounts----
    // backend: /accounts/userId
    useEffect(() => {
        const fetchAccounts = async () => {
            try{
                const response = await axios.get("http://localhost:8080/accounts/123", {
                    // withCredentials: true,
                })
                const accounts = response.data
                let allAccounts: AllAccountsType[] = accounts.reduce((prev: AllAccountsType[], account: InitialAccountType)=> {
                    const accountId = account.type.toLowerCase()

                    let type
                    if (account.type === "CHECKING"){
                        type = "Checkings"
                    }else if (account.type === "SAVINGS"){
                        type = "Savings"
                    }else if (account.type === "CREDIT"){
                        type = "Credit Cards"
                    }else{
                        type = "Investments"
                    }

                    const existingAccount = prev.find(acc => acc.id === accountId);
                    if (existingAccount) {
                        existingAccount.balance += account.currentBalance;
                        existingAccount.accounts.push({
                            accountNumber: account.accountNumber,
                            routingNumber: account.routingNumber,
                            currentBalance: account.currentBalance,
                            institution: account.institution
                        })
                    } else {
                        prev.push({ 
                            id: accountId, 
                            type: type, 
                            balance: account.currentBalance, 
                            accounts: [{
                                accountNumber: account.accountNumber,
                                routingNumber: account.routingNumber,
                                currentBalance: account.currentBalance,
                                institution: account.institution
                            }]
                        });
                    }
                    return prev;
                    }, [])
                setAllAccounts(allAccounts)
            }catch (err){
                console.log("There was an error fetching account data: ", err)
            }
        }
        fetchAccounts()
    }, [])


    // ----Recent Transactions ---
    // backend: /transactions/recentTransactions/userId
    useEffect(() => {
        const fetchTransactions = async () => {
            try{
                const response = await axios.get("http://localhost:8083/transactions/recentTransactions/123", {
                    // withCredentials: true,
                })
                setRecentTransactions(response.data)
            }catch (err){
                console.log("There was an error fetching recent tranactions: ", err)
            }
        }
        fetchTransactions()
    }, [])


    // --- Monthly Transactions --
    // backend: /transactions/currentMonthTransactions/userId
    useEffect(() => {
        const fetchMonthlyTransactions = async () => {
            try{
                const response = await axios.get("http://localhost:8083/transactions/currentMonthTransactions/123", {
                    // withCredentials: true,
                })
                const monthlyTransactions= response.data
                let totalSpent=0
                const data = monthlyTransactions.reduce((prev: MonthlyTransactionType[], transaction: TransactionType) => {
                    const existingTransactionDate = prev.find(prevTransactionDate => prevTransactionDate.date === transaction.date);
                    if (existingTransactionDate){
                        existingTransactionDate.total += transaction.amount
                        totalSpent += transaction.amount 
                    }else{
                        prev.push({ date: transaction.date, total: transaction.amount})
                        totalSpent += transaction.amount
                    }
                    return prev
                }, [])
                data.sort((a: MonthlyTransactionType,b: MonthlyTransactionType)=> parseInt(a.date.toString().slice(8,10)) - parseInt(b.date.toString().slice(8,10)))
                setMonthlyTransactions(data)
                setMonthlySpend(totalSpent)
            }catch (err){
                console.log("There was an error fetching monthly tranactions: ", err)
            }
        }
        fetchMonthlyTransactions()
    }, [])


    // --- Budgets --
    // backend: /budgets/userId
    useEffect(()=> {
        const fetchBudgets = async () => {
            try {
                const response = await axios.get("http://localhost:8084/budgets/123", {
                    // withCredentials: true,
                })
                console.log('response: ', response.data)
            } catch (err) {
                console.log('There was an error fetching budgets: ', err)
            }
        }
        fetchBudgets()
    }, [])

    return (
        <div className="flex flex-col flex-wrap ">
            <h1>Welcome [add user name]</h1>
            <div className="flex">
                <div id="chart-container" className="flex flex-col flex-auto w-2/3 bg-accent-cool-lighter p-8 mr-12 rounded-lg">
                    <h1 className="flex items-center text-2xl font-bold ">Current spend this month: <Icon.AttachMoney/>{monthlySpend}</h1>
                    <LineChart
                        xAxis={[{ 
                            scaleType: "point",
                            data: (
                            monthlyTransactions.map((transaction)=> (
                                transaction.date.toString().slice(5,10)
                            ))
                        ) }]}
                        series={[
                            {
                                data: (
                                    monthlyTransactions.map((transaction)=> (
                                        transaction.total
                                    ))
                                ),
                                yAxisKey: 'rightAxisId',
                                area: true,
                                color: '#005ea2',
                            },
                        ]}
                        height={300}
                        leftAxis={null}
                        yAxis={[{id: "rightAxisId"}]}
                        rightAxis="rightAxisId"
                    />
                </div>
                <div id="accounts-container" className="flex-auto w-1/3">
                    <h1 >Accounts</h1>
                    {allAccounts.length ? 
                    <>
                        <Accordion bordered={false} items={
                            allAccounts.map((acc)=> {
                                return {
                                    title: (
                                        <div key={acc.id} className="flex justify-between items-center">
                                            {acc.id === "checking" && <p className="flex items-center"><Icon.AccountBalance className="mr-2" />{acc.type}</p>}
                                            {acc.id === "credit" && <p className="flex items-center"><Icon.CreditCard className="mr-2" />{acc.type}</p>}
                                            {acc.id === "savings" && <p className="flex items-center"><Icon.AccountBalance className="mr-2" />{acc.type}</p>}
                                            {acc.id === "investment" && <p className="flex items-center"><Icon.TrendingUp className="mr-2" />{acc.type}</p>}
                                            <p className="flex items-center"><Icon.AttachMoney/> {acc.balance}</p>
                                        </div>
                                    ),
                                    content: (acc.accounts.map((account, idx)=> (
                                        <div key={`${account.accountNumber}-${idx}`} className="flex justify-between">
                                            <div className="flex">
                                                <p className="mr-2">{account.accountNumber}</p>|
                                                <p className="ml-2">{account.institution}</p>
                                            </div>
                                            <p className="flex items-center"><Icon.AttachMoney/>{account.currentBalance}</p>
                                        </div>
                                    ))
                                    ),
                                    expanded: false,
                                    id: (`${acc.id}`),
                                    headingLevel: "h4"
                                }
                            })
                        } /> 
                        <div className="usa-accordion" >
                            <button type="button" className="bg-[#f0f0f0] py-4 pr-14 pl-5 w-full font-bold hover:cursor-auto" id="net-cash">
                                <div className="flex justify-between items-center">
                                    <p className="flex items-center"><Icon.AccountBalance className="mr-2" />Net Cash</p>
                                    <p className={`flex items-center ${netCash >0 ? "text-[#00a91c]" : "text-[#b50909]"}` }><Icon.AttachMoney/> {Math.abs(netCash)}</p> 
                                </div>
                            </button>
                        </div>
                    </>
                    : 
                    <div className="flex flex-col items-center">
                        <p className="mb-4">You don't have any accounts set up yet</p>
                        <Link to="/dashboard/accounts" >
                            <Button type="submit" >Add an Account</Button>
                        </Link>
                    </div>
                    }
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
                                <tr key={`${recentTransaction.accountId}-${idx}`}>
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
                            ))}
                        </tbody>
                    </Table>
                <Link to="/dashboard/transactions" className="text-center">
                    <Button type="submit" >View All Transactions</Button>
                </Link>
                </>
                : 
                    <div className="flex flex-col items-center">
                            <p className="mb-4">No Recent Transactions</p>
                            <Link to="/dashboard/transactions" >
                                <Button type="submit" >Add Transaction</Button>
                            </Link>
                        </div>
                }
            </div>
            <div id="budgets-container">
                <h1>Budgets</h1>
                <div className="flex items-center">
                    <Gauge width={150} height={150} value={60} />
                    <div className="w-3/5 flex flex-col items-center border-l border-black pl-6 h-full">
                        <div id="budget-items" className="grid-row flex-justify border-b border-black p-3 w-full">
                            <p>[Budget name]</p>
                            <p><Icon.AttachMoney />[Amount spent so far]</p>
                        </div>
                        <div id="budget-items" className="grid-row flex-justify border-b border-black p-3 w-full">
                            <p>[Budget name]</p>
                            <p><Icon.AttachMoney />[Amount spent so far]</p>
                        </div>
                        <div id="budget-items" className="grid-row flex-justify border-b border-black p-3 w-full">
                            <p>[Budget name]</p>
                            <p><Icon.AttachMoney />[Amount spent so far]</p>
                        </div>
                        <Link to="/dashboard/budgets">
                            <Button className="mt-10" type="submit" >View Full Budget</Button>
                        </Link>
                    </div>
                </div>
            </div>
            <Modal ref={modalRef} id="transaction-info-modal" aria-labelledby="modal-1-heading" aria-describedby="modal-1-description" isLarge>
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
