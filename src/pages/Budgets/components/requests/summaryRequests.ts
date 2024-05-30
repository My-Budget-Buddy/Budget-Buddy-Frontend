import { createMonthlySummaryAPI, getMonthlySummaryAPI, updateMonthlySummaryAPI } from "../../../Tax/taxesAPI";
const url = "https://api.skillstorm-congo.com";

export async function getMonthlySummary(monthYear: string): Promise<MonthlySummary> {
    return getMonthlySummaryAPI(monthYear).then((res) => {
        const monthlySummaryList = res.data;
        const monthlySummary = monthlySummaryList[0];
        return monthlySummary;
    });
}

export async function updateMonthlySummary(summaryId: number, monthlySummary: MonthlySummary): Promise<MonthlySummary> {
    return updateMonthlySummaryAPI(summaryId, monthlySummary).then((res) => {
        const data: MonthlySummary = res.data;
        return data;
    });
}

export async function createMonthlySummary(monthlySummary: NewMonthlySummary): Promise<MonthlySummary> {
    return createMonthlySummaryAPI(monthlySummary).then((res) => {
        const data: MonthlySummary = res.data;
        return data;
    });
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
    const endpoint = `${url}/summarys/${id}`;

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

type BudgetSummary = {
    summaryId?: number;
    userId: string;
    projectedIncome?: number;
    monthYear: string;
    totalBudgetAmount: number;
};

type MonthlySummary = {
    summaryId: number;
    userId?: string;
    projectedIncome?: number;
    monthYear?: string;
    totalBudgetAmount?: number;
};

// The necessary fields for a post request
type NewMonthlySummary = {
    userId: number;
    projectedIncome: number;
    monthYear: string;
    totalBudgetAmount: number;
};
