import Cookies from "js-cookie";

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
            //TODO Use real account types. This will likely be a hardcoded list to check against.
            sum += account.currentBalance;
        } else {
            sum -= account.currentBalance;
        }
        return sum;
    }, 0);
}

async function getAllAccounts(): Promise<Account[]> {
    const endpoint = `${import.meta.env.VITE_REACT_URL}/accounts`;
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
