
/**
 * In the future, we should remove the modals and use custom input components in their place. 
 * Essentially, the custom input component would add or replace a new or existing bucket/budget row, allowing you to 'edit in place'. This would allow the user to stay on the same page, see/interact with all the data on the page, and not break user flow like a modal would (remember, we are supposed to use modals sparingly). 
 * A preliminary idea is to have add new InputSavingsBucketRow when the 'add savings bucket' button is pressed. This new bucket would have input fields rather than read-only fields. Then the user presses a 'submit' button on that row to attempt to save the bucket. 
 * Similarly, the edit bucket button would do something similar, replacing the existing row with an editable row, and with accompanying submit/discard buttons. 
 */


interface SavingsBucketRowProps {
  // Nested data interface is useful to keep simple top level component declarations
  data: {
    name: string;
    amount_required: number;
    amount_reserved: number;
    is_currently_reserved: boolean;
  };
}

const InputSavingsBucketRow: React.FC<SavingsBucketRowProps> = ({ data }) => {

  return (
      <tr>
        <td>{data.name}</td>
        {/* TODO */}
      </tr>
    );
  };
  
  export default InputSavingsBucketRow;