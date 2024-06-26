import { BudgetRowProps } from "../../../../types/budgetInterfaces";
import Cookies from "js-cookie";
const url = "https://api.skillstorm-congo.com";

// TODO Given a list of transactions, return budget totals
const endpoint = `${url}/budgets`;

export async function getCompleteBudgets(transformedBudgets: BudgetRowProps[]) {
    const date = transformedBudgets[0].monthYear;

    //This is a map where keys are CATEGORIES and the values are the corresponding TRANSACTIONS
    const categoriesMap = await getCategoriesTransactionsMap(date);
    return transformedBudgets.map((budget) => {
        const rawSpentAmount = getSumForCategory(categoriesMap, budget.category);
        return { ...budget, spentAmount: Math.round(rawSpentAmount * 100) / 100 }; //Round to nearest hundreth
    });
}

function getSumForCategory(categorizedTransactions: { [key: string]: Transaction[] }, category: string): number {
    const transactionsForCategory = categorizedTransactions[category];
    if (!transactionsForCategory) {
        return 0; // Return 0 if the category doesn't exist in the map
    }

    return transactionsForCategory.reduce((sum, transaction) => sum + transaction.amount, 0);
}

// Returns a map of categories and their transactions.
// e.g. "{GROCERIES: [{Transaction1}, {Transaction2}], "SHOPPING": [...]}
export async function getCategoriesTransactionsMap(monthYear: string) {
    // TODO We currently have no way of querying userID
    const transactions = await getTransactions(monthYear);
    const mapOfTransactionsByCategory = mapTransactionsToCategories(transactions);
    return mapOfTransactionsByCategory;
}

function mapTransactionsToCategories(transactions: Transaction[]) {
    return transactions.reduce<{ [key: string]: Transaction[] }>((categories, transaction) => {
        if (!categories[transaction.category]) {
            categories[transaction.category] = [];
        }
        categories[transaction.category].push(transaction);
        return categories;
    }, {});
}

async function getTransactions(date: string) {
    const jwtCookie = Cookies.get("jwt") as string;

    //TODO Wait for backend team to update on final endpoint
    try {
        const response = await fetch(`${endpoint}/transactions/${date}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: jwtCookie
            },
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("data:", data);
        return data;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}

interface Transaction {
    transactionId: number;
    userId: number;
    accountId: number;
    vendorName: string;
    amount: number;
    category: string;
    description: string;
    date: string;
}
