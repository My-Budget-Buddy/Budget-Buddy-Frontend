import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../util/redux/store";
import { setW2Info } from "./W2Slice";
import { Fieldset, Form, FormGroup, Label, TextInput } from "@trussworks/react-uswds";
import { setTaxReturnInfo } from "./TaxReturnSlice";
const FinancialInformationStepW2: React.FC = () => {


    
    
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

    return (
        <>
            <div>
                
                    {/* <FormGroup >
                        <label htmlFor="otherIncome">Other Income</label>
                            <TextInput
                                id="otherIncome"
                                name="otherIncome"
                                type="text"
                                //defaultValue="test"
                                value={taxReturnInfo.otherIncome}
                                onChange={handleChange}
                                validationStatus={errors2.otherIncome ? "error" : undefined}
                            />
                            {errors2.otherIncome && <span style={{ color: 'red' }}>{errors2.otherIncome}</span>}
                    </FormGroup>

                    <FormGroup >
                        <label htmlFor="taxCredit">Tax Credit</label>
                            <TextInput
                                id="taxCredit"
                                name="taxCredit"
                                type="text"
                                //defaultValue="test"
                                value={taxReturnInfo.taxCredit}
                                onChange={handleChange}
                                validationStatus={errors2.taxCredit ? "error" : undefined}
                            />
                            {errors2.taxCredit && <span style={{ color: 'red' }}>{errors2.taxCredit}</span>}
                    </FormGroup>

                    <FormGroup >
                        <label htmlFor="fedTaxWithheld">Additional Federal Tax Withheld</label>
                            <TextInput
                                id="fedTaxWithheld"
                                name="taxReturnInfo.fedTaxWithheld"
                                type="text"
                                //defaultValue="test"
                                value={taxReturnInfo.fedTaxWithheld}
                                onChange={handleChange}
                                validationStatus={errors2.fedTaxWithheld ? "error" : undefined}
                            />
                            {errors2.fedTaxWithheld && <span style={{ color: 'red' }}>{errors2.fedTaxWithheld}</span>}
                    </FormGroup>

                    <FormGroup >
                        <label htmlFor="stateTaxWithheld">Additional State Tax Withheld</label>
                            <TextInput
                                id="stateTaxWithheld"
                                name="stateTaxWithheld"
                                type="text"
                                //defaultValue="test"
                                value={taxReturnInfo.stateTaxWithheld}
                                onChange={handleChange}
                                validationStatus={errors2.stateTaxWithheld ? "error" : undefined}
                            />
                            {errors2.stateTaxWithheld && <span style={{ color: 'red' }}>{errors2.stateTaxWithheld}</span>}
                    </FormGroup>

                    <FormGroup >
                        <label htmlFor="socialSecurityTaxWithheld">Additional Social Security Tax Withheld</label>
                            <TextInput
                                id="socialSecurityTaxWithheld"
                                name="socialSecurityTaxWithheld"
                                type="text"
                                //defaultValue="test"
                                value={taxReturnInfo.socialSecurityTaxWithheld}
                                onChange={handleChange}
                                validationStatus={errors2.socialSecurityTaxWithheld ? "error" : undefined}
                            />
                            {errors2.socialSecurityTaxWithheld && <span style={{ color: 'red' }}>{errors2.socialSecurityTaxWithheld}</span>}
                    </FormGroup>

                    <FormGroup >
                        <label htmlFor="medicareTaxWithheld">Additional Medicare Tax Withheld</label>
                            <TextInput
                                id="medicareTaxWithheld"
                                name="medicareTaxWithheld"
                                type="text"
                                //defaultValue="test"
                                value={taxReturnInfo.medicareTaxWithheld}
                                onChange={handleChange}
                                validationStatus={errors2.medicareTaxWithheld ? "error" : undefined}
                            />
                            {errors2.medicareTaxWithheld && <span style={{ color: 'red' }}>{errors2.medicareTaxWithheld}</span>}
                    </FormGroup> */}
               
            </div>
        </>
    );
};
      

export default FinancialInformationStepW2;