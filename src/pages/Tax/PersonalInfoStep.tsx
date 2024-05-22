import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { setW2Info } from "./W2Slice";
import { Fieldset, Form, FormGroup, Label, TextInput } from "@trussworks/react-uswds";

const PersonalInfoStep: React.FC = () => {

    const W2info = useSelector((state: RootState) => state.w2); 
    const dispatch = useDispatch();
    const [errors, setErrors] = useState<typeof W2info>({} as typeof W2info);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let error = '';
        if (name === 'formType' && value.length < 2) {
          error = 'Form type must be at least 2 characters long.';
        } else if (name === 'status' && value.length < 3) {
          error = 'Status must be at least 3 characters long.';
        }
    
        setErrors({ ...errors, [name]: error });
    
        if (!error) {
          const updatedW2info = { ...W2info, [name]: value };
          dispatch(setW2Info(updatedW2info));
        }
      };

    return (
        <>
            <div>
                <Fieldset legend="Employer's Address" legendStyle="large">
                    <FormGroup >
                        <label htmlFor="cstreet">Test</label>
                            <TextInput
                                id="cstreet2"
                                name="formType"
                                type="text"
                                defaultValue="test"
                                value={W2info.formType}
                                onChange={handleChange}
                                validationStatus={errors.formType ? "error" : undefined}
                            />
                            {errors.formType && <span style={{ color: 'red' }}>{errors.formType}</span>}
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="cstreet">Test</label>
                            <TextInput
                                id="cstreet2"
                                name="status"
                                type="text"
                                defaultValue="test"
                                value={W2info.status}
                                onChange={handleChange}
                                validationStatus={errors.status ? "error" : undefined}

                            />
                        {errors.status && <span style={{ color: 'red' }}>{errors.status}</span>}
                    </FormGroup>
                </Fieldset>
            </div>
        </>
    );
};

export default PersonalInfoStep;