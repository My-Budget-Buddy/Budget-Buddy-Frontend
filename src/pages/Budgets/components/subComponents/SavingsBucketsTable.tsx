import { Table } from "@trussworks/react-uswds";
import { useEffect, useState } from "react";
import SavingsBucketRow from "./SavingsBucketRow";
import NewBucketModal from "../modals/NewBucketModal";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { updateBuckets } from "../../../../util/redux/bucketSlice";
import { SavingsBucketRowProps } from "../../../../types/budgetInterfaces";
import { getBuckets } from "../requests/requests";

function SavingsBucketTable() {
    const [listOfBuckets, setListOfBuckets] = useState<SavingsBucketRowProps[]>([]);

    const dispatch = useAppDispatch();
    const storedBuckets = useAppSelector((state) => state.buckets.buckets);
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);

    // TODO Calculate total reserved and push that to the redux store every GET
    // const totalReserved = useAppSelector((state) => state.buckets.totalReserved);

    useEffect(() => {
        (async () => {
            const transformedBuckets = await getBuckets();
            dispatch(updateBuckets(transformedBuckets));
        })();
    }, [isSending]);

    useEffect(() => {
        setListOfBuckets(storedBuckets);
        // TODO Calculated total reserved then Dispatch to totalReserved.
    }, [storedBuckets]);

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
