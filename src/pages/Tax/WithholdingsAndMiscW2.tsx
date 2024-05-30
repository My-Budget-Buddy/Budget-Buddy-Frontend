import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../util/redux/store";
import { Button, FormGroup, Table, TextInput } from "@trussworks/react-uswds";
import { deductions } from "./deductionsSlice";
import { findW2sByTaxReturnIdAPI } from "./taxesAPI";
import { setDeductionsInfo } from "./deductionsSlice";

const WithholdingsAndMiscW2: React.FC = () => {
    const deductionsState = useSelector((state: RootState) => state.deductions);
    
    const [deductionsList, setDeductions] =  useState<deductions[]>([]);
    //const taxReturnInfo = useSelector((state:RootState) => state.taxReturn.taxReturn)
    const dispatch = useDispatch();
    const [errors, setErrors] = useState<typeof deductionsState>({} as typeof deductionsState);
   // const [errors2, setErrors2] = useState<typeof taxReturnInfo>({} as typeof taxReturnInfo);
   const [editingItem, setEditingItem] = useState<deductions>();
   const [newItem, setNewItem] = useState<deductions>();
   const [lastId, setLastId] = useState<number>(0);

   useEffect(() => {
    findW2sByTaxReturnIdAPI()
    .then((res) => {
        const result: deductions[] = [];
    for (const payload of res.data) {
        const mappedPayload: deductions = {
            dedid : payload.id,
            dedtaxReturn : payload.taxReturn,
            deddeduction : payload.deduction,
            deddeductionName : payload.deductionName,
            dedamountSpent : payload.amountSpent,
            dednetDeduction : payload.netDeduction
        };
        result.push(mappedPayload);
    }
        const maxId = res.data.reduce((max: number, item: { id: number; }) => Math.max(max, item.id), 0);
        setLastId(maxId);
        console.log(result);
        setDeductions(result);
    })

   }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let error = '';
        if (name === 'w2state' && value.length > 2) {
          error = 'Must Use 2 Letter State Abbreviation';
        } else if (name === 'status' && value.length < 3) {
          error = 'Status must be at least 3 characters long.';
        }
    
        setErrors({ ...errors, [name]: error });
        //setErrors2({ ...errors2, [name]: error });
    
        if (!error) {
          const updatedDeductions = { ...deductionsState, [name]: value };
          //const updatedTaxReturnInfo = {...taxReturnInfo, [name]: value}
          dispatch(setDeductionsInfo(updatedDeductions));
          //dispatch(setTaxReturnInfo(updatedTaxReturnInfo));
        }
      };

      const handleSaveClick = (editedItem: deductions) => {
        const updatedList = deductionsList.map(item =>
            item.dedid === editedItem.dedid ? editedItem : item
        );
        setDeductions(updatedList);
        setEditingItem(undefined);
    };
    

      const handleEditClick = (item: deductions) => {
        setEditingItem(item);
        dispatch(setDeductionsInfo(item));
    };

    const handleSubmit = () => {
        //createW2API(W2s);
    };

    const handleAddClick = () => {
        const newId = lastId + 1; 
        setDeductions(prevList => [...prevList, { ...newItem, dedid: newId, dedamountSpent: 0, deddeduction: 0, deddeductionName: "", dednetDeduction: 0, dedtaxReturn: 1 }]);
        setLastId(newId);
        setNewItem({ ...newItem, dedid: newId, dedamountSpent: 0, deddeduction: 0, deddeductionName: "", dednetDeduction: 0, dedtaxReturn: 1  });
    };

    const handleDeleteClick = (id: number | undefined) => {
        if (id === undefined){
            return;
        }
        setDeductions(prevList =>
            prevList.filter(item => item.dedid !== id)
        );
    };

   
    return (<>
 <div>
            
            <Table>
                <thead>
                    <tr>
                        <th>Deduction Type</th>
                        <th>Deduction Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {deductionsList.map(item => (
                        <tr key={item.dedid}>
                            <td>{item.deddeduction}</td>
                            <td>{item.dedamountSpent}</td>
                            <td>
                                <Button type="button" onClick={() => handleEditClick(item)}>Edit</Button>
                                <Button type="button" onClick={() => handleDeleteClick(item.dedid)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </div>
            <Button type="button" onClick={handleAddClick}>Add</Button>
            <Button type="button" onClick={handleSubmit}>Submit</Button>
            {editingItem && (
        
            <div>
                
                    <FormGroup >
                        <label htmlFor="state">Deduction Type</label>
                            <TextInput
                                id="state"
                                name="deddeduction"
                                type="text"
                                //defaultValue="test"
                                value={deductionsState.deddeduction}
                                onChange={handleChange}
                                validationStatus={errors.deddeduction ? "error" : undefined}
                            />
                            {errors.deddeduction && <span style={{ color: 'red' }}>{errors.deddeduction}</span>}
                    </FormGroup>

                    <FormGroup >
                        <label htmlFor="employer">Deduction Amount</label>
                            <TextInput
                                id="employer"
                                name="dedamountSpent"
                                type="text"
                                //defaultValue="test"
                                value={deductionsState.dedamountSpent}
                                onChange={handleChange}
                                validationStatus={errors.dedamountSpent ? "error" : undefined}
                            />
                            {errors.dedamountSpent && <span style={{ color: 'red' }}>{errors.dedamountSpent}</span>}
                    </FormGroup>

                  

                    <button onClick={() => handleSaveClick(deductionsState)}>Save</button>
                
            </div>

            )}
            
        </>
    );
};
export default WithholdingsAndMiscW2;