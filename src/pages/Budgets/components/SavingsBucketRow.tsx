import { SavingsBucketRowProps } from "../../../util/interfaces/interfaces";

const SavingsBucketRow: React.FC<SavingsBucketRowProps> = ({ data }) => {
    // Your component logic here
    return (
      <tr>
        {/* Render your component using the data */}
        <td>{data.name}</td>
        <td>{data.amount_required}</td>
        <td>{data.amount_reserved}</td>
        <td>{data.is_currently_reserved}</td>
        <td>{data.category}</td>
      </tr>
    );
  };
  
  export default SavingsBucketRow;