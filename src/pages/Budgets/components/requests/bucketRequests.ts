import { SavingsBucketRowProps } from "../../../../types/budgetInterfaces";
import { addBucketsAPI, deleteBucketAPI, getBucketsAPI, updateBucketAPI } from "../../../Tax/taxesAPI";

export async function getBuckets(): Promise<SavingsBucketRowProps[]> {
    //TODO Wait for backend team to update on final endpoint
    //const endpoint = `/buckets/user/1`;
    // try {
        console.log("getting... ");
        return(getBucketsAPI()
        .then((res) =>{
            const buckets: RawBucket[] =  res.data;
            console.log(`/////////////////////////////////////////////////////////`);
            console.log(buckets);

            const transformedBuckets = transformBuckets(buckets);

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
    //const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/buckets/add`;

        return(addBucketsAPI(bucket)
            .then((res) =>{
                const data: RawBucketToSend =  res.data;
                return data;
            })

        )
   
}

export async function putBucket(bucket: RawBucketToSend, id: number): Promise<RawBucketToSend> {
    //const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/buckets/update/${id}`;

    return(updateBucketAPI(bucket, id)
            .then((res) =>{
                const data: RawBucketToSend =  res.data;
                return data;
            })

        )
}

export async function deleteBucket(id: number) {
    //TODO Wait for backend team to update on final endpoint
    //const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/buckets/delete/${id}`;
    deleteBucketAPI(id);
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
