import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../util/redux/store";
import { setW2Info } from "./W2Slice";
import { Fieldset, Form, FormGroup, Label, TextInput } from "@trussworks/react-uswds";
import { setTaxReturnInfo } from "./TaxReturnSlice";

const WwStep: React.FC = () => {
    const W2info = useSelector((state: RootState) => state.w2); 
    const taxReturnInfo = useSelector((state:RootState) => state.taxReturn.taxReturn)
    const dispatch = useDispatch();
    const [errors, setErrors] = useState<typeof W2info>({} as typeof W2info);
    const [errors2, setErrors2] = useState<typeof taxReturnInfo>({} as typeof taxReturnInfo);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let error = '';
        if (name === 'formType' && value.length < 2) {
          error = 'Form type must be at least 2 characters long.';
        } else if (name === 'status' && value.length < 3) {
          error = 'Status must be at least 3 characters long.';
        }
    
        setErrors({ ...errors, [name]: error });
        setErrors2({ ...errors2, [name]: error });
    
        if (!error) {
          const updatedW2info = { ...W2info, [name]: value };
          const updatedTaxReturnInfo = {...taxReturnInfo, [name]: value}
          dispatch(setW2Info(updatedW2info));
          dispatch(setTaxReturnInfo(updatedTaxReturnInfo));
        }
      };

    return (<>
        
            <div>
                
                    <FormGroup >
                        <label htmlFor="state">State</label>
                            <TextInput
                                id="state"
                                name="state"
                                type="text"
                                //defaultValue="test"
                                value={W2info.state}
                                onChange={handleChange}
                                validationStatus={errors.state ? "error" : undefined}
                            />
                            {errors.state && <span style={{ color: 'red' }}>{errors.state}</span>}
                    </FormGroup>

                    <FormGroup >
                        <label htmlFor="employer">Employer</label>
                            <TextInput
                                id="employer"
                                name="employer"
                                type="text"
                                //defaultValue="test"
                                value={W2info.employer}
                                onChange={handleChange}
                                validationStatus={errors.employer ? "error" : undefined}
                            />
                            {errors.employer && <span style={{ color: 'red' }}>{errors.employer}</span>}
                    </FormGroup>

                    <FormGroup >
                        <label htmlFor="wages">wages</label>
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

                    <FormGroup >
                        <label htmlFor="federalIncomeTaxWithheld">Federal Income Tax Withheld</label>
                            <TextInput
                                id="federalIncomeTaxWithheld"
                                name="federalIncomeTaxWithheld"
                                type="text"
                                //defaultValue="test"
                                value={W2info.federalIncomeTaxWithheld}
                                onChange={handleChange}
                                validationStatus={errors.federalIncomeTaxWithheld ? "error" : undefined}
                            />
                            {errors.federalIncomeTaxWithheld && <span style={{ color: 'red' }}>{errors.federalIncomeTaxWithheld}</span>}
                    </FormGroup>

                    <FormGroup >
                        <label htmlFor="stateIncomeTaxWithheld">State Income Tax Withheld</label>
                            <TextInput
                                id="stateIncomeTaxWithheld"
                                name="stateIncomeTaxWithheld"
                                type="text"
                                //defaultValue="test"
                                value={W2info.stateIncomeTaxWithheld}
                                onChange={handleChange}
                                validationStatus={errors.stateIncomeTaxWithheld ? "error" : undefined}
                            />
                            {errors.stateIncomeTaxWithheld && <span style={{ color: 'red' }}>{errors.stateIncomeTaxWithheld}</span>}
                    </FormGroup>

                    <FormGroup >
                        <label htmlFor="socialSecurityTaxWithheld">Social Security Tax Withheld</label>
                            <TextInput
                                id="socialSecurityTaxWithheld"
                                name="socialSecurityTaxWithheld"
                                type="text"
                                //defaultValue="test"
                                value={W2info.socialSecurityTaxWithheld}
                                onChange={handleChange}
                                validationStatus={errors.socialSecurityTaxWithheld ? "error" : undefined}
                            />
                            {errors.socialSecurityTaxWithheld && <span style={{ color: 'red' }}>{errors.socialSecurityTaxWithheld}</span>}
                    </FormGroup>

                    <FormGroup >
                        <label htmlFor="medicareTaxWithheld">Medicare Tax Withheld</label>
                            <TextInput
                                id="medicareTaxWithheld"
                                name="medicareTaxWithheld"
                                type="text"
                                //defaultValue="test"
                                value={W2info.medicareTaxWithheld}
                                onChange={handleChange}
                                validationStatus={errors.medicareTaxWithheld ? "error" : undefined}
                            />
                            {errors.medicareTaxWithheld && <span style={{ color: 'red' }}>{errors.medicareTaxWithheld}</span>}
                    </FormGroup>
                
            </div>
        </>
    );
};

export default WwStep;