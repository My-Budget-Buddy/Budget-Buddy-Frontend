import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { setW2Info } from "./W2Slice";
import { Fieldset, Form, FormGroup, Label, TextInput } from "@trussworks/react-uswds";

const PersonalInfoStep: React.FC = () => {

    const W2info = useSelector((state: RootState) => state.w2); 
    const dispatch = useDispatch();

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
        
        const { name, value } = e.target;
        const updateW2info = { ...W2info, [name]: value };
        dispatch(setW2Info(updateW2info));
        
    };


    return(
        <>

            
            
            <div>
                <Fieldset legend="Employer's Address" legendStyle='large'>
                    
                    <FormGroup>
                        <Label htmlFor="cstreet">Test</Label>
                        <TextInput
                            id='cstreet'
                            name='formType'
                            type='text'
                            defaultValue="test"
                            value={W2info.formType}
                            onChange={handleChange}
                            
                        />
                    </FormGroup>
                   
                </Fieldset>
            </div>

        
        </>
    )
}

export default PersonalInfoStep;