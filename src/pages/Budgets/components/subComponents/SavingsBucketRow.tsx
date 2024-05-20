import { Checkbox } from "@trussworks/react-uswds";
import EditBucketModal from "../modals/EditBucketModal";
import { useEffect, useRef, useState } from "react";
import ReservedMoniesInput from "./ReservedMoniesInput";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import DeleteBucketModal from "../modals/DeleteBucketModal";
import { setIsSending } from "../../../../util/redux/simpleSubmissionSlice";
import { timedDelay } from "../../../../util/util";

interface SavingsBucketRowProps {
  // Nested data interface is useful to keep simple top level component declarations
  data: {
    name: string;
    amount_required: number;
    amount_reserved: number;
    is_currently_reserved: boolean;
  };
}

const SavingsBucketRow: React.FC<SavingsBucketRowProps> = ({ data }) => {
  const [currentlyReserved, setCurrentlyReserved] = useState<boolean>(data.is_currently_reserved);
  const [amountReserved, setAmountReserved] = useState<number>(data.amount_reserved);
  const dispatch = useAppDispatch();  
  const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);    

  //Buffered submission for PUT requests that change the reserved amount/is_currently_reserved. If no new changes in 5 seconds, then send the PUT.
  const [lastEditTime, setLastEditTime] = useState<Date | null>(null);
  const timerRef = useRef<number | null>(null);
  const [isCurrentlyEditing, setIsCurrentlyEditing] = useState<boolean>(false);

  const handleReservedChange = (amount_reserved: number) => {
    console.log("changed");
    setAmountReserved(amount_reserved);
    setIsCurrentlyEditing(true);
    setLastEditTime(new Date());
  };

  const handleCheckboxCheck = () => {
    console.log("changed");
    setCurrentlyReserved(!currentlyReserved);    
    setIsCurrentlyEditing(true);
    setLastEditTime(new Date());
  };


  async function sendUpdatedBucket(bucket : SavingsBucketRowProps){
    // Sets buttons to 'waiting', prevent closing
    dispatch(setIsSending(true));

    //send post to endpoint
    //on success, refreshSavingsBuckets();

    //POST to endpoint
    // const repsonse = await fetch(... send bucket)
    console.log("UPDATING BUCKET..."); // <--- This is the bucket to send to the post endpoint

    await timedDelay(1000);

    console.log("BUCKET SENT: ", bucket)
    setIsCurrentlyEditing(false)

    //if good: refreshSavingsBuckets
    //else: return error

    // Reallow all user input again
    dispatch(setIsSending(false));
}

const [initialized, setInitialized] = useState(false);

useEffect(() => {
  // After component mounts, set initialized to true
  setInitialized(true);
}, []);


  useEffect(() => {
    if (lastEditTime && isCurrentlyEditing) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        // TODO SEND PUT REQUEST 
        sendUpdatedBucket({data}); //TODO Use updated data fields (this just uses what was passed from the GET )
      }, 1000);
    }

    // Cleanup the timeout when the component unmounts
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [lastEditTime]);




  return (
      <tr>
        <td>{data.name}</td>
        {/* TODO Fix css */}
        <td style={{ width: '200px' }}>{data.amount_required}</td>
        {/* TODO add the onChange method to ReservedMoniesInput */}
        <td style={{ width: '200px' }}>
          <ReservedMoniesInput 
            amount={amountReserved} 
            onChange={initialized ? handleReservedChange : () => {console.log("Initialized")}} 
            disabled={isSending}/>
        </td> 
        <td>
          <Checkbox id={data.name} name={"is_currently_reserved"} label={"Mark as reserved"} checked={currentlyReserved} disabled={isSending} onChange={handleCheckboxCheck}/>
          </td>
        <td>
          <EditBucketModal data={{data}}> EDIT BUCKET MODAL </EditBucketModal>
          <DeleteBucketModal />
        </td>
      </tr>
    );
  };
  
  export default SavingsBucketRow;