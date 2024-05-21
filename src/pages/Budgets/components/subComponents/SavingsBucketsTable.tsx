import { Table } from "@trussworks/react-uswds";
import { useEffect, useState } from "react";
import SavingsBucketRow from "./SavingsBucketRow";
import NewBucketModal from "../modals/NewBucketModal";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { updateBuckets } from "../../../../util/redux/bucketSlice";

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

// The data from the endpoint needs to be trimmed down to this.
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

    const dispatch = useAppDispatch();
    const storedBuckets = useAppSelector((state) => state.buckets.buckets);
    // const totalReserved = useAppSelector((state) => state.buckets.totalReserved);

    useEffect(() => {
        refreshSavingsBuckets();
    }, []);

    useEffect(() => {
        setListOfBuckets(storedBuckets);
    }, [storedBuckets]);

    async function refreshSavingsBuckets() {
        const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/buckets/user/1`;
        console.log(endpoint);
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
            dispatch(updateBuckets(transformedBuckets));

            // Call from redux store
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
