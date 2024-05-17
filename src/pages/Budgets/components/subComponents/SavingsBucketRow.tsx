import { Checkbox } from "@trussworks/react-uswds";
import EditBucketModal from "../modals/EditBucketModal";
import { useEffect, useRef, useState } from "react";
import ReservedMoniesInput from "./ReservedMoniesInput";
import { useDispatch, useSelector } from "react-redux";
import { FormSubmissionState, State } from "../../../../util/misc/interfaces";
import { allowNewFetch, markAsReturned, markAsSending } from "../../../../util/redux/formSubmissionStateSlice";
import { useAppSelector } from "../../../../util/redux/hooks";

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
  const dispatch = useDispatch();

  //fetchCall can be either a PUT or a DELETE. 
  const fetchCall = useRef<Promise<Response>>(null);


  const formState = useAppSelector((state) => state.formStatus.status);
  

  useEffect(() => {
    const fetchData = async () => {
      if (formState === State.WAITING) {
        dispatch(markAsSending());
  
        try {
          // Do the fetch here
          const response = await fetchCall.current as Response; 
          const data = await response.json();
          console.log(data)

          dispatch(markAsReturned());
          dispatch(allowNewFetch())
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        if(formState !== State.READY){
          console.error("Attempted to illegally submit form while still waiting on previous form to send");
        }

        console.log(formState)
      }
    };
  
    fetchData(); // Call the async function immediately inside useEffect
  
  }, [dispatch, formState]);
  
  return (
      <tr>
        <td>{data.name}</td>
        {/* TODO Fix css */}
        <td style={{ width: '200px' }}>{data.amount_required}</td>
        {/* TODO add the onChange method to ReservedMoniesInput */}
        <td style={{ width: '200px' }}><ReservedMoniesInput amount={amountReserved} onChange={(amount_reserved: number) => {
          setAmountReserved(amount_reserved);
        }}/></td> 
        <td>
          <Checkbox id={data.name} name={"is_currently_reserved"} label={"Mark as reserved"} checked={currentlyReserved} onChange={() => {
            setCurrentlyReserved(!currentlyReserved);
          }}/>
          </td>
        <td><EditBucketModal action={function (): void {}} data={{...data}}/></td>
      </tr>
    );
  };
  
  export default SavingsBucketRow;