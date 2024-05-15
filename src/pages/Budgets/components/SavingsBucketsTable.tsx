import { Button, Table } from "@trussworks/react-uswds";
import { useEffect, useState } from "react";
import SavingsBucketRow from "./SavingsBucketRow";
import { SavingsBucketRowProps } from "../../../util/interfaces/interfaces";

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
        setListOfBuckets([{data: { name: "name", amount: 5, category: "misc" }},{data: { name: "name2", amount: 55, category: "misc" }}]);
    }
    
    return (
        <>
            <Table>

                <thead>
                <p>Buckets Table</p>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">amount</th>
                        <th scope="col">category</th>
                    </tr>
                </thead>
                <tbody>
                    {listOfBuckets.map((rowData: SavingsBucketRowProps, index) => (
                        <SavingsBucketRow key={index} data={rowData.data} />
                    ))}
                </tbody>
            </Table>

            <Button onClick={sendNewBucket} type={"button"}>Add new savings bucket</Button>
        </>
    );
}

export default SavingsBucketTable;
