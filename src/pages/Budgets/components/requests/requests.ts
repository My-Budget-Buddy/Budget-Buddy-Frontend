import { SavingsBucketRowProps } from "../../../../types/budgetInterfaces";

export async function getBuckets() {
    //TODO Wait for backend team to update on final endpoint
    const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/buckets/user/1`;
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

        const buckets: RawBucket[] = await response.json();
        const transformedBuckets = transformBuckets(buckets);

        // Update redux store
        return transformedBuckets;

        // Call from redux store
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }

    console.log("Got buckets");
}

// The data from the endpoint needs to be trimmed down to this.
function transformBuckets(buckets: RawBucket[]): SavingsBucketRowProps[] {
    return buckets.map((bucket) => ({
        data: {
            id: bucket.bucketId,
            name: bucket.bucketName,
            amount_required: bucket.amountRequired,
            amount_reserved: bucket.amountAvailable,
            is_currently_reserved: bucket.isReserved
        }
    }));
}

interface RawBucket {
    bucketId: number;
    userId: number;
    bucketName: string;
    amountAvailable: number;
    amountRequired: number;
    dateCreated: string;
    isActive: boolean;
    isReserved: boolean;
    monthYear: string;
}
