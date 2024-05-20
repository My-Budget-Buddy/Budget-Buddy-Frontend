import { Checkbox } from "@trussworks/react-uswds";
import EditBucketModal from "./modals/EditBucketModal";
import { useState } from "react";
import ReservedMoniesInput from "./subComponents/ReservedMoniesInput";
import DeleteBucketModal from "./modals/DeleteBucketModal";


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

const SavingsBucketRow: React.FC<SavingsBucketRowProps> = ({ data }) => {
  const [currentlyReserved, setCurrentlyReserved] = useState<boolean>(data.is_currently_reserved);

  return (
      <tr>
        <td>{data.name}</td>
        {/* TODO Fix css */}
        <td >{data.amount_required}</td>
        <td ><ReservedMoniesInput amount={data.amount_reserved} onChange={function (n: number): void {
        throw new Error("Function not implemented.");
      } }/></td>
        <td>
          <Checkbox id={data.name} name={"is_currently_reserved"} label={"Mark as reserved"} checked={currentlyReserved} onChange={() => {
            setCurrentlyReserved(!currentlyReserved);
          }}/>
        </td>
        <td>
          <EditBucketModal action={function (): void {}} data={{...data}}/>
          <DeleteBucketModal />
        </td>
      </tr>
    );
  };
  
  export default SavingsBucketRow;