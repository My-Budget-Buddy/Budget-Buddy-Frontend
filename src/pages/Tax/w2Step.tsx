import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../util/redux/store";
import { setW2Info } from "./W2Slice";
import { Button, FormGroup, Grid, GridContainer, Table, TextInput } from "@trussworks/react-uswds";
import { W2State } from "./W2Slice"
import { createW2API, findW2sByTaxReturnIdAPI } from "./taxesAPI";
import { useParams } from "react-router-dom";


const WwStep: React.FC = () => {
    const { returnId, formType, formId } = useParams();
    console.log(returnId, formType, formId);
    const W2info = useSelector((state: RootState) => state.w2);
    const [W2s, setW2s] = useState<W2State[]>([]);
    //const taxReturnInfo = useSelector((state:RootState) => state.taxReturn.taxReturn)
    const dispatch = useDispatch();
    const [errors, setErrors] = useState<typeof W2info>({} as typeof W2info);
    // const [errors2, setErrors2] = useState<typeof taxReturnInfo>({} as typeof taxReturnInfo);
    const [editingItem, setEditingItem] = useState<W2State>();
    const [newItem, setNewItem] = useState<W2State>();
    const [lastId, setLastId] = useState<number>(0);

    useEffect(() => {
        findW2sByTaxReturnIdAPI(returnId)
            .then((res) => {
                const result: W2State[] = [];
                for (const payload of res.data) {
                    const mappedPayload: W2State = {
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
                    };
                    result.push(mappedPayload);
                }
                const maxId = res.data.reduce((max: number, item: { id: number; }) => Math.max(max, item.id), 0);
                setLastId(maxId);
                console.log(result);
                setW2s(result);
            })

    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let error = '';
        if (name === 'w2state' && value.length > 2) {
            error = 'Must Use 2 Letter State Abbreviation';
        } else if (name === 'status' && value.length < 3) {
            error = 'Status must be at least 3 characters long.';
        }

        setErrors({ ...errors, [name]: error });
        //setErrors2({ ...errors2, [name]: error });

        if (!error) {
            const updatedW2info = { ...W2info, [name]: value };
            //const updatedTaxReturnInfo = {...taxReturnInfo, [name]: value}
            dispatch(setW2Info(updatedW2info));
            //dispatch(setTaxReturnInfo(updatedTaxReturnInfo));
        }
    };

    const handleSaveClick = (editedItem: W2State) => {
        const updatedList = W2s.map(item =>
            item.w2id === editedItem.w2id ? editedItem : item
        );
        setW2s(updatedList);
        setEditingItem(undefined);
    };


    const handleEditClick = (item: W2State) => {
        setEditingItem(item);
        dispatch(setW2Info(item));
    };

    const handleSubmit = () => {
        createW2API(W2s, returnId as unknown as number);
    };

    const handleAddClick = () => {
        const newId = lastId + 1;
        setW2s(prevList => [...prevList, { ...newItem, w2id: newId, w2employer: "", w2federalIncomeTaxWithheld: 0, w2imageKey: undefined, w2medicareTaxWithheld: 0, w2socialSecurityTaxWithheld: 0, w2state: "", w2stateIncomeTaxWithheld: 0, w2taxReturnId: returnId as unknown as number, w2userId: 1, w2wages: 0, w2year: 2024 }]);
        setLastId(newId);
        setNewItem({ ...newItem, w2id: newId, w2employer: "", w2federalIncomeTaxWithheld: 0, w2imageKey: undefined, w2medicareTaxWithheld: 0, w2socialSecurityTaxWithheld: 0, w2state: "", w2stateIncomeTaxWithheld: 0, w2taxReturnId: returnId as unknown as number, w2userId: 1, w2wages: 0, w2year: 2024 });
    };

    const handleDeleteClick = (id: number | undefined) => {
        if (id === undefined) {
            return;
        }
        setW2s(prevList =>
            prevList.filter(item => item.w2id !== id)
        );
    };


    return (<>
        <div>
            <GridContainer className="usa-section">
                <Grid row className="margin-x-neg-05 flex-justify-center">

                    <Table>
                        <thead>
                            <tr>
                                <th>State</th>
                                <th>Employer</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {W2s.map(item => (
                                <tr key={item.w2id}>
                                    <td>{item.w2state}</td>
                                    <td>{item.w2employer}</td>
                                    <td>
                                        <Button type="button" onClick={() => handleEditClick(item)} id="w2-edit-button">Edit</Button>
                                        <Button type="button" secondary onClick={() => handleDeleteClick(item.w2id)} id="w2-delete-button">Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <div className="m-5">
                            <Button type="button" onClick={handleAddClick} id="w2-add-button">Add</Button>
                            <Button type="button" onClick={handleSubmit} id="w2-submit-button">Submit</Button>
                        </div>
                    </Table>

                </Grid>

            </GridContainer>



        </div>
        {editingItem && (

            <div>
                <GridContainer className="usa-section">
                    <Grid row className="margin-x-neg-05 flex-justify-center">
                        <Grid row gap={6}>
                            <FormGroup >
                                <label htmlFor="state">State</label>
                                <TextInput
                                    id="state"
                                    name="w2state"
                                    type="text"
                                    //defaultValue="test"
                                    value={W2info.w2state}
                                    onChange={handleChange}
                                    validationStatus={errors.w2state ? "error" : undefined}
                                />
                                {errors.w2state && <span style={{ color: 'red' }}>{errors.w2state}</span>}
                            </FormGroup>

                            <FormGroup >
                                <label htmlFor="employer">Employer</label>
                                <TextInput
                                    id="employer"
                                    name="w2employer"
                                    type="text"
                                    //defaultValue="test"
                                    value={W2info.w2employer}
                                    onChange={handleChange}
                                    validationStatus={errors.w2employer ? "error" : undefined}
                                />
                                {errors.w2employer && <span style={{ color: 'red' }}>{errors.w2employer}</span>}
                            </FormGroup>

                            <FormGroup >
                                <label htmlFor="wages">wages</label>
                                <TextInput
                                    id="wages"
                                    name="w2wages"
                                    type="text"
                                    //defaultValue="test"
                                    value={W2info.w2wages}
                                    onChange={handleChange}
                                    validationStatus={errors.w2wages ? "error" : undefined}
                                />
                                {errors.w2wages && <span style={{ color: 'red' }}>{errors.w2wages}</span>}
                            </FormGroup>

                            <FormGroup >
                                <label htmlFor="federalIncomeTaxWithheld">Federal Income Tax Withheld</label>
                                <TextInput
                                    id="federalIncomeTaxWithheld"
                                    name="w2federalIncomeTaxWithheld"
                                    type="text"
                                    //defaultValue="test"
                                    value={W2info.w2federalIncomeTaxWithheld}
                                    onChange={handleChange}
                                    validationStatus={errors.w2federalIncomeTaxWithheld ? "error" : undefined}
                                />
                                {errors.w2federalIncomeTaxWithheld && <span style={{ color: 'red' }}>{errors.w2federalIncomeTaxWithheld}</span>}
                            </FormGroup>

                            <FormGroup >
                                <label htmlFor="stateIncomeTaxWithheld">State Income Tax Withheld</label>
                                <TextInput
                                    id="stateIncomeTaxWithheld"
                                    name="w2stateIncomeTaxWithheld"
                                    type="text"
                                    //defaultValue="test"
                                    value={W2info.w2stateIncomeTaxWithheld}
                                    onChange={handleChange}
                                    validationStatus={errors.w2stateIncomeTaxWithheld ? "error" : undefined}
                                />
                                {errors.w2stateIncomeTaxWithheld && <span style={{ color: 'red' }}>{errors.w2stateIncomeTaxWithheld}</span>}
                            </FormGroup>

                            <FormGroup >
                                <label htmlFor="socialSecurityTaxWithheld">Social Security Tax Withheld</label>
                                <TextInput
                                    id="socialSecurityTaxWithheld"
                                    name="w2socialSecurityTaxWithheld"
                                    type="text"
                                    //defaultValue="test"
                                    value={W2info.w2socialSecurityTaxWithheld}
                                    onChange={handleChange}
                                    validationStatus={errors.w2socialSecurityTaxWithheld ? "error" : undefined}
                                />
                                {errors.w2socialSecurityTaxWithheld && <span style={{ color: 'red' }}>{errors.w2socialSecurityTaxWithheld}</span>}
                            </FormGroup>

                            <FormGroup >
                                <label htmlFor="medicareTaxWithheld">Medicare Tax Withheld</label>
                                <TextInput
                                    id="medicareTaxWithheld"
                                    name="w2medicareTaxWithheld"
                                    type="text"
                                    //defaultValue="test"
                                    value={W2info.w2medicareTaxWithheld}
                                    onChange={handleChange}
                                    validationStatus={errors.w2medicareTaxWithheld ? "error" : undefined}
                                />
                                {errors.w2medicareTaxWithheld && <span style={{ color: 'red' }}>{errors.w2medicareTaxWithheld}</span>}
                            </FormGroup>


                        </Grid>
                        <Button type="button" onClick={() => handleSaveClick(W2info)} id="w2-save-button">Save</Button>
                    </Grid>
                </GridContainer>
            </div>

        )}

    </>
    );
};

export default WwStep;