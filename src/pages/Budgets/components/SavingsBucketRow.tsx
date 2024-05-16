import { Checkbox } from "@trussworks/react-uswds";
import EditBucketModal from "./EditBucketModal";
import { useState } from "react";
import ReservedMoniesInput from "./ReservedMoniesInput";


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
        <td style={{ width: '200px' }}>{data.amount_required}</td>
        <td style={{ width: '200px' }}><ReservedMoniesInput amount={data.amount_reserved}/></td>
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