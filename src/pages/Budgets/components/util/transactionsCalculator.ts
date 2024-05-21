// TODO Given a list of transactions, return budget totals
const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/budgets`;

export async function getMapOfBudgetSpentAmountsFor(userid: number, date: string) {
    //TODO Wait for backend team to update on final endpoint
    try {
        const response = await fetch(`${endpoint}/transactions/${date}/user/${userid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Update redux store
        return data;

        // Call from redux store
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }

    console.log("Got buckets");
}
