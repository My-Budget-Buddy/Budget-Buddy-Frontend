import { BudgetRowProps } from "../../../../types/budgetInterfaces";
import Cookies from "js-cookie";
import { URL as url } from "../../../../api/Endpoint";

export async function getBudgetsById() {
    const endpoint = `${url}/budgets`;
    const jwtCookie = Cookies.get("jwt") as string;
    try {
        const response = await fetch(endpoint, {
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

        const budgets: RawBudget[] = await response.json();
        const transformedBudgets = transformBudgets(budgets);

        return transformedBudgets;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}

export async function getBudgetsByMonthYear(monthyear: string) {
    const endpoint = `${url}/budgets/monthyear/${monthyear}`;
    const jwtCookie = Cookies.get("jwt") as string;

    try {
        const response = await fetch(endpoint, {
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

        const budgets: RawBudget[] = await response.json();
        const transformedBudgets = transformBudgets(budgets);

        return transformedBudgets;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}

export async function createBudget(budget: RawBudgetToSend): Promise<RawBudgetToSend> {
    const endpoint = `${url}/budgets`;
    const jwtCookie = Cookies.get("jwt") as string;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: jwtCookie
            },
            body: JSON.stringify(budget)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: RawBudgetToSend = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to create budget:", error);
        throw error;
    }
}

export async function putBudget(budget: RawBudgetToSend, id: number): Promise<RawBudgetToSend> {
    const endpoint = `${url}/budgets/${id}`;
    const jwtCookie = Cookies.get("jwt") as string;

    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: jwtCookie
            },
            body: JSON.stringify(budget)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: RawBudgetToSend = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to create budget:", error);
        throw error;
    }
}

export async function deleteBudget(id: number) {
    const endpoint = `${url}/budgets/${id}`;
    const jwtCookie = Cookies.get("jwt") as string;
    try {
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: jwtCookie
            },
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}

export async function getTransactionsByMonthYear(monthyear: string) {
    const endpoint = `${url}/budgets/transactions/${monthyear}`;
    const jwtCookie = Cookies.get("jwt") as string;
    try {
        const response = await fetch(endpoint, {
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

        const budgets: RawBudget[] = await response.json();
        const transformedBudgets = transformBudgets(budgets);

        return transformedBudgets;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}

// The data from the endpoint needs to be trimmed down to this.
function transformBudgets(budgets: RawBudget[]): BudgetRowProps[] {
    return budgets.map((budget) => ({
        id: budget.budgetId,
        category: budget.category,
        totalAmount: budget.totalAmount,
        spentAmount: 0,
        isReserved: budget.isReserved,
        notes: budget.notes,
        monthYear: budget.monthYear
    }));
}

interface RawBudget {
    budgetId: number;
    userId: number;
    category: string;
    totalAmount: number;
    isReserved: boolean;
    monthYear: string;
    notes: string;
    createdTimestamp: string;
}

interface RawBudgetToSend {
    //budgetId: number;
    userId: number;
    category: string;
    totalAmount: number;
    isReserved: boolean;
    monthYear: string;
    notes: string;
    //createdTimestamp: string;
}
