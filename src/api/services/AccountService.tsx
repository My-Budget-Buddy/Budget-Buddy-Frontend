import { URL } from "../Endpoint";

const accountsUrl = URL + "/accounts";

// Get accounts by user ID
export const URL_getAccountsByUserId = accountsUrl;

// Get individual account by ID. Must replace {accountId} with the account ID.
export const URL_getAccountByAccountIdAndUserId = accountsUrl + "/{accountId}";
export const getURL_getAccountByAccountIdAndUserId = (accountId: string) => {
    return URL_getAccountByAccountIdAndUserId.replace("{accountId}", accountId);
}

// Create Account
export const URL_createAccount = accountsUrl;

// Update Account. Must replace {accountId} with the account ID.
export const URL_updateAccount = accountsUrl + "/{accountId}";
export const getURL_updateAccount = (accountId: string) => {
    return URL_updateAccount.replace("{accountId}", accountId);
}

// Delete Account. Must replace {accountId} with the account ID.
export const URL_deleteAccount = accountsUrl + "/{accountId}";
export const getURL_deleteAccount = (accountId: string) => {
    return URL_deleteAccount.replace("{accountId}", accountId);
}

// Delete all accounts
export const URL_deleteAllAccounts = accountsUrl;