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