import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../util/redux/store";
import { otherIncome, setOtherIncomeInfo } from "./otherIncomeSlice";
import { Button, FormGroup, Grid, GridContainer, TextInput } from "@trussworks/react-uswds";
import { addOtherIncomeAPI, getOtherIncomeAPI } from "./taxesAPI";
import { useParams } from "react-router-dom";
const FinancialInformationStepW2: React.FC = () => {

    const { returnId, formType, formId } = useParams();
    console.log(returnId, formType, formId);

    const otherIncomeState = useSelector((state: RootState) => state.otherIncome);

    const dispatch = useDispatch();

    const [errors2, setErrors2] = useState<typeof otherIncomeState>({} as typeof otherIncomeState);

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
            const updatedOtherIncome = { ...otherIncomeState, [name]: value };

            dispatch(setOtherIncomeInfo(updatedOtherIncome));

        }
    };

    useEffect(() => {
        getOtherIncomeAPI(returnId)
            .then((res) => {
                const mapped_res: otherIncome = {
                    "oitaxReturnId": returnId as unknown as number,
                    "oilongTermCapitalGains": res.data.longTermCapitalGains,
                    "oishortTermCapitalGains": res.data.shortTermCapitalGains,
                    "oiotherInvestmentIncome": res.data.otherInvestmentIncome,
                    "oinetBusinessIncome": res.data.netBusinessIncome,
                    "oiadditionalIncome": res.data.additionalIncome
                }
                console.log(mapped_res);
                dispatch(setOtherIncomeInfo(mapped_res));
            })
            .catch((error) => {
                console.error('Error fetching other income data:', error);
                const defaultRes: otherIncome = {
                    oitaxReturnId: Number(returnId),
                    oilongTermCapitalGains: 0,
                    oishortTermCapitalGains: 0,
                    oiotherInvestmentIncome: 0,
                    oinetBusinessIncome: 0,
                    oiadditionalIncome: 0,
                };
                dispatch(setOtherIncomeInfo(defaultRes));
            });
    }, []);

    const handleSave = () => {
        addOtherIncomeAPI(otherIncomeState);
    }

    return (
        <>
            <div>
                <GridContainer className="usa-section">
                    <Grid row className="margin-x-neg-05 flex-justify-center">
                        <Grid row gap={6}>
                            <FormGroup >
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
                                {errors2.oilongTermCapitalGains && <span style={{ color: 'red' }}>{errors2.oilongTermCapitalGains}</span>}
                            </FormGroup>

                            <FormGroup >
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
                                {errors2.oishortTermCapitalGains && <span style={{ color: 'red' }}>{errors2.oishortTermCapitalGains}</span>}
                            </FormGroup>

                            <FormGroup >
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
                                {errors2.oiotherInvestmentIncome && <span style={{ color: 'red' }}>{errors2.oiotherInvestmentIncome}</span>}
                            </FormGroup>

                            <FormGroup >
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
                                {errors2.oinetBusinessIncome && <span style={{ color: 'red' }}>{errors2.oinetBusinessIncome}</span>}
                            </FormGroup>

                            <FormGroup >
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
                                {errors2.oiadditionalIncome && <span style={{ color: 'red' }}>{errors2.oiadditionalIncome}</span>}
                            </FormGroup>

                        </Grid>

                    </Grid>
                    <div className="m-5">
                        <Button type="button" onClick={handleSave} id="oi-save-button">Save</Button>
                    </div>
                </GridContainer>

            </div>
        </>
    );
};


export default FinancialInformationStepW2;