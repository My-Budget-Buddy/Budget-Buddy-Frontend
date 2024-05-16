import { Button, Icon } from "@trussworks/react-uswds";
import { Link } from "react-router-dom";


const NavBar = () => {
    return ( 
        <div className="nav-container bg-base-lighter">
            <div className="flex flex-col items-center ">
                <h1>Budget Buddy</h1>
                <div className="nav-settings flex flex-row items-center">
                    <h3>Hi, [Name]</h3>
                    <Icon.Settings/>
                </div>
            </div>
            <div className="nav-btns flex flex-col items-center">
                <Link to="/dashboard">
                    <Button type="submit" >
                        <Icon.List/> Dashboard
                    </Button>
                </Link>
                <Link to="/dashboard/accounts">
                    <Button type="submit" >
                        <Icon.AccountBalance/> Accounts
                    </Button>
                </Link>
                <Link to="/dashboard/budgets">
                    <Button type="submit" >
                        <Icon.Assessment/> Budgets
                    </Button>
                </Link>
                <Link to="/dashboard/spending">
                    <Button type="submit" >
                        <Icon.Assessment/>Spending
                    </Button>
                </Link>
                <Link to="/dashboard/transactions">
                    <Button type="submit" >
                        <Icon.Search/>Transactions
                    </Button>
                </Link>
                <Link to="/dashboard/tax">
                    <Button type="submit" >
                        <Icon.Assessment/>Tax
                    </Button>
                </Link>
            </div>
        </div>
    );
}
 
export default NavBar;
