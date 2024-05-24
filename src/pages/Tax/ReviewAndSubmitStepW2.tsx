import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../util/redux/store";
import { setW2Info } from "./W2Slice";
import { Button, Fieldset, Form, FormGroup, Label, TextInput } from "@trussworks/react-uswds";
import { setTaxReturnInfo, taxReturn } from "./TaxReturnSlice";
import { createTaxReturnAPI, createW2API } from "./taxesAPI";
import { useNavigate } from "react-router-dom";

const ReviewAndSubmitStepW2: React.FC = () => {
    const taxReturnInfo = useSelector((state:RootState) => state.taxReturn.taxReturn);
    const W2info = useSelector((state: RootState) => state.w2); 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const  handleSubmit = () => {
        const taxReturnPayload: taxReturn = {
            filingStatus: taxReturnInfo.filingStatus || "", // Provide a default value if undefined
            id: taxReturnInfo.id || 0,
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
        const w2Payload = {
            ...W2info,
            taxReturnId: 1
        }
        console.log(taxReturnPayload);
        console.log(w2Payload);
        createW2API([w2Payload])
        .then((res) => {
            dispatch(setW2Info(w2Payload))
        });

        createTaxReturnAPI(taxReturnPayload)
        .then((res) => {
            dispatch(setW2Info(w2Payload))
        });

        navigate("/dashboard/tax");
    }

    return(
        <>
        <Button type="button" onClick={handleSubmit}>Submit</Button>
        </>
    )
}

export default ReviewAndSubmitStepW2;