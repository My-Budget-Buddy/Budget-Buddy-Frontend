import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import LandingLayout from "../layouts/LandingLayout.tsx";
import AppLayout from "../layouts/AppLayout.tsx";
import LandingPage from "../pages/Landing/LandingPage.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import Accounts from "../pages/Accounts.tsx";
import Budgets from "../pages/Budgets.tsx";
import Tax from "../pages/Tax/Tax.tsx";
import TaxResults from "../pages/Tax/TaxResults.tsx";
import TransactionHistory from "../pages/Transactions/TransactionHistory.tsx";
import Transactions from "../pages/Transactions/Transactions.tsx";
import Spending from "../pages/Spending/Spending.tsx";
import SpendingMonth from "../pages/Spending/SpendingMonth.tsx";
import Login from "../pages/Login.tsx";
import Register from "../pages/Register.tsx";
import ErrorPage from "../pages/ErrorPage.tsx";
import TaxEditView from "../pages/Tax/TaxEditView.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";
import Root from "../pages/Root.tsx";
export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Root />} errorElement={<ErrorPage />}>
            <Route path="/" element={<LandingLayout />} errorElement={<ErrorPage />}>
                <Route index element={<LandingPage />} />
                <Route path={"login"} element={<Login />} />
                <Route path={"register"} element={<Register />} />
                {/*Private Routes*/}
            </Route>
            <Route
                path={"/dashboard"}
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    index
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path={"accounts"} element={<Accounts />} />
                <Route path={"budgets"} element={<Budgets />} />
                <Route path={"spending"} element={<Spending />} />
                <Route path={"spending/:month"} element={<SpendingMonth />} />

                <Route path={"transactions"} element={<Transactions />} />
                <Route path={"transactions/:id"} element={<TransactionHistory />} />

                <Route path={"tax"} element={<Tax />} />
                <Route path={"tax/:returnId"} element={<Tax />} />
                <Route path={"tax/:returnId/:formType/:formId"} element={<TaxEditView />} />
                <Route path={"tax/:returnId/results"} element={<TaxResults />} />
            </Route>
        </Route>
    )
);
