import { Button } from "@trussworks/react-uswds";
import { useState } from "react";
import SavingsBucketRow from "./SavingsBucketRow";

function SavingsBucketTable() {

    //useeffect refreshBuckets() (calls fetch)

    const sendNewBucket = () => {
        setListOfBuckets([]);

        //Fetch all buckets
        //.then setListOfBuckets(response)
    }

    //On post return-> refreshBuckets()

    const [listOfBuckets, setListOfBuckets] = useState([]);
    
    return (
        <>
        <p>Buckets Table</p>
        {listOfBuckets.map((_rowData, index) => (
          <SavingsBucketRow key={index} />
        ))}
        <Button onClick={sendNewBucket} type={"button"}>Add new savings bucket</Button>
        </>
    );
  }
  
export default SavingsBucketTable;


