import exp from "constants";
import deductionsSlice, { deductions, setDeductionsInfo, resetDeductionsInfo } from "../src/utils/redux/deductionsSlice";

const initialState: deductions = {
    dedid: 0,
    dedtaxReturn: 0,
    deddeduction: 0,
    deddeductionName: "",
    dedamountSpent: 0,
    dednetDeduction: 0
};

beforeEach(() => {
    // mock the useDispatch and useSelector hooks
    jest.mock('@reduxjs/toolkit', () => ({
        createSlice: jest.fn(),
        PayloadAction: jest.fn(),
      }));
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("deductionSlice", () => {
    // check initial state matches
    it("should match the initial deduction state", () => {
        expect(deductionsSlice(undefined, { type: ' ' })).toEqual(initialState);
    });

    // check if the setDeductionsInfo sets the deduction info correctly
    it("should handle set deduction info", () => {
        const newDeduction = deductionsSlice(initialState, setDeductionsInfo({
            deddeductionName: "Charity", dedamountSpent: 100,
            deddeduction: undefined
        }));
        expect(newDeduction.deddeductionName).toEqual("Charity");
        expect(newDeduction.dedamountSpent).toEqual(100);
    });

    // check if the resetDeductionsInfo resets the deduction info correctly
    it("should handle reset deduction info", () => {
        const newDeduction = deductionsSlice(initialState, setDeductionsInfo({
            deddeductionName: "Charity", dedamountSpent: 100,
            deddeduction: undefined
        }));
        expect(newDeduction.deddeductionName).toEqual("Charity");
        expect(newDeduction.dedamountSpent).toEqual(100);

        const resetDeduction = deductionsSlice(initialState, resetDeductionsInfo());
        expect(resetDeduction).toEqual(initialState);
        expect(resetDeduction.deddeductionName).toEqual("");
        expect(resetDeduction.dedamountSpent).toEqual(0);
    });
});
