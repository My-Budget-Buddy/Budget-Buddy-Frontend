import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { setW2Info } from "./W2Slice";
import { Fieldset, Form, FormGroup, Label, TextInput } from "@trussworks/react-uswds";

const PersonalInfoStep: React.FC = () => {

    const W2info = useSelector((state: RootState) => state.w2); 
    const dispatch = useDispatch();
    const [errors, setErrors] = useState<typeof W2info>({} as typeof W2info); // Initialize with same structure as W2info
    // let hasError = false;
    const [hasError, setHasError] = useState<boolean>();
    // let test : string = "false" as string;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Validation logic
        let error = '';
        if (name === 'formType' && value.length < 2) {
            error = 'Form type must be at least 2 characters long.';
            setHasError(true);
            
            
        }
        // Add more validation rules as needed

        setErrors({ ...errors, [name]: error });

        // Update form data only if no errors
        if (!error) {
            const updatedW2info = { ...W2info, [name]: value };
            dispatch(setW2Info(updatedW2info));
            setHasError(false);
        }
        console.log(hasError)
    };

    return (
        <>
            <div>
                <Fieldset legend="Employer's Address" legendStyle="large">
                
                    <FormGroup >
                        <label htmlFor="cstreet">Test</label>
                        {hasError ? 
                        <TextInput
                            id="cstreet2"
                            name="formType"
                            type="text"
                            defaultValue="test"
                            value={W2info.formType}
                            onChange={handleChange}
                            validationStatus="error"
                            
                        />
                        :
                        <TextInput
                            id="cstreet1"
                            name="formType"
                            type="text"
                            defaultValue="test"
                            value={W2info.formType}
                            onChange={handleChange}
                            
                            
                        />}      
                        {errors.formType && <span style={{ color: 'red' }}>{errors.formType}</span>}
                    </FormGroup>
                    
                </Fieldset>
            </div>
        </>
    );
};

export default PersonalInfoStep;