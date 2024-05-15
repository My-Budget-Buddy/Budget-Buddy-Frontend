import {  Table } from "@trussworks/react-uswds";
import { useEffect, useState } from "react";
import SavingsBucketRow from "./SavingsBucketRow";
import NewBucketModal from "./NewBucketModal";

interface SavingsBucketRowProps {
    data: {
      name: string;
      amount_required: number;
      amount_reserved: number;
      is_currently_reserved: boolean;
      category: string;
      // Add more fields as needed
    };
  }

function SavingsBucketTable() {
    const [listOfBuckets, setListOfBuckets] = useState<SavingsBucketRowProps[]>([]);

    useEffect(() => {
        refreshSavingsBuckets();
    }, []);

    const sendNewBucket = () => {
        //send post to endpoint
        //on success, refreshSavingsBuckets();
    }

    function refreshSavingsBuckets() {
        //GET request to bucket endpoint
        // .then -> setListOfBuckets(response)
        setListOfBuckets([
            {data: { name: "name", amount_required: 1000, amount_reserved: 5, is_currently_reserved: false, category: "misc" }}, 
            {data: { name: "name2", amount_required: 1000, amount_reserved: 5, is_currently_reserved: false, category: "misc" }}
        ]);
    }
    
    return (
        <>
            <div>Buckets Table</div>

            <Table>
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">required</th>
                        <th scope="col">reserved</th>
                        <th scope="col"> --- </th>
                        <th scope="col">category</th>
                    </tr>
                </thead>
                <tbody>
                    {listOfBuckets.map((rowData: SavingsBucketRowProps, index) => (
                        <SavingsBucketRow key={index} data={rowData.data} />
                    ))}
                </tbody>
            </Table>

            <NewBucketModal action={sendNewBucket}>
                Add new savings bucket
            </NewBucketModal>

        </>
    );
}

export default SavingsBucketTable;
