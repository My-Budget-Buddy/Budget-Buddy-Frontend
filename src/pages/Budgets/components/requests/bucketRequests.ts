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
}

export async function postBucket(bucket: RawBucketToSend): Promise<RawBucketToSend> {
    const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/buckets/add`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bucket)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: RawBucketToSend = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to create bucket:", error);
        throw error;
    }
}

export async function putBucket(bucket: RawBucketToSend, id: number): Promise<RawBucketToSend> {
    const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/buckets/update/${id}`;

    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bucket)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: RawBucketToSend = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to create bucket:", error);
        throw error;
    }
}

export async function deleteBucket(id: number) {
    //TODO Wait for backend team to update on final endpoint
    const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/buckets/delete/${id}`;
    try {
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        // Call from redux store
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}

// The data from the endpoint needs to be trimmed down to this.
function transformBuckets(buckets: RawBucket[]): SavingsBucketRowProps[] {
    return buckets.map((bucket) => ({
        data: {
            id: bucket.bucketId,
            name: bucket.bucketName,
            amount_required: bucket.amountRequired,
            amount_reserved: bucket.amountReserved,
            is_currently_reserved: bucket.isReserved
        }
    }));
}

interface RawBucket {
    bucketId: number;
    userId: number;
    bucketName: string;
    amountReserved: number;
    amountRequired: number;
    dateCreated: string;
    isActive: boolean;
    isReserved: boolean;
    monthYear: string;
}

interface RawBucketToSend {
    // bucketId: number;
    userId: number;
    bucketName: string;
    amountReserved: number;
    amountRequired: number;
    // dateCreated: string;
    isActive: boolean;
    isReserved: boolean;
    // monthYear: string;
}
