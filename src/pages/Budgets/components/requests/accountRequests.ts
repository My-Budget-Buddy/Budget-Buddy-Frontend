import { getAccountByID } from "../../../Tax/taxesAPI";

//TODO Use real account type
type Account = {
    id: number;
    userId: number;
    type: string;
    currentBalance: number;
};

export async function getTotalAvailableFunds(): Promise<number> {
    return getAccountByID().then((res) => {
        const accounts = res.data;
        return accounts.reduce((sum: number, account: Account) => {
            if (["CHECKING", "SAVINGS"].includes(account.type)) {
                //TODO Use real account types. This will likely be a hardcoded list to check against.
                sum += account.currentBalance;
            } else {
                sum -= account.currentBalance;
            }
            return sum;
        }, 0);
    });
}

/*
async function getAllAccounts(): Promise<Account[]> {
    // Mock data
    return [
        { accountId: 1, userId: 1, accountType: "spending", balance: 1000 },
        { accountId: 2, userId: 1, accountType: "savings", balance: 2000 },
        { accountId: 3, userId: 1, accountType: "spending", balance: 1500 }
    ];
}

export async function getTotalAvailableFunds(): Promise<number> {
    const accounts = await getAllAccounts();
    return accounts.reduce((sum: number, account: Account) => {
        if (account.accountType === "spending") {
            //TODO Use real account types. This will likely be a hardcoded list to check against.
            sum += account.balance;
        }
        return sum;
    }, 0);
}
*/
