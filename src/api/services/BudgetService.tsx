import { URL } from "../Endpoint";

// --- BUCKETS CONTROLLER ---

const bucketsUrl = URL + "/buckets";

// Retrieves all bucket objects
export const URL_getAllBuckets = bucketsUrl + "/all";

// Retrieves all Bucket objects associated with a specific user ID
export const URL_getAllBucketsByUserId = bucketsUrl + "/user";

// Retrieves a specific Bucket object by its bucket ID
export const URL_getBucketByBucketId = bucketsUrl + "/bucket/{bucketId}";
export const getURL_getBucketByBucketId = (bucketId: string) => {
    return URL_getBucketByBucketId.replace("{bucketId}", bucketId);
}

// Retrieves BUcket objects associated with a specific user ID and month-year
export const URL_getBucketsByMonthYear = bucketsUrl + "/monthyear/{monthYear}";
export const getURL_getBucketsByMonthYear = (monthYear: string) => {
    return URL_getBudgetsByMonthYear.replace("{monthYear}", monthYear);
}

// Adds a new Bucket object.
export const URL_addBucket = bucketsUrl + "/add";

// Updates an existing Bucket object.
export const URL_updateBucket = bucketsUrl + "/update/{bucketId}";
export const getURL_updateBucket = (bucketId: string) => {
    return URL_updateBucket.replace("{bucketId}", bucketId);
}

// Deletes a specific Bucket object by its bucket ID.
export const URL_deleteBucket = bucketsUrl + "/delete/{bucketId}";
export const getURL_deleteBucket = (bucketId: string) => {
    return URL_deleteBucket.replace("{bucketId}", bucketId);
}

// Deletes all Bucket objects associated with a specific user ID.
export const URL_deleteAllBucketsByUserId = bucketsUrl + "/deleteAll/user";

// --- BUDGET CONTROLLER ---

const budgetsUrl = URL + "/budgets";

// Retrieves all the budgets from the budget repository
export const URL_findAllBudgets = budgetsUrl;

// Rerieves the Budget objects associated with the given ID.
export const URL_getBudgetsById = budgetsUrl + "/userBudgets";

// Creates a new budget by saving the provided Budget object.
export const URL_createBudget = budgetsUrl;

// Edits the details of a budget with the given ID.
export const URL_editBudget = budgetsUrl + "/{id}";
export const getURL_editBudget = (id: string) => {
    return URL_editBudget.replace("{id}", id);
}

// Deletes a budget from the database by their ID.
export const URL_deleteBudget = budgetsUrl + "/{id}";
export const getURL_deleteBudget = (id: string) => {
    return URL_deleteBudget.replace("{id}", id);
}

// Controller to receive the budgets a user has for a specific month and year
export const URL_getBudgetsByMonthYear = budgetsUrl + "/monthyear/{monthYear}";
export const getURL_getBudgetsByMonthYear = (monthYear: string) => {
    return URL_getBudgetsByMonthYear.replace("{monthYear}", monthYear);
}

// Controller to receive the transactions a user had for a specific month year related to categories of budgets.
export const URL_getTransactionsByMonthYear = budgetsUrl + "/transactions/{monthYear}";
export const getURL_getTransactionsByMonthYear = (monthYear: string) => {
    return URL_getTransactionsByMonthYear.replace("{monthYear}", monthYear);
}

// Controller to delete all budgets associated with a userId
export const URL_deleteAllBudgetsByUserId = budgetsUrl + "/deleteAll/user";

// --- MONTHLY SUMMARY CONTROLLER ---

const monthlySummaryUrl = URL + "/summarys";

// Retrieves all the monthly summaries from the monthly summary repository
export const URL_findAllSummaries = monthlySummaryUrl;

// Retrieves the summary objects associated with the given header user ID.
export const URL_getSummaryById = monthlySummaryUrl + "/userSummarys";

// Creates a new summary by saving the provided Summary object.
export const URL_createMonthlySummary = monthlySummaryUrl;

// Edits the details of a summary with the given ID.
export const URL_editMonthlySummary = monthlySummaryUrl + "/{id}";
export const getURL_editMonthlySummary = (id: string) => {
    return URL_editMonthlySummary.replace("{id}", id);
}

// Deletes a summary from the database by their ID.
export const URL_deleteSummary = monthlySummaryUrl + "/{id}";
export const getURL_deleteSummary = (id: string) => {
    return URL_deleteSummary.replace("{id}", id);
}

// Controller to receive the summaries a user has for a specific month and year
export const URL_getSummariesByMonthYear = monthlySummaryUrl + "/monthyear/{monthYear}";
export const getURL_getSummariesByMonthYear = (monthYear: string) => {
    return URL_getSummariesByMonthYear.replace("{monthYear}", monthYear);
}

// Controller to delete all summaries associated with a userId
export const URL_deleteAllSummariesByUserId = monthlySummaryUrl + "/deleteAll/user";