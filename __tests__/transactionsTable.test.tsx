import { waitFor, render, screen } from "@testing-library/react";
import TransactionsTable from "../src/components/TransactionsTable/TransactionsTable";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

beforeEach(() => {
    render(
        <BrowserRouter>
            <TransactionsTable />
        </BrowserRouter>
    );
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("TransactionsTable", () => {
    it("renders the transactions table", async () => {
        await waitFor(() => {
            expect(screen.getByTestId("table")).toBeInTheDocument();
            expect(screen.getByTestId("CardHeader")).toBeInTheDocument();
        });
    });

    it("renders the table headers correctly", () => {
        expect(screen.getByText("Date")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Category")).toBeInTheDocument();
        expect(screen.getByText("Actions")).toBeInTheDocument();
        expect(screen.getByText("Amount")).toBeInTheDocument();
    });

    it("renders the transactions correctly", async () => {
        expect(screen.getByTestId("date-0")).toHaveTextContent("02/20");
        expect(screen.getByTestId("name-0")).toHaveTextContent("Metro by T-Mobile");
        expect(screen.getByTestId("category-0")).toHaveTextContent("Bills & Utilities");
        expect(screen.getByTestId("amount-0")).toHaveTextContent("30");
        expect(screen.getByTestId("date-1")).toHaveTextContent("02/20");
        expect(screen.getByTestId("name-1")).toHaveTextContent("Publix");
        expect(screen.getByTestId("category-1")).toHaveTextContent("Groceries");
        expect(screen.getByTestId("amount-1")).toHaveTextContent("15.85");
    });
});