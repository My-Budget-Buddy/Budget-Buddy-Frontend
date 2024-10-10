import taxReturnSlice, { setTaxReturnInfo, setAllTaxReturns, resetTaxReturnInfo, TaxReturnState } from "../../redux/TaxReturnSlice";

const initialState: TaxReturnState = {
    taxReturn: {
        "filingStatus": "SINGLE",
        "id": 1,
        "year": 2024,
        "userId": 1,
        "firstName": null,
        "lastName": null,
        "email": null,
        "phoneNumber": null,
        "address": null,
        "city": null,
        "state": null,
        "zip": null,
        "dateOfBirth": null,
        "ssn": null
    },
    taxReturns: [],
};

beforeEach(() => {
    // mock the useDispatch and useSelector hooks
    jest.mock('react-redux', () => ({
        useDispatch: jest.fn(),
        useSelector: jest.fn(),
    }));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('taxReturnSlice', () => {
    // check initial state
    it('should match the initial tax return state', () => {
        expect(taxReturnSlice(undefined, { type: '' })).toEqual(initialState);
    });

    // check if the setTaxReturnInfo sets the tax return info correctly
    it('should handle set tax return info', () => {
        const newTaxReturn = taxReturnSlice(initialState, setTaxReturnInfo({ firstName: 'Albert', lastName: 'Einstein' }));
        expect(newTaxReturn.taxReturn.firstName).toEqual('Albert');
        expect(newTaxReturn.taxReturn.lastName).toEqual('Einstein');
    });

    it('should handle set all tax returns', () => {
        // create 2 tax returns
        const allTaxReturns = taxReturnSlice(initialState, setAllTaxReturns([{
            id: 1, year: 2024,
            filingStatus: "SINGLE",
            userId: 1,
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            phoneNumber: undefined,
            address: undefined,
            city: undefined,
            state: undefined,
            zip: undefined,
            dateOfBirth: undefined,
            ssn: undefined
        }, {
            id: 2, year: 2025,
            filingStatus: "MARRIED",
            userId: 1,
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            phoneNumber: undefined,
            address: undefined,
            city: undefined,
            state: undefined,
            zip: undefined,
            dateOfBirth: undefined,
            ssn: undefined
        }]));

        expect(allTaxReturns.taxReturns.length).toEqual(2); // check if there are 2 tax returns
        // check all the fields of the first and second tax return
        expect(allTaxReturns.taxReturns[0].id).toEqual(1);
        expect(allTaxReturns.taxReturns[0].year).toEqual(2024);
        expect(allTaxReturns.taxReturns[0].filingStatus).toEqual("SINGLE");
        expect(allTaxReturns.taxReturns[0].userId).toEqual(1);
        expect(allTaxReturns.taxReturns[1].id).toEqual(2);
        expect(allTaxReturns.taxReturns[1].year).toEqual(2025);
        expect(allTaxReturns.taxReturns[1].filingStatus).toEqual("MARRIED");
        expect(allTaxReturns.taxReturns[1].userId).toEqual(1);
    });

    it('should handle reset tax return info', () => {
        // create a new tax return and then reset it
        const newTaxReturn = taxReturnSlice(initialState, setTaxReturnInfo({ firstName: 'Albert', lastName: 'Einstein' }));
        expect(newTaxReturn.taxReturn.firstName).toEqual('Albert');
        expect(newTaxReturn.taxReturn.lastName).toEqual('Einstein');

        const resetTaxReturn = taxReturnSlice(newTaxReturn, resetTaxReturnInfo());
        expect(resetTaxReturn.taxReturn.firstName).toEqual(null);
        expect(resetTaxReturn.taxReturn.lastName).toEqual(null);
    });
});