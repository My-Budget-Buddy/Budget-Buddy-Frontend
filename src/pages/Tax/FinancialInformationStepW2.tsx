/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../util/redux/store";
import { setW2Info } from "./W2Slice";
import { otherIncome, setOtherIncomeInfo } from "./otherIncomeSlice";
import { Button, Fieldset, Form, FormGroup, Grid, GridContainer, Label, TextInput } from "@trussworks/react-uswds";
import { setTaxReturnInfo } from "./TaxReturnSlice";
import { addOtherIncomeAPI, getOtherIncomeAPI } from "./taxesAPI";
const FinancialInformationStepW2: React.FC = () => {
    const otherIncomeState = useSelector((state: RootState) => state.otherIncome);

    const dispatch = useDispatch();

    const [errors2, setErrors2] = useState<typeof otherIncomeState>({} as typeof otherIncomeState);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let error = "";
        if (name === "formType" && value.length < 2) {
            error = "Form type must be at least 2 characters long.";
        } else if (name === "status" && value.length < 3) {
            error = "Status must be at least 3 characters long.";
        }

        setErrors2({ ...errors2, [name]: error });

        if (!error) {
            const updatedOtherIncome = { ...otherIncomeState, [name]: value };

            dispatch(setOtherIncomeInfo(updatedOtherIncome));
        }
    };

    useEffect(() => {
        getOtherIncomeAPI().then((res) => {
            const mapped_res: otherIncome = {
                oitaxReturnId: res.data.taxReturnId,
                oilongTermCapitalGains: res.data.longTermCapitalGains,
                oishortTermCapitalGains: res.data.shortTermCapitalGains,
                oiotherInvestmentIncome: res.data.otherInvestmentIncome,
                oinetBusinessIncome: res.data.netBusinessIncome,
                oiadditionalIncome: res.data.additionalIncome
            };
            dispatch(setOtherIncomeInfo(mapped_res));
        });
    });

    const handleSave = () => {
        addOtherIncomeAPI(otherIncomeState);
    };

    return (
        <>
            <div>
                <GridContainer className="usa-section">
                    <Grid row className="margin-x-neg-05 flex-justify-center">
                        <Grid row gap={6}>
                            <FormGroup>
                                <label htmlFor="otherIncome">Long Term Capital Gains</label>
                                <TextInput
                                    id="otherIncome"
                                    name="oilongTermCapitalGains"
                                    type="text"
                                    //defaultValue="test"
                                    value={otherIncomeState.oilongTermCapitalGains}
                                    onChange={handleChange}
                                    validationStatus={errors2.oilongTermCapitalGains ? "error" : undefined}
                                />
                                {errors2.oilongTermCapitalGains && (
                                    <span style={{ color: "red" }}>{errors2.oilongTermCapitalGains}</span>
                                )}
                            </FormGroup>

                            <FormGroup>
                                <label htmlFor="otherIncome">Short Term Capital Gains</label>
                                <TextInput
                                    id="otherIncome"
                                    name="oishortTermCapitalGains"
                                    type="text"
                                    //defaultValue="test"
                                    value={otherIncomeState.oishortTermCapitalGains}
                                    onChange={handleChange}
                                    validationStatus={errors2.oishortTermCapitalGains ? "error" : undefined}
                                />
                                {errors2.oishortTermCapitalGains && (
                                    <span style={{ color: "red" }}>{errors2.oishortTermCapitalGains}</span>
                                )}
                            </FormGroup>

                            <FormGroup>
                                <label htmlFor="otherIncome">Other Investment Income</label>
                                <TextInput
                                    id="otherIncome"
                                    name="oiotherInvestmentIncome"
                                    type="text"
                                    //defaultValue="test"
                                    value={otherIncomeState.oiotherInvestmentIncome}
                                    onChange={handleChange}
                                    validationStatus={errors2.oiotherInvestmentIncome ? "error" : undefined}
                                />
                                {errors2.oiotherInvestmentIncome && (
                                    <span style={{ color: "red" }}>{errors2.oiotherInvestmentIncome}</span>
                                )}
                            </FormGroup>

                            <FormGroup>
                                <label htmlFor="otherIncome">Net Business Income</label>
                                <TextInput
                                    id="otherIncome"
                                    name="oinetBusinessIncome"
                                    type="text"
                                    //defaultValue="test"
                                    value={otherIncomeState.oinetBusinessIncome}
                                    onChange={handleChange}
                                    validationStatus={errors2.oinetBusinessIncome ? "error" : undefined}
                                />
                                {errors2.oinetBusinessIncome && (
                                    <span style={{ color: "red" }}>{errors2.oinetBusinessIncome}</span>
                                )}
                            </FormGroup>

                            <FormGroup>
                                <label htmlFor="otherIncome">Additional Income</label>
                                <TextInput
                                    id="otherIncome"
                                    name="oiadditionalIncome"
                                    type="text"
                                    //defaultValue="test"
                                    value={otherIncomeState.oiadditionalIncome}
                                    onChange={handleChange}
                                    validationStatus={errors2.oiadditionalIncome ? "error" : undefined}
                                />
                                {errors2.oiadditionalIncome && (
                                    <span style={{ color: "red" }}>{errors2.oiadditionalIncome}</span>
                                )}
                            </FormGroup>
                        </Grid>
                    </Grid>
                    <Button type="button" onClick={handleSave}>
                        Save
                    </Button>
                </GridContainer>
            </div>
        </>
    );
};

export default FinancialInformationStepW2;
