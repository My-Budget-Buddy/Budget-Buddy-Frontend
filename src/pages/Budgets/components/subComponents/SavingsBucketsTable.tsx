import {  Table } from "@trussworks/react-uswds";
import { useEffect, useState } from "react";
import SavingsBucketRow from "./SavingsBucketRow";
import NewBucketModal from "../modals/old_newbucketmodal";

interface SavingsBucketRowProps {
    data: {
      name: string;
      amount_required: number;
      amount_reserved: number;
      is_currently_reserved: boolean;
    };
  }

function SavingsBucketTable() {
    const [listOfBuckets, setListOfBuckets] = useState<SavingsBucketRowProps[]>([]);

    useEffect(() => {
        refreshSavingsBuckets();
    }, []);

    async function refreshSavingsBuckets() {
        //GET request to bucket endpoint
        // .then -> setListOfBuckets(response)

        //const response = await fetch(...);

        //setListOfBuckets(response);

        setListOfBuckets([
            {data: { name: "name", amount_required: 1000, amount_reserved: 5, is_currently_reserved: false}}, 
            {data: { name: "name2", amount_required: 1000, amount_reserved: 5, is_currently_reserved: true}}
        ]);

        console.log("refreshed")
    }
    
    return (
        <>
            <Table className='w-full'>
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
                <NewBucketModal>
                    Add new savings bucket
                </NewBucketModal>
            </div>

        </>
    );
}

export default SavingsBucketTable;
