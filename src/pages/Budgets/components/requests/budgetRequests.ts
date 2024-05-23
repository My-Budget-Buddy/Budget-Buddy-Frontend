import { BudgetRowProps } from "../../../../types/budgetInterfaces";
import { createBudgetAPI, deleteBudgetAPI, getBudgetsByIdAPI, getBudgetsMonthyear, getBudgetsTransactionsMonthyear, updateBudgetAPI } from "../../../Tax/taxesAPI";

export async function getBudgetsById(): Promise<BudgetRowProps[]> {
    //TODO Wait for backend team to update on final endpoint
    //const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/budgets/1`;
    
    return(getBudgetsByIdAPI()
    .then((res) => {
        const budgets: RawBudget[] =  res.data;
        const transformedBudgets = transformBudgets(budgets);

        // Update redux store
        return transformedBudgets;
    })
)

        

        // Call from redux store
    
}

// export async function getBudgetsByMonthYear(monthyear: string) {
//     //TODO Wait for backend team to update on final endpoint
//     const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/budgets/monthyear/${monthyear}/user/1`;
//     try {
//         const response = await fetch(endpoint, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             credentials: "include"
//         });

//         if (!response.ok) {
//             throw new Error(`Error: ${response.status} ${response.statusText}`);
//         }

//         const budgets: RawBudget[] = await response.json();
//         const transformedBudgets = transformBudgets(budgets);

//         // Update redux store
//         return transformedBudgets;

//         // Call from redux store
//     } catch (error) {
//         console.error("Failed to fetch user data:", error);
//         throw error;
//     }
// }

export async function getBudgetsByMonthYear(monthyear: string): Promise<BudgetRowProps[]> {
    //TODO Wait for backend team to update on final endpoint
    //const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/budgets/monthyear/${monthyear}/user/1`;
    
        return(getBudgetsMonthyear(monthyear)
        .then((res) => {
            console.log(res.data);
            const budgets: RawBudget[] =  res.data;
            const transformedBudgets = transformBudgets(budgets);

            // Update redux store
            return transformedBudgets;
        }))

        // if (!response.ok) {
        //     throw new Error(`Error: ${response.status} ${response.statusText}`);
        // }


        // Call from redux store
    
}

export async function createBudget(budget: RawBudgetToSend): Promise<RawBudgetToSend> {
    //const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/budgets`;

    
        return(createBudgetAPI(budget)
        .then((res) => {
            const data: RawBudgetToSend =  res.data;
            return data;
        })
    )

        
    
}

export async function putBudget(budget: RawBudgetToSend, id: number): Promise<RawBudgetToSend> {
    //const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/budgets/${id}`;

    
        return(updateBudgetAPI(id, budget)
        .then((res) => {
            const data: RawBudgetToSend =  res.data;
            return data;
        }))

       
        
    
}

export async function deleteBudget(id: number) {
    //TODO Wait for backend team to update on final endpoint
    //const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/budgets/${id}`;
    
        deleteBudgetAPI(id);


        // Call from redux store
    
}

export async function getTransactionsByMonthYear(monthyear: string): Promise<BudgetRowProps[]> {
    //TODO Wait for backend team to update on final endpoint
    //const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/budgets/transactions/${monthyear}/user/1`;
    
        return(getBudgetsTransactionsMonthyear(monthyear)
        .then((res) => {
            const budgets: RawBudget[] =  res.data;
            const transformedBudgets = transformBudgets(budgets);
    
            // Update redux store
            return transformedBudgets;
        })
    )

        // Call from redux store
    
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
