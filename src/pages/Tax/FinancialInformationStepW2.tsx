import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../util/redux/store";
import { setW2Info } from "./W2Slice";
import { setOtherIncomeInfo } from "./otherIncomeSlice";
import { Fieldset, Form, FormGroup, Label, TextInput } from "@trussworks/react-uswds";
import { setTaxReturnInfo } from "./TaxReturnSlice";
const FinancialInformationStepW2: React.FC = () => {


    
    const otherIncome = useSelector((state : RootState) => state.otherIncome);
    
    const dispatch = useDispatch();
    
    const [errors2, setErrors2] = useState<typeof otherIncome>({} as typeof otherIncome);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let error = '';
        if (name === 'formType' && value.length < 2) {
          error = 'Form type must be at least 2 characters long.';
        } else if (name === 'status' && value.length < 3) {
          error = 'Status must be at least 3 characters long.';
        }
    
        
        setErrors2({ ...errors2, [name]: error });
    
        if (!error) {
          const updatedOtherIncome = { ...otherIncome, [name]: value };
          
          dispatch(setOtherIncomeInfo(updatedOtherIncome));
          
        }
      };

    return (
        <>
            <div>
                
                    <FormGroup >
                        <label htmlFor="otherIncome">Long Term Capital Gains</label>
                            <TextInput
                                id="otherIncome"
                                name="oilongTermCapitalGains"
                                type="text"
                                //defaultValue="test"
                                value={otherIncome.oilongTermCapitalGains}
                                onChange={handleChange}
                                validationStatus={errors2.oilongTermCapitalGains ? "error" : undefined}
                            />
                            {errors2.oilongTermCapitalGains && <span style={{ color: 'red' }}>{errors2.oilongTermCapitalGains}</span>}
                    </FormGroup>

                    <FormGroup >
                        <label htmlFor="otherIncome">Short Term Capital Gains</label>
                            <TextInput
                                id="otherIncome"
                                name="oishortTermCapitalGains"
                                type="text"
                                //defaultValue="test"
                                value={otherIncome.oishortTermCapitalGains}
                                onChange={handleChange}
                                validationStatus={errors2.oishortTermCapitalGains ? "error" : undefined}
                            />
                            {errors2.oishortTermCapitalGains && <span style={{ color: 'red' }}>{errors2.oishortTermCapitalGains}</span>}
                    </FormGroup>

                    <FormGroup >
                        <label htmlFor="otherIncome">Other Investment Income</label>
                            <TextInput
                                id="otherIncome"
                                name="oiotherInvestmentIncome"
                                type="text"
                                //defaultValue="test"
                                value={otherIncome.oiotherInvestmentIncome}
                                onChange={handleChange}
                                validationStatus={errors2.oiotherInvestmentIncome ? "error" : undefined}
                            />
                            {errors2.oiotherInvestmentIncome && <span style={{ color: 'red' }}>{errors2.oiotherInvestmentIncome}</span>}
                    </FormGroup>

                    <FormGroup >
                        <label htmlFor="otherIncome">Net Business Income</label>
                            <TextInput
                                id="otherIncome"
                                name="oinetBusinessIncome"
                                type="text"
                                //defaultValue="test"
                                value={otherIncome.oinetBusinessIncome}
                                onChange={handleChange}
                                validationStatus={errors2.oinetBusinessIncome ? "error" : undefined}
                            />
                            {errors2.oinetBusinessIncome && <span style={{ color: 'red' }}>{errors2.oinetBusinessIncome}</span>}
                    </FormGroup>

                    <FormGroup >
                        <label htmlFor="otherIncome">Additional Income</label>
                            <TextInput
                                id="otherIncome"
                                name="oiadditionalIncome"
                                type="text"
                                //defaultValue="test"
                                value={otherIncome.oiadditionalIncome}
                                onChange={handleChange}
                                validationStatus={errors2.oiadditionalIncome ? "error" : undefined}
                            />
                            {errors2.oiadditionalIncome && <span style={{ color: 'red' }}>{errors2.oiadditionalIncome}</span>}
                    </FormGroup>
               
            </div>
        </>
    );
};
      

export default FinancialInformationStepW2;