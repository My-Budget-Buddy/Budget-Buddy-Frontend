import Spending from "../src/pages/Spending/Spending";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import { Icon } from "@trussworks/react-uswds";

// mock AxisConfig
jest.mock("@mui/x-charts", () => ({
    AxisConfig: jest.fn().mockImplementation(({ children }) => children), // mock and return children
    useDrawingArea: jest.fn().mockReturnValue({
        // mock the useDrawingArea hook
        width: 100,
        height: 100,
        left: 0,
        top: 0
    })
}));

// mock PieChart
jest.mock("@mui/x-charts/PieChart", () => ({
    PieChart: jest.fn().mockImplementation(({ children }) => children),
    pieArcLabelClasses: {
        root: "mock-root-class" // use this as a placeholder for CSS class that piechart uses
    }
}));

// mock LineChart
jest.mock("@mui/x-charts/LineChart", () => ({
    LineChart: jest.fn().mockImplementation(({ children }) => children)
}));

// mock useTranslation
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key // mock hook and have it return the actual key without translating it
    })
}));

// mock config
jest.mock("../src/api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock" // mock with localhost url
    }
}));

// mock getTransactionByUserId from transactionService
jest.mock("../src/utils/transactionService", () => ({
    getTransactionByUserId: jest.fn()
}));

// import the function to mock
const { getTransactionByUserId } = require("../src/utils/transactionService");

// get today's date and last week's date for transactions
const today = new Date().toISOString().split("T")[0];
const lastWeek = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split("T")[0];

// create a list of transactions for mock data
const mockTransactions = [
    {
        accountId: 1,
        amount: 299.99,
        category: "Shopping",
        date: today,
        description: "Purchase of electronics",
        transactionId: 1,
        userId: 1,
        vendorName: "Amazon"
    },
    {
        accountId: 2,
        amount: 2100.75,
        category: "Income",
        date: today,
        description: "Paycheck",
        transactionId: 2,
        userId: 1,
        vendorName: "Skillstorm"
    },
    {
        accountId: 1,
        amount: 2000.0,
        category: "Groceries",
        date: lastWeek,
        description: "Grocery shopping",
        transactionId: 3,
        userId: 1,
        vendorName: "Walmart"
    },
    {
        accountId: 1,
        amount: 8.00,
        category: "Dining",
        date: lastWeek,
        description: "Coffee",
        transactionId: 4,
        userId: 1,
        vendorName: "Starbucks"
    },
    {
        accountId: 1,
        amount: 150.00,
        category: "Dining",
        date: lastWeek,
        description: "Restaurant",
        transactionId: 5,
        userId: 1,
        vendorName: "Steakhouse"
    },
    {
        accountId: 1,
        amount: 150.00,
        category: "Dining",
        date: lastWeek,
        description: "Restaurant",
        transactionId: 5,
        userId: 1,
        vendorName: "Steakhouse"
    },
    {
        accountId: 1,
        amount: 2100.00,
        category: "Income",
        date: lastWeek,
        description: "Paycheck",
        transactionId: 5,
        userId: 1,
        vendorName: "Skillstorm"
    }, 
];

// set up method for routing and mocking the fetch call
beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // ignore console errors: warning about act()
    getTransactionByUserId.mockResolvedValue(mockTransactions);

    act(() => {
        render(
            <MemoryRouter>
                <Spending />
            </MemoryRouter>
        );
    });
});

// cleanup
afterEach(() => {
    jest.clearAllMocks();
});

describe("Spending Cards", () => {
    it("should render the Spending page", async () => {
        expect(screen.getByText("spending.title")).toBeInTheDocument();
    });

    it("should render Spent this week card correctly", async () => {
        await waitFor(() => {
            expect(screen.getByText("spending.spentThisWeek")).toBeInTheDocument(); // check if the text is rendered
            expect(screen.getByTestId("price-0")).toHaveTextContent("$299.99"); // check if rendered with correct price
            expect(screen.getByTestId("details-0")).toHaveTextContent("spending.spentThisWeek"); // check if rendered with correct details
            expect(screen.getByTestId('icon-0')).toBeInTheDocument(); // check if icon is rendered
            expect(screen.getByTestId('percentage-0')).toHaveTextContent("87.00%");
        });
    });

    it("should render Deposited this week card correctly", async () => {
        await waitFor(() => {
            expect(screen.getByText("spending.depositedThisWeek")).toBeInTheDocument();
            expect(screen.getByTestId("price-1")).toHaveTextContent("$2,100.75");
            expect(screen.getByTestId("details-1")).toHaveTextContent("spending.depositedThisWeek");
            expect(screen.getByTestId('icon-1')).toBeInTheDocument();
            expect(screen.getByTestId('percentage-1')).toHaveTextContent("0.04%");
        });
    });

    it("should render Annual Total Spent card correctly", async () => {
        await waitFor(() => {
            const totalSpent = screen.getAllByText("spending.totalSpent"); // there are two instances of this text
            expect(totalSpent[0]).toBeInTheDocument(); // grab the first instance in spending card
            expect(screen.getByTestId("price-2")).toHaveTextContent("$2,607.99");
            expect(screen.getByTestId("details-2")).toHaveTextContent("spending.totalSpent");
            expect(screen.getByTestId('icon-2')).toBeInTheDocument();
            expect(screen.getByTestId('percentage-2')).toHaveTextContent("0.00%");
        });
    });
});

describe("Spending Line Chart", () => {
    it("should render the spending line chart correctly", async () => {
        await waitFor(() => {
            expect(screen.getByText("spending.graphTitle")).toBeInTheDocument();
            expect(document.getElementById("spending-earnings-graph")).toBeInTheDocument();
        });
    });

    it("should render the See Current Month button and navigate correctly", async () => {
        await waitFor(() => {
            const button = document.getElementById("see-current-month-button");
            expect(button).toBeInTheDocument();
            if (button) {
                button.click();
            }
            render( // render the route that the button should navigate to
              <MemoryRouter initialEntries={['/spending']}> 
                <Routes>
                  <Route path="/spending" element={<Spending />} />
                  <Route path="/dashboard/spending/May" />
                </Routes>
              </MemoryRouter>
            );
        });
    });
});

describe("Spending Pie Chart",() => {  
  it("should render the spending pie chart correctly", async () => {
    await waitFor(() => {
      expect(document.getElementById("spending-pie-chart")).toBeInTheDocument();
      const totalSpent = screen.getAllByText("spending.totalSpent"); // there are two instances of this text
      expect(totalSpent[1]).toBeInTheDocument(); // grab the second instance in spending card
    });
  });
});

describe("Spending Table", () => {
  it("should render the spending table correctly", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });
  });
});

describe("Top Spending Categories", () => {
    it("should render the top spending categories correctly", async () => {
        await waitFor(() => {
            expect(document.getElementById("top-categories-purchases-vendors")).toBeInTheDocument();
        });
            expect(screen.getByText("spending.topCategories")).toBeInTheDocument();
    });
});

describe("Spending transactions fetch exception", () => {
    it("should render the error message when transactions fetch fails", async () => {
        getTransactionByUserId.mockRejectedValue(new Error("Error fetching transactions:"));
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await waitFor(() => {
          expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching transactions:", expect.any(Error));
        });
    });
});