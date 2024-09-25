import Cookies from "js-cookie";

import { URL as url } from "../../../../api/Endpoint";

type Account = {
    id: number;
    userId: string;
    type: "CHECKING" | "SAVINGS" | "INVESTMENT"; // Adjust as necessary based on possible account types
    accountNumber: string;
    routingNumber: string;
    institution: string;
    investmentRate: number;
    startingBalance: number;
    currentBalance: number;
};

export async function getTotalAvailableFunds(): Promise<number> {
    const accounts = await getAllAccounts();
    return accounts.reduce((sum: number, account: Account) => {
        if (["CHECKING", "SAVINGS"].includes(account.type)) {
            sum += account.currentBalance;
        } else if (["CREDIT"].includes(account.type)) {
            sum -= account.currentBalance;
        } // do not add or subtract from total if the account is not listed above
        return sum;
    }, 0);
}

async function getAllAccounts(): Promise<Account[]> {
    const endpoint = `${url}/accounts`;
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

        const accounts: Account[] = await response.json();

        return accounts;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}
