import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/redux/store";
import { setW2Info } from "../../utils/redux/W2Slice";
import { Button, Fieldset, FormGroup, Grid, GridContainer, Select, TextInput } from "@trussworks/react-uswds";
import { setTaxReturnInfo, taxReturn } from "../../utils/redux/TaxReturnSlice";
import { getTaxReturnById, updateTaxReturnAPI } from "./taxesAPI";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { useParams } from "react-router-dom";
const PersonalInfoStep: React.FC = () => {
    const { jwt } = useAuthentication();
    const { returnId, formType, formId } = useParams();
    console.log(returnId, formType, formId);

    const W2info = useSelector((state: RootState) => state.w2);
    const taxReturnInfo = useSelector((state: RootState) => state.taxReturn.taxReturn)
    const dispatch = useDispatch();
    const [errors, setErrors] = useState<typeof W2info>({} as typeof W2info);
    const [errors2, setErrors2] = useState<typeof taxReturnInfo>({} as typeof taxReturnInfo);

    useEffect(() => {
        getTaxReturnById(returnId as unknown as number)
            .then((res) => {
                dispatch(setTaxReturnInfo(res.data));
            })
    }, [jwt])

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
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
            const updatedTaxReturnInfo = { ...taxReturnInfo, [name]: value }
            dispatch(setW2Info(updatedW2info));
            dispatch(setTaxReturnInfo(updatedTaxReturnInfo));
        }
    };

    const handleSave = (payload: Partial<taxReturn>, id: number | undefined) => {
        updateTaxReturnAPI(payload, id);
    };

    // const handleSelect = (e : ChangeEvent<HTMLSelectElement>) => {
    //     const { name, value } = e.target;
    // }




    return (
        <>
            <div>
                <GridContainer className="usa-section">
                    <Grid row className="margin-x-neg-05 flex-justify-center">


                        <Fieldset legend="Your Address" legendStyle="large">
                            <Grid row gap={6}>
                                <Grid col={6}>
                                    <FormGroup >
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
                                        {errors2.firstName && <span style={{ color: 'red' }}>{errors2.firstName}</span>}
                                    </FormGroup>
                                </Grid>
                                <Grid col={6}>
                                    <FormGroup >
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
                                        {errors2.lastName && <span style={{ color: 'red' }}>{errors2.lastName}</span>}
                                    </FormGroup>
                                </Grid>
                                <Grid col={6}>
                                    <FormGroup >
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
                                        {errors2.address && <span style={{ color: 'red' }}>{errors2.address}</span>}
                                    </FormGroup>
                                </Grid>
                                <Grid col={6}>
                                    <FormGroup >
                                        <label htmlFor="city">City</label>
                                        <TextInput
                                            id="cty"
                                            name="city"
                                            type="text"
                                            //defaultValue="test"
                                            value={taxReturnInfo.city}
                                            onChange={handleChange}
                                            validationStatus={errors2.city ? "error" : undefined}
                                            aria-label="City"
                                        />
                                        {errors2.city && <span style={{ color: 'red' }}>{errors2.city}</span>}
                                    </FormGroup>
                                </Grid>
                                <Grid col={6}>
                                    <FormGroup >
                                        {/* <label htmlFor="state">State</label>
                            <TextInput
                                id="state"
                                name="state"
                                type="text"
                                //defaultValue="test"
                                value={taxReturnInfo.state}
                                onChange={handleChange}
                                validationStatus={errors2.state ? "error" : undefined}
                            />
                            {errors2.state && <span style={{ color: 'red' }}>{errors2.state}</span>} */}
                                        <label htmlFor="state">State</label>
                                        <Select id="state" name="state" required onChange={handleChange}>
                                            <option>- Select -</option>
                                            <option value="AL">Alabama</option>
                                            <option value="AK">Alaska</option>
                                            <option value="AZ">Arizona</option>
                                            <option value="AR">Arkansas</option>
                                            <option value="CA">California</option>
                                            <option value="CO">Colorado</option>
                                            <option value="CT">Connecticut</option>
                                            <option value="DE">Delaware</option>
                                            <option value="DC">District of Columbia</option>
                                            <option value="FL">Florida</option>
                                            <option value="GA">Georgia</option>
                                            <option value="HI">Hawaii</option>
                                            <option value="ID">Idaho</option>
                                            <option value="IL">Illinois</option>
                                            <option value="IN">Indiana</option>
                                            <option value="IA">Iowa</option>
                                            <option value="KS">Kansas</option>
                                            <option value="KY">Kentucky</option>
                                            <option value="LA">Louisiana</option>
                                            <option value="ME">Maine</option>
                                            <option value="MD">Maryland</option>
                                            <option value="MA">Massachusetts</option>
                                            <option value="MI">Michigan</option>
                                            <option value="MN">Minnesota</option>
                                            <option value="MS">Mississippi</option>
                                            <option value="MO">Missouri</option>
                                            <option value="MT">Montana</option>
                                            <option value="NE">Nebraska</option>
                                            <option value="NV">Nevada</option>
                                            <option value="NH">New Hampshire</option>
                                            <option value="NJ">New Jersey</option>
                                            <option value="NM">New Mexico</option>
                                            <option value="NY">New York</option>
                                            <option value="NC">North Carolina</option>
                                            <option value="ND">North Dakota</option>
                                            <option value="OH">Ohio</option>
                                            <option value="OK">Oklahoma</option>
                                            <option value="OR">Oregon</option>
                                            <option value="PA">Pennsylvania</option>
                                            <option value="RI">Rhode Island</option>
                                            <option value="SC">South Carolina</option>
                                            <option value="SD">South Dakota</option>
                                            <option value="TN">Tennessee</option>
                                            <option value="TX">Texas</option>
                                            <option value="UT">Utah</option>
                                            <option value="VT">Vermont</option>
                                            <option value="VA">Virginia</option>
                                            <option value="WA">Washington</option>
                                            <option value="WV">West Virginia</option>
                                            <option value="WI">Wisconsin</option>
                                            <option value="WY">Wyoming</option>
                                            <option value="AA">AA - Armed Forces Americas</option>
                                            <option value="AE">AE - Armed Forces Africa</option>
                                            <option value="AE">AE - Armed Forces Canada</option>
                                            <option value="AE">AE - Armed Forces Europe</option>
                                            <option value="AE">AE - Armed Forces Middle East</option>
                                            <option value="AP">AP - Armed Forces Pacific</option>

                                        </Select>
                                    </FormGroup>
                                </Grid>
                                <Grid col={6}>
                                    <FormGroup >
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
                                        {errors2.zip && <span style={{ color: 'red' }}>{errors2.zip}</span>}
                                    </FormGroup>
                                </Grid>
                                <Grid col={6}>
                                    <FormGroup >
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
                                        {errors2.dateOfBirth && <span style={{ color: 'red' }}>{errors2.dateOfBirth}</span>}
                                    </FormGroup>
                                </Grid>
                                <Grid col={6}>
                                    <FormGroup >
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
                                        {errors2.ssn && <span style={{ color: 'red' }}>{errors2.ssn}</span>}
                                    </FormGroup>
                                </Grid>
                            </Grid>
                        </Fieldset>

                    </Grid>
                </GridContainer>
            </div>
            <div className="m-5">
                <Button type="button" onClick={() => handleSave(taxReturnInfo, taxReturnInfo.id)} id="pi-save-button">Save</Button>
            </div>
        </>

    );
};

export default PersonalInfoStep;
