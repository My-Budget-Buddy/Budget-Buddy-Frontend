/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../util/redux/store";
import { setW2Info } from "./W2Slice";
import { Button, Fieldset, FormGroup, Grid, GridContainer, TextInput } from "@trussworks/react-uswds";
import { setTaxReturnInfo, taxReturn } from "./TaxReturnSlice";
import { deleteTaxReturn, getTaxReturnById, updateTaxReturnAPI } from "./taxesAPI";

const PersonalInfoStep: React.FC = () => {
    const W2info = useSelector((state: RootState) => state.w2);
    const taxReturnInfo = useSelector((state: RootState) => state.taxReturn.taxReturn);
    const dispatch = useDispatch();
    const [errors, setErrors] = useState<typeof W2info>({} as typeof W2info);
    const [errors2, setErrors2] = useState<typeof taxReturnInfo>({} as typeof taxReturnInfo);

    useEffect(() => {
        getTaxReturnById(1).then((res) => {
            dispatch(setTaxReturnInfo(res.data));
        });
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let error = "";
        if (name === "formType" && value.length < 2) {
            error = "Form type must be at least 2 characters long.";
        } else if (name === "status" && value.length < 3) {
            error = "Status must be at least 3 characters long.";
        }

        setErrors({ ...errors, [name]: error });
        setErrors2({ ...errors2, [name]: error });

        if (!error) {
            const updatedW2info = { ...W2info, [name]: value };
            const updatedTaxReturnInfo = { ...taxReturnInfo, [name]: value };
            dispatch(setW2Info(updatedW2info));
            dispatch(setTaxReturnInfo(updatedTaxReturnInfo));
        }
    };

    const handleSave = (payload: Partial<taxReturn>) => {
        updateTaxReturnAPI(payload);
    };

    return (
        <>
            <div>
                <GridContainer className="usa-section">
                    <Grid row className="margin-x-neg-05 flex-justify-center">
                        <Fieldset legend="Your Address" legendStyle="large">
                            <Grid row gap={6}>
                                <Grid col={6}>
                                    <FormGroup>
                                        <label htmlFor="firstName">First Name</label>
                                        <TextInput
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            //defaultValue="test"
                                            value={taxReturnInfo.firstName}
                                            onChange={handleChange}
                                            validationStatus={errors2.firstName ? "error" : undefined}
                                        />
                                        {errors2.firstName && <span style={{ color: "red" }}>{errors2.firstName}</span>}
                                    </FormGroup>
                                </Grid>
                                <Grid col={6}>
                                    <FormGroup>
                                        <label htmlFor="lastName">Last Name</label>
                                        <TextInput
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            //defaultValue="test"
                                            value={taxReturnInfo.lastName}
                                            onChange={handleChange}
                                            validationStatus={errors2.lastName ? "error" : undefined}
                                        />
                                        {errors2.lastName && <span style={{ color: "red" }}>{errors2.lastName}</span>}
                                    </FormGroup>
                                </Grid>
                                <Grid col={6}>
                                    <FormGroup>
                                        <label htmlFor="StreetName">Street Name</label>
                                        <TextInput
                                            id="StreetName"
                                            name="address"
                                            type="text"
                                            //defaultValue="test"
                                            value={taxReturnInfo.address}
                                            onChange={handleChange}
                                            validationStatus={errors2.address ? "error" : undefined}
                                        />
                                        {errors2.address && <span style={{ color: "red" }}>{errors2.address}</span>}
                                    </FormGroup>
                                </Grid>
                                <Grid col={6}>
                                    <FormGroup>
                                        <label htmlFor="city">City</label>
                                        <TextInput
                                            id="cty"
                                            name="city"
                                            type="text"
                                            //defaultValue="test"
                                            value={taxReturnInfo.city}
                                            onChange={handleChange}
                                            validationStatus={errors2.city ? "error" : undefined}
                                        />
                                        {errors2.city && <span style={{ color: "red" }}>{errors2.city}</span>}
                                    </FormGroup>
                                </Grid>
                                <Grid col={6}>
                                    <FormGroup>
                                        <label htmlFor="state">State</label>
                                        <TextInput
                                            id="state"
                                            name="state"
                                            type="text"
                                            //defaultValue="test"
                                            value={taxReturnInfo.state}
                                            onChange={handleChange}
                                            validationStatus={errors2.state ? "error" : undefined}
                                        />
                                        {errors2.state && <span style={{ color: "red" }}>{errors2.state}</span>}
                                    </FormGroup>
                                </Grid>
                                <Grid col={6}>
                                    <FormGroup>
                                        <label htmlFor="zip">ZIP</label>
                                        <TextInput
                                            id="zip"
                                            name="zip"
                                            type="text"
                                            //defaultValue="test"
                                            value={taxReturnInfo.zip}
                                            onChange={handleChange}
                                            validationStatus={errors2.zip ? "error" : undefined}
                                        />
                                        {errors2.zip && <span style={{ color: "red" }}>{errors2.zip}</span>}
                                    </FormGroup>
                                </Grid>
                                <Grid col={6}>
                                    <FormGroup>
                                        <label htmlFor="dob">Date of Birth</label>
                                        <TextInput
                                            id="dob"
                                            name="dateOfBirth"
                                            type="text"
                                            //defaultValue="test"
                                            value={taxReturnInfo.dateOfBirth}
                                            onChange={handleChange}
                                            validationStatus={errors2.dateOfBirth ? "error" : undefined}
                                        />
                                        {errors2.dateOfBirth && (
                                            <span style={{ color: "red" }}>{errors2.dateOfBirth}</span>
                                        )}
                                    </FormGroup>
                                </Grid>
                                <Grid col={6}>
                                    <FormGroup>
                                        <label htmlFor="ssn">Social Security Number</label>
                                        <TextInput
                                            id="ssn"
                                            name="ssn"
                                            type="text"
                                            //defaultValue="test"
                                            value={taxReturnInfo.ssn}
                                            onChange={handleChange}
                                            validationStatus={errors2.ssn ? "error" : undefined}
                                        />
                                        {errors2.ssn && <span style={{ color: "red" }}>{errors2.ssn}</span>}
                                    </FormGroup>
                                </Grid>
                            </Grid>
                        </Fieldset>
                    </Grid>
                </GridContainer>
            </div>
            <Button type="button" onClick={() => handleSave(taxReturnInfo)}>
                Save
            </Button>
        </>
    );
};

export default PersonalInfoStep;
