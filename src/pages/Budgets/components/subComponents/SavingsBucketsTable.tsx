import { Table } from "@trussworks/react-uswds";
import { useEffect, useState } from "react";
import SavingsBucketRow from "./SavingsBucketRow";
import NewBucketModal from "../modals/NewBucketModal";

interface SavingsBucketRowProps {
    data: {
        name: string;
        amount_required: number;
        amount_reserved: number;
        is_currently_reserved: boolean;
    };
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

function transformBuckets(buckets: RawBucket[]): SavingsBucketRowProps[] {
    return buckets.map((bucket) => ({
        data: {
            name: bucket.bucketName,
            amount_required: bucket.amountRequired,
            amount_reserved: bucket.amountAvailable,
            is_currently_reserved: bucket.isReserved
        }
    }));
}

function SavingsBucketTable() {
    const [listOfBuckets, setListOfBuckets] = useState<SavingsBucketRowProps[]>([]);

    useEffect(() => {
        refreshSavingsBuckets();
    }, []);

    async function refreshSavingsBuckets() {
        //GET request to bucket endpoint
        // .then -> setListOfBuckets(response)
        const endpoint = `http://localhost:8080/buckets/user/1`;
        try {
            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include" // Use this if your backend requires cookies or authentication
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            // Parse the JSON response body
            const buckets: RawBucket[] = await response.json();
            const transformedBuckets = transformBuckets(buckets);
            // console.log(transformedBuckets);
            setListOfBuckets(transformedBuckets);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            throw error;
        }

        console.log("refreshed");
    }

    return (
        <>
            <Table className="w-full">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Required</th>
                        <th scope="col">Reserved</th>
                        <th scope="col"> </th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {listOfBuckets.map((rowData: SavingsBucketRowProps, index) => (
                        <SavingsBucketRow key={index} data={rowData.data} />
                    ))}
                </tbody>
            </Table>

            <div className="flex flex-col items-center">
                <NewBucketModal>Add new savings bucket</NewBucketModal>
            </div>
        </>
    );
}

export default SavingsBucketTable;
