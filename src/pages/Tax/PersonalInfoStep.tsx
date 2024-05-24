import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../util/redux/store";
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
                        <label htmlFor="employerField">Employer's Name</label>
                            <TextInput
                                id="w2EmployerField"
                                name="employer"
                                type="text"
                                //defaultValue="test"
                                value={W2info.employer}
                                onChange={handleChange}
                                validationStatus={errors.employer ? "error" : undefined}
                            />
                            {errors.employer && <span style={{ color: 'red' }}>{errors.employer}</span>}
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="wages">Wages</label>
                            <TextInput
                                id="wages"
                                name="wages"
                                type="text"
                                //defaultValue="test"
                                value={W2info.wages}
                                onChange={handleChange}
                                validationStatus={errors.wages ? "error" : undefined}

                            />
                        {errors.wages && <span style={{ color: 'red' }}>{errors.wages}</span>}
                    </FormGroup>
                </Fieldset>
            </div>
        </>
    );
};

export default PersonalInfoStep;