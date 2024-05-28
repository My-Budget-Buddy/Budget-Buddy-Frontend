import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../util/redux/store";
import { W2State, setW2Info } from "./W2Slice";
import { Button, Card, CardBody, CardFooter, CardGroup, CardHeader, Grid, GridContainer } from "@trussworks/react-uswds";
import { setTaxReturnInfo, taxReturn } from "./TaxReturnSlice";
import { createTaxReturnAPI, findAllDeductionsByTaxReturnAPI, findW2sByTaxReturnIdAPI } from "./taxesAPI";
import { useNavigate } from "react-router-dom";
import { deductions } from "./deductionsSlice";

const ReviewAndSubmitStepW2: React.FC = () => {
    const taxReturnInfo = useSelector((state: RootState) => state.taxReturn.taxReturn);
    const otherIncome = useSelector((state: RootState) => state.otherIncome);
    const [W2s, setW2s] = useState<W2State[]>([]);
    const [DeductionList, setDeductions] = useState<deductions[]>([]);
    const [currentW2Index, setCurrentW2Index] = useState(0);
    const [currentDeductionIndex, setCurrentDeductionIndex] = useState(0);
    //const deductionsState = useSelector((state: RootState) => state.deductions);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        findW2sByTaxReturnIdAPI()
            .then((res) => {
                const result: W2State[] = res.data.map((payload: any) => ({
                    w2id: payload.id,
                    w2state: payload.state,
                    w2taxReturnId: payload.taxReturnId,
                    w2year: payload.year,
                    w2userId: payload.userId,
                    w2employer: payload.employer,
                    w2wages: payload.wages,
                    w2federalIncomeTaxWithheld: payload.federalIncomeTaxWithheld,
                    w2stateIncomeTaxWithheld: payload.stateIncomeTaxWithheld,
                    w2socialSecurityTaxWithheld: payload.socialSecurityTaxWithheld,
                    w2medicareTaxWithheld: payload.medicareTaxWithheld,
                    w2imageKey: undefined
                }));
                setW2s(result);
            });
        findAllDeductionsByTaxReturnAPI()
            .then((res) => {
                const dedResult: deductions[] = res.data.map((payload: any) => ({
                    dedid: payload.id,
                    dedtaxReturn: payload.taxReturn,
                    deddeduction: payload.deduction,
                    deddeductionName: payload.deductionName,
                    dedamountSpent: payload.amountSpent,
                    dednetDeduction: payload.netDeduction
                }));
                setDeductions(dedResult);
            })
    }, []);

    const handlePreviousW2 = () => {
        setCurrentW2Index((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    };

    const handleNextW2 = () => {
        setCurrentW2Index((prevIndex) => (prevIndex < W2s.length - 1 ? prevIndex + 1 : prevIndex));
    };

    const handlePreviousDeduction = () => {
        setCurrentDeductionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    };

    const handleNextDeduction = () => {
        setCurrentDeductionIndex((prevIndex) => (prevIndex < DeductionList.length - 1 ? prevIndex + 1 : prevIndex));
    };

    const handleSubmit = () => {
        const taxReturnPayload: taxReturn = {
            filingStatus: taxReturnInfo.filingStatus || "", // Provide a default value if undefined
            year: taxReturnInfo.year || new Date().getFullYear(), // Example default to current year
            userId: taxReturnInfo.userId || 0,
            firstName: taxReturnInfo.firstName || "",
            lastName: taxReturnInfo.lastName || "",
            email: taxReturnInfo.email || "",
            phoneNumber: taxReturnInfo.phoneNumber || "",
            address: taxReturnInfo.address || "",
            city: taxReturnInfo.city || "",
            state: taxReturnInfo.state || "",
            zip: taxReturnInfo.zip || "",
            dateOfBirth: taxReturnInfo.dateOfBirth || "",
            ssn: taxReturnInfo.ssn || "",
        };

        createTaxReturnAPI(taxReturnPayload)
            .then(() => {
                dispatch(setTaxReturnInfo(taxReturnPayload));
            });

        navigate("/dashboard/tax");
    };

    return (
        <>
            <div className="bg-base-lightest">
                <GridContainer className="usa-section">
                    <Grid row className="margin-x-neg-05 flex-justify-center">
                        <CardGroup>
                            <Grid row gap={6}>
                                <Grid col={6}>
                                    <Card>
                                        <CardHeader>
                                            <h2>Personal Information</h2>
                                        </CardHeader>
                                        <CardBody>
                                            <p>Filing Status: {taxReturnInfo.filingStatus}</p>
                                            <p>Name: {taxReturnInfo.firstName} {taxReturnInfo.lastName}</p>
                                            <p>Address: {taxReturnInfo.address} {taxReturnInfo.city} {taxReturnInfo.state} {taxReturnInfo.zip}</p>
                                            <p>Email: {taxReturnInfo.email}</p>
                                            <p>Date of Birth: {taxReturnInfo.dateOfBirth}</p>
                                            <p>Social Security Number: {taxReturnInfo.ssn}</p>
                                        </CardBody>
                                    </Card>
                                </Grid>

                                <Grid col={6}>
                                    <Card>
                                        <CardHeader>
                                            <h2>W2 Filing</h2>
                                        </CardHeader>
                                        <CardBody>
                                            {W2s.length > 0 ? (
                                                <>
                                                    <p>Employer: {W2s[currentW2Index].w2employer}</p>
                                                    <p>State Filed: {W2s[currentW2Index].w2state}</p>
                                                    <p>Wages: {W2s[currentW2Index].w2wages}</p>
                                                    <p>Federal Income Tax Withheld: {W2s[currentW2Index].w2federalIncomeTaxWithheld}</p>
                                                </>
                                            ) : (
                                                <p>No W2 data available</p>
                                            )}
                                        </CardBody>
                                        <CardFooter>
                                            <Button type="button" onClick={handlePreviousW2} disabled={currentW2Index === 0}>Previous</Button>
                                            <Button type="button" onClick={handleNextW2} disabled={currentW2Index === W2s.length - 1}>Next</Button>
                                        </CardFooter>
                                    </Card>
                                </Grid>

                                <Grid col={6}>
                                    <Card>
                                        <CardHeader>
                                            <h2>Other Income</h2>
                                        </CardHeader>
                                        <CardBody>
                                            <p>Long Term Capital Gains: {otherIncome.oilongTermCapitalGains}</p>
                                        </CardBody>
                                    </Card>
                                </Grid>

                                <Grid col={6}>
                                    <Card>
                                        <CardHeader>
                                            <h2>Deductions</h2>
                                        </CardHeader>
                                        <CardBody>
                                            {DeductionList.length > 0 ? (
                                                <>
                                                    <p>Deduction Name: {DeductionList[currentDeductionIndex].deddeductionName}</p>
                                                    <p>Amount Spent: {DeductionList[currentDeductionIndex].dedamountSpent}</p>
                                                    <p>Net Deduction: {DeductionList[currentDeductionIndex].dednetDeduction}</p>
                                                </>
                                            ) : (
                                                <p>No deduction data available</p>
                                            )}
                                        </CardBody>
                                        <CardFooter>
                                            <Button type="button" onClick={handlePreviousDeduction} disabled={currentDeductionIndex === 0}>Previous</Button>
                                            <Button type="button" onClick={handleNextDeduction} disabled={currentDeductionIndex === DeductionList.length - 1}>Next</Button>
                                        </CardFooter>
                                    </Card>
                                </Grid>
                            </Grid>
                        </CardGroup>
                    </Grid>
                </GridContainer>
            </div>
            <Button type="button" onClick={handleSubmit}>Submit</Button>
        </>
    );
};

export default ReviewAndSubmitStepW2;
