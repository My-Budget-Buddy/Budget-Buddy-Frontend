// Mock data:
import Cookies from "js-cookie";

import { mockFetch } from "../../../../util/util";

const mockSummary = [
    {
        summaryId: 1,
        userId: 1,
        projectedIncome: 7777.0,
        monthYear: "2024-05",
        totalBudgetAmount: 1111.0
    }
];

export async function getSpendingBudget(monthYear: string) {
    //TODO if fetch gets nothing, post with new empty summary object

    const summaries = await mockFetch(mockSummary);
    const summary = summaries.find((summary: BudgetSummary) => summary.monthYear === monthYear);
    return summary.totalBudgetAmount;
}

export async function updateSpendingBudgetFor(id: string, monthYear: string, amount: number) {
    const summary = {
        userId: id,
        monthYear: monthYear,
        totalBudgetAmount: amount
    } as BudgetSummary;
    //TODO How to get id?

    try {
        await putBucket(summary, id);
    } catch (error) {
        console.error(error);
    }
}

//id is for
async function putBucket(summary: BudgetSummary, id: string) {
    //This should only run after getSummaryFor(summary.monthYear) is run, which populates that monthyear with a budget summary if it doesn't exist.
    // But theoretically the endpoint should work without anything on the database too.
    const endpoint = `${import.meta.env.VITE_REACT_URL}/summarys/${id}`;

    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(summary)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error("Failed to create bucket:", error);
        throw error;
    }
}

export async function getTotalFundsAvailable(): Promise<number> {
    const endpoint = `${import.meta.env.VITE_REACT_URL}/accounts`;
    const jwtCookie = Cookies.get("jwt") as string;

    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: jwtCookie
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const accountsList = await response.json();

        return accountsList.reduce((sum: number, account: Account) => {
            if (account.type == "savings") {
                return (sum += sum);
            }
        });
    } catch (error) {
        console.error("Failed to create bucket:", error);
        throw error;
    }
}

type BudgetSummary = {
    summaryId?: number;
    userId: string;
    projectedIncome?: number;
    monthYear: string;
    totalBudgetAmount: number;
};

type Account = {
    type: string;
};
