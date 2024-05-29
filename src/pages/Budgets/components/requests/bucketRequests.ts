import { SavingsBucketRowProps } from "../../../../types/budgetInterfaces";

import { addBucketsAPI, deleteBucketAPI, getBucketsAPI, updateBucketAPI } from "../../../Tax/taxesAPI";

import Cookies from "js-cookie";


export async function getBuckets(): Promise<SavingsBucketRowProps[]> {
    //TODO Wait for backend team to update on final endpoint

    const endpoint = `${import.meta.env.VITE_REACT_URL}/buckets/user`;
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


            // Update redux store
            return transformedBuckets;

        })
        )
        // if (!response.ok) {
        //     throw new Error(`Error: ${response.status} ${response.statusText}`);
        // }

        

        // Call from redux store
    // } catch (error) {
    //     console.error("Failed to fetch user data:", error);
    //     throw error;
    // }
}

export async function postBucket(bucket: RawBucketToSend): Promise<RawBucketToSend> {


    const endpoint = `${import.meta.env.VITE_REACT_URL}/buckets/add`;
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


        return(addBucketsAPI(bucket)
            .then((res) =>{
                const data: RawBucketToSend =  res.data;
                return data;
            })

        )
   
}

export async function putBucket(bucket: RawBucketToSend, id: number): Promise<RawBucketToSend> {

    const endpoint = `${import.meta.env.VITE_REACT_URL}/buckets/update/${id}`;
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


    return(updateBucketAPI(bucket, id)
            .then((res) =>{
                const data: RawBucketToSend =  res.data;
                return data;
            })

        )
}

export async function deleteBucket(id: number) {
    //TODO Wait for backend team to update on final endpoint

    const endpoint = `${import.meta.env.VITE_REACT_URL}/buckets/delete/${id}`;
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
