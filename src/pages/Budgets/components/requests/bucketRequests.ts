import { SavingsBucketRowProps } from "../../../../types/budgetInterfaces";
import Cookies from "js-cookie";
import { URL as url } from "../../../../api/Endpoint";

export async function getBuckets(): Promise<SavingsBucketRowProps[]> {
    const endpoint = `${url}/buckets/user`;
    const jwtCookie = Cookies.get("jwt") as string;
    try {
        console.log("getting... ");
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

        const buckets: RawBucket[] = await response.json();
        const transformedBuckets = transformBuckets(buckets);
        return transformedBuckets;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}

export async function postBucket(bucket: RawBucketToSend): Promise<RawBucketToSend> {
    const endpoint = `${url}/buckets/add`;
    const jwtCookie = Cookies.get("jwt") as string;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: jwtCookie
            },
            body: JSON.stringify(bucket)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data: RawBucketToSend = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}

export async function putBucket(bucket: RawBucketToSend, id: number): Promise<RawBucketToSend> {
    const endpoint = `${url}/buckets/update/${id}`;
    const jwtCookie = Cookies.get("jwt") as string;

    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: jwtCookie
            },
            body: JSON.stringify(bucket)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: RawBucketToSend = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}

export async function deleteBucket(id: number) {
    const endpoint = `${url}/buckets/delete/${id}`;
    const jwtCookie = Cookies.get("jwt") as string;
    try {
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: jwtCookie
            },
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
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
