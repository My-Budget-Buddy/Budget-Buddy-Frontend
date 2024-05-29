import { BudgetRowProps } from "../../../../types/budgetInterfaces";
import Cookies from "js-cookie";
export async function getBudgetsById() {
    //TODO Wait for backend team to update on final endpoint
    const endpoint = `${import.meta.env.VITE_REACT_URL}/budgets`;
    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const budgets: RawBudget[] = await response.json();
        const transformedBudgets = transformBudgets(budgets);

        // Update redux store
        return transformedBudgets;

        // Call from redux store
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}

export async function getBudgetsByMonthYear(monthyear: string) {
    //TODO Wait for backend team to update on final endpoint
    const endpoint = `${import.meta.env.VITE_REACT_URL}/budgets/monthyear/${monthyear}`;
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

        // Update redux store
        return transformedBudgets;

        // Call from redux store
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}

export async function createBudget(budget: RawBudgetToSend): Promise<RawBudgetToSend> {
    const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/budgets`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
    const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/budgets/${id}`;

    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
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
    //TODO Wait for backend team to update on final endpoint
    const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/budgets/${id}`;
    try {
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        // Call from redux store
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}

export async function getTransactionsByMonthYear(monthyear: string) {
    //TODO Wait for backend team to update on final endpoint
    const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/budgets/transactions/${monthyear}/user/1`;
    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const budgets: RawBudget[] = await response.json();
        const transformedBudgets = transformBudgets(budgets);

        // Update redux store
        return transformedBudgets;

        // Call from redux store
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
