import { LineChart, Gauge, gaugeClasses } from "@mui/x-charts";
import { Accordion, Table, Icon, Button, ModalToggleButton, Modal, ModalRef, Title } from "@trussworks/react-uswds";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "../utils/helpers";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { BudgetRowProps } from "../types/budgetInterfaces";
import { updateBudgets } from "../utils/redux/budgetSlice";
import { getBudgetsByMonthYear } from "../api/requests/budgetRequests";
import { getCompleteBudgets } from "../utils/transactionsCalculator";
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import { getAccountByID, getCurrentMonthTransactionsAPI, getRecentTransactionsAPI } from "../api/taxesAPI";
import { useAuthentication } from "../contexts/AuthenticationContext";

interface InitialAccountType {
    id: number;
    type: string;
    userId: number;
    accountNumber: number;
    routingNumber: number;
    institution: string;
    investmentRate: number;
    startingBalance: number;
    currentBalance: number;
}

interface AllAccountsType {
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
    // transactions: transactionChartType[];
}

// interface transactionChartType {
//     category: string;
//     vendorName: string;
//     amount: number;
// }

const Dashboard: React.FC = () => {
    const modalRef = useRef<ModalRef>(null);
    const { t } = useTranslation();
    const [accounts, setAccounts] = useState<InitialAccountType[]>([]);
    const [allAccounts, setAllAccounts] = useState<AllAccountsType[]>([]);
    const [netCash, setNetCash] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState<TransactionType[]>([]);
    const [currentTransaction, setCurrentTransaction] = useState<TransactionType | null>(null);
    const [monthlyTransactions, setMonthlyTransactions] = useState<MonthlyTransactionType[]>([]);
    const [monthlySpend, setMonthlySpend] = useState(0);
    const budgetsStore = useSelector((store: any) => store.budgets);
    const [budgetGaugeTotal, setBudgetGaugeTotal] = useState(0);
    const [budgetGaugeSpent, setBudgetGaugeSpent] = useState(0);
    const dispatch = useDispatch();
    const { profile } = useAuthentication();

    // ---Calculate net cash---
    useEffect(() => {
        let total = 0;
        allAccounts.map((acc) => {
            if (acc.type === "credit") {
                total -= acc.balance;
            } else {
                total += acc.balance;
            }
        });
        setNetCash(total);
    }, [allAccounts]);

    // ----Get Accounts----
    // backend: /accounts/userId
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                getAccountByID()
                    .then((res) => {
                        const accounts = res.data;

                        //const accounts = response.data;
                        setAccounts(accounts);
                        const allAccounts: AllAccountsType[] = accounts.reduce(
                            (prev: AllAccountsType[], account: InitialAccountType) => {
                                const accountId = account.type.toLowerCase();
                                const existingAccount = prev.find((acc) => acc.type === accountId);
                                if (existingAccount) {
                                    existingAccount.balance += account.currentBalance;
                                    existingAccount.accounts.push({
                                        accountNumber: account.accountNumber,
                                        routingNumber: account.routingNumber,
                                        currentBalance: account.currentBalance,
                                        institution: account.institution
                                    });
                                } else {
                                    prev.push({
                                        type: accountId,
                                        balance: account.currentBalance,
                                        accounts: [
                                            {
                                                accountNumber: account.accountNumber,
                                                routingNumber: account.routingNumber,
                                                currentBalance: account.currentBalance,
                                                institution: account.institution
                                            }
                                        ]
                                    });
                                }
                                return prev;
                            },
                            []
                        );
                        setAllAccounts(allAccounts);
                    })
            } catch (err) {
                console.log("There was an error fetching account data: ", err);
            }
        };
        fetchAccounts();
    }, []);

    // ----Recent Transactions ---
    // backend: /transactions/recentTransactions/userId
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                getRecentTransactionsAPI()
                    .then((res) => {
                        setRecentTransactions(res.data);
                    })

            } catch (err) {
                console.log("There was an error fetching recent tranactions: ", err);
            }
        };
        fetchTransactions();
    }, []);

    // --- Monthly Transactions --
    // backend: /transactions/currentMonthTransactions/userId
    useEffect(() => {
        const fetchMonthlyTransactions = async () => {
            try {
                getCurrentMonthTransactionsAPI()
                    .then((res) => {
                        const monthlyTransactions = res.data;
                        const today = new Date
                        const totalSpentPerDay: MonthlyTransactionType[] = [];
                        let runningTotal = 0;
                        for (let i = 1; i <= today.getDate(); i++) {
                            const dateString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${i
                                .toString()
                                .padStart(2, "0")}`;
                            totalSpentPerDay.push({ date: dateString, total: 0 });
                        }
                        monthlyTransactions.forEach((transaction: TransactionType) => {
                            const transactionDate = transaction.date;
                            const idx = totalSpentPerDay.findIndex((day) => day.date === transactionDate);
                            if (idx !== -1) {
                                totalSpentPerDay[idx].total += transaction.amount;
                                runningTotal += transaction.amount;
                            }
                        });
                        for (let i = 1; i < totalSpentPerDay.length; i++) {
                            totalSpentPerDay[i].total += totalSpentPerDay[i - 1].total;
                        }
                        setMonthlyTransactions(totalSpentPerDay);
                        setMonthlySpend(runningTotal);
                    })
            } catch (err) {
                console.log("There was an error fetching monthly tranactions: ", err);
            }
        };
        fetchMonthlyTransactions();
    }, []);
    console.log("monthlyTransactions:", monthlyTransactions)
    //---- budgets gauge ----
    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await getBudgetsByMonthYear(budgetsStore.monthYear)
                const completeBudgets = await getCompleteBudgets(response);
                dispatch(updateBudgets(completeBudgets));
            } catch (error) {
                console.log('There was an error fetching budgets: ', error)
            }
        };
        fetchBudgets()
    }, []);

    useEffect(() => {
        let gauegeTotal = 0
        let gaugeSpent = 0
        budgetsStore.budgets.map((budget: BudgetRowProps) => {
            gaugeSpent += budget.spentAmount
            gauegeTotal += budget.totalAmount
        })
        setBudgetGaugeTotal(gauegeTotal)
        setBudgetGaugeSpent(gaugeSpent)
    }, [budgetsStore])

    return (
        <div className="flex flex-col flex-wrap ">
            <Title>{t("dashboard.welcome")}{profile?.firstName && `, ${profile.firstName}`}</Title>
            <div className="flex items-start">
                <div
                    id="chart-container"
                    className="flex flex-col flex-auto w-2/3 p-8 mr-12 border-solid border-4 rounded-lg shadow-lg"
                >
                    <h3 className="flex items-center justify-center text-2xl font-bold my-0" id="current-spending-chart-header">
                        {t("dashboard.chart")} {formatCurrency(monthlySpend)}
                    </h3>
                    <LineChart
                        xAxis={[
                            {
                                scaleType: "band",
                                data: monthlyTransactions.map((transaction) => parseInt(transaction.date.toString().slice(8, 10)))
                            }
                        ]}
                        series={[
                            {
                                data: monthlyTransactions.map((transaction) => transaction.total),
                                yAxisKey: "rightAxisId",
                                // area: true,
                                color: "#005ea2",
                                label: "Amount spent",
                            }
                        ]}
                        slotProps={{ legend: { hidden: true } }}
                        grid={{ horizontal: true }}
                        height={300}
                        leftAxis={null}
                        yAxis={[{ id: "rightAxisId" }]}
                        rightAxis="rightAxisId"
                    />
                </div>
                <div id="accounts-container" className="flex-auto w-1/3">
                    <Title>{t("accounts.title")}</Title>
                    {allAccounts.length ? (
                        <>
                            <Accordion
                                bordered={false}
                                items={allAccounts.map((acc) => {
                                    return {
                                        title: (
                                            <div key={acc.type} className="flex justify-between items-center">
                                                {acc.type === "checking" && (
                                                    <p className="flex items-center">
                                                        <Icon.AccountBalance className="mr-2" />
                                                        {t(`${acc.type}`)}
                                                    </p>
                                                )}
                                                {acc.type === "credit" && (
                                                    <p className="flex items-center">
                                                        <Icon.CreditCard className="mr-2" />
                                                        {t(`${acc.type}`)}
                                                    </p>
                                                )}
                                                {acc.type === "savings" && (
                                                    <p className="flex items-center">
                                                        <SavingsOutlinedIcon
                                                            fontSize="small"
                                                            className="mr-2"
                                                        />
                                                        {t(`${acc.type}`)}
                                                    </p>
                                                )}
                                                {acc.type === "investment" && (
                                                    <p className="flex items-center">
                                                        <Icon.TrendingUp className="mr-2" />
                                                        {t(`${acc.type}`)}
                                                    </p>
                                                )}
                                                <p>
                                                    {formatCurrency(acc.balance)}
                                                </p>
                                            </div>
                                        ),
                                        content: acc.accounts.map((account, idx) => (
                                            <div
                                                key={`${account.accountNumber}-${idx}`}
                                                className="flex justify-between"
                                            >
                                                <div className="flex">
                                                    <p className="mr-2">{account.accountNumber}</p>|
                                                    <p className="ml-2">{account.institution}</p>
                                                </div>
                                                <p>
                                                    {formatCurrency(account.currentBalance)}
                                                </p>
                                            </div>
                                        )),
                                        expanded: false,
                                        id: `${acc.type}`,
                                        headingLevel: "h4"
                                    };
                                })}
                            />
                            <div className="usa-accordion">
                                <button
                                    type="button"
                                    className="bg-[#f0f0f0] py-4 pr-14 pl-5 w-full font-bold hover:cursor-auto"
                                    id="no-focus"
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="flex items-center">
                                            <MonetizationOnOutlinedIcon
                                                fontSize="small"
                                                className="mr-2"
                                            />
                                            {t("accounts.net-cash")}
                                        </p>
                                        <p
                                            className={`flex items-center ${netCash > 0 ? "text-[#00a91c]" : "text-[#b50909]"
                                                }`}
                                        >
                                            {formatCurrency(Math.abs(netCash))}
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center">
                            <p className="mb-4">{t("dashboard.no-accounts")}</p>
                            <Link to="/dashboard/accounts">
                                <Button type="submit">{t("dashboard.add-account")}</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div id="transactions-container" className="flex flex-col flex-wrap">
                <Title>{t("dashboard.recent-transactions")}</Title>
                {recentTransactions.length ? (
                    <>
                        <Table className="w-full">
                            <thead>
                                <tr>
                                    <th>{t("transactions-table.date")}</th>
                                    <th>{t("transactions-table.name")}</th>
                                    <th>{t("transactions-table.category")}</th>
                                    <th>{t("transactions-table.amount")}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTransactions.map((recentTransaction, idx) => (
                                    <tr key={`${recentTransaction.accountId}-${idx}`}>
                                        <td>{formatDate(recentTransaction.date)}</td>
                                        <td>{recentTransaction.vendorName}</td>
                                        <td>{t(`${recentTransaction.category}`)}</td>
                                        <td>
                                            {formatCurrency(recentTransaction.amount)}
                                        </td>
                                        <td>
                                            <ModalToggleButton
                                                modalRef={modalRef}
                                                opener
                                                id="btnTransactionArrow"
                                                className="usa-button--unstyled"
                                                onClick={() => setCurrentTransaction(recentTransactions[idx])}
                                            >
                                                <Icon.NavigateNext />
                                            </ModalToggleButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Link to="/dashboard/transactions" className="text-center">
                            <Button id="btnViewAllTransactions" type="submit">{t("dashboard.all-transactions")}</Button>
                        </Link>
                    </>
                ) : (
                    <div className="flex flex-col items-center">
                        <p className="mb-4">{t("dashboard.no-transactions")}</p>
                        <Link to="/dashboard/transactions">
                            <Button type="submit">{t("dashboard.add-transaction")}</Button>
                        </Link>
                    </div>
                )}
            </div>
            <div>
                <Title>{t("budgets.title")}</Title>
                <div id="budgets-container" className="flex items-center mb-14">
                    <div className="w-2/5 flex justify-center">
                        {/* <SummaryComponent hideAdditionalInfo/> */}
                        <Gauge
                            id="budget-gauge"
                            width={200}
                            height={200}
                            value={parseFloat((budgetGaugeSpent).toFixed(2))}
                            // value={300}
                            valueMax={parseFloat(budgetGaugeTotal.toFixed(2))}
                            startAngle={0}
                            endAngle={360}
                            innerRadius="80%"
                            outerRadius="100%"
                            sx={() => ({
                                [`& .${gaugeClasses.valueArc}`]: {
                                    fill: [`${budgetGaugeSpent > budgetGaugeTotal ? "#b50909" :
                                        (budgetGaugeSpent > budgetGaugeTotal / 2 ? "#e5a000" : "#00a91c")}`],
                                }
                            })}
                            text={({ value, valueMax }) => `$ ${value} / ${valueMax}`}
                        />
                    </div>
                    <div className="w-3/5 flex flex-col items-center border-l border-black pl-6 h-full">
                        {budgetsStore.budgets.map((budget: BudgetRowProps, idx: number) => (
                            <div
                                key={idx}
                                id="budget-items"
                                className="grid-row flex-justify border-b border-black p-3 w-full"
                            >
                                <p>{budget.category}</p>
                                <p>
                                    <span className={`${budget.spentAmount > budget.totalAmount ? "text-[#b50909] font-bold" : (budget.spentAmount > budget.totalAmount / 2 ? "text-[#e5a000]" : "text-[#00a91c]")}`}>{formatCurrency(budget.spentAmount)}</span> <span className={`${budget.spentAmount >= budget.totalAmount && budget.totalAmount && "text-[#b50909] font-bold"}`}>/ {formatCurrency(budget.totalAmount)}</span>
                                </p>
                            </div>
                        ))}
                        <Link to="/dashboard/budgets">
                            <Button className="mt-10" type="submit">
                                {t("dashboard.view-budgets")}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <Modal
                ref={modalRef}
                id="transaction-info-modal"
                aria-labelledby="modal-1-heading"
                aria-describedby="modal-1-description"
                isLarge
            >
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
                                        <p className="text-md">
                                            {currentTransaction.description || "No notes available"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Right Container */}
                            <div className="flex flex-col w-1/3">
                                <div className="border-l border-black pl-6 h-full">
                                    <h4 className="text-xl">Account</h4>
                                    <div className="flex items-center mt-3 text-sm text-gray-500">
                                        {currentTransaction.accountId && (
                                            <div className="flex flex-col">
                                                {accounts.map(
                                                    (account, idx) =>
                                                        account.id === currentTransaction.accountId && (
                                                            <div key={idx}>
                                                                <div className="flex items-center text-sm text-gray-500">
                                                                    <Icon.AccountBalance className="mr-2" />
                                                                    <div>{account.institution}</div>
                                                                </div>
                                                                <div className="mt-2 text-sm text-gray-500">
                                                                    Account Number: {account.accountNumber}
                                                                </div>
                                                            </div>
                                                        )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Dashboard;
