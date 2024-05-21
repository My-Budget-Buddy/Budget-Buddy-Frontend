import { Link } from "react-router-dom";
import { Icon } from "@trussworks/react-uswds";

const pages = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: Icon.List,
  },
  {
    path: "/dashboard/accounts",
    title: "Accounts",
    icon: Icon.AccountBalance,
  },
  {
    path: "/dashboard/budgets",
    title: "Budgets",
    icon: Icon.Assessment,
  },
  {
    path: "/dashboard/spending",
    title: "Spending",
    icon: Icon.Assessment,
  },
  {
    path: "/dashboard/transactions",
    title: "Transactions",
    icon: Icon.Search,
  },
  {
    path: "/dashboard/tax",
    title: "Tax",
    icon: Icon.Assessment,
  },
];

const NavBar = () => {
  return (
    <div className="nav-container bg-base-lighter px-6 h-screen min-w-64">
      <div className="flex flex-col items-center">
        <h1 className="font-semibold">Budget Buddy</h1>
        <div className="flex flex-row items-center gap-4">
          <h3>Hi, [Name]</h3>
          <Icon.Settings />
        </div>
      </div>
      <div className="flex flex-col items-center gap-6 mt-14">
        {pages.map((pages) => (
          <Link
            to={pages.path}
            className="w-full usa-button min-w-full text-left items-center"
            key={pages.path}
          >
            <pages.icon className="mr-3" /> {pages.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
