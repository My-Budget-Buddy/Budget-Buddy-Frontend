// Mock data:

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
    const summaries = await mockFetch(mockSummary);
    const summary = summaries.find((summary: BudgetSummary) => summary.monthYear === monthYear);
    return summary.totalBudgetAmount;
}

type BudgetSummary = {
    summaryId: number;
    userId: number;
    projectedIncome: number;
    monthYear: string;
    totalBudgetAmount: number;
};
