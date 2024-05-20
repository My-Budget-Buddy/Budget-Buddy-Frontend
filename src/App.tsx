import {Route, Routes} from "react-router-dom";
import LandingLayout from "./layouts/LandingLayout.tsx";
import AppLayout from "./layouts/AppLayout.tsx";

import LandingPage from "./pages/Landing/LandingPage.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Accounts from "./pages/Accounts/Accounts.tsx";
import Budgets from "./pages/Budgets/Budgets.tsx";
import Tax from "./pages/Tax/Tax.tsx";
import TransactionHistory from "./pages/Transactions/TransactionHistory.tsx";
import Transactions from "./pages/Transactions/Transactions.tsx";
import Spending from "./pages/Spending/Spending.tsx";
import Login from "./pages/AuthenticationPages/Login.tsx";
import Register from "./pages/AuthenticationPages/Register.tsx";
import TaxEditView from "./pages/Tax/TaxEditView.tsx";
import SpendingMonth from "./pages/Spending/SpendingMonth.tsx";


function App() {

  return (
    <div className={"App"}>

        <Routes>

            {/*Public Routes*/}
            <Route path={"/"} element={<LandingLayout/>}>
                <Route index element={<LandingPage/>}/>
                <Route path={"login"} element={<Login/>}/>
                <Route path={"register"} element={<Register/>}/>
            </Route>

            {/*Private Routes*/}
            <Route path={"/dashboard"} element={<AppLayout/>}>
                <Route index element={<Dashboard/>}/>
                <Route path={"accounts"} element={<Accounts/>}/>
                <Route path={"budgets"} element={<Budgets/>}/>
                <Route path={"spending"} element={<Spending/>}/>
                <Route path={"spending/:month"} element={<SpendingMonth/>}/>

                <Route path={"transactions"} element={<Transactions/>}/>
                <Route path={"transactions/:name"} element={<TransactionHistory/>}/>

                <Route path={"tax"} element={<Tax/>}/>
                <Route path={"tax/:formType/:id"} element={<TaxEditView/>}/>
            </Route>
        </Routes>
    </div>
  )
}

export default App
