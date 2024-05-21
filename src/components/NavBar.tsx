import { Link } from "react-router-dom";
import { Icon } from "@trussworks/react-uswds";
import { useTranslation } from "react-i18next";

const NavBar = () => {
    const { t } = useTranslation();

    const pages = [
        {
            path: "/dashboard",
            title: t("dashboard.title"),
            icon: Icon.List
        },
        {
            path: "/dashboard/accounts",
            title: t("accounts.title"),
            icon: Icon.AccountBalance
        },
        {
            path: "/dashboard/budgets",
            title: t("budgets.title"),
            icon: Icon.Assessment
        },
        {
            path: "/dashboard/spending",
            title: t("spending.title"),
            icon: Icon.Assessment
        },
        {
            path: "/dashboard/transactions",
            title: t("transactions.title"),
            icon: Icon.Search
        },
        {
            path: "/dashboard/tax",
            title: t("tax.title"),
            icon: Icon.Assessment
        }
    ];

    return (
        <div className="nav-container bg-base-lighter px-6 h-screen min-w-64">
            <div className="flex flex-col items-center">
                <h1 className="font-semibold">{t("app-name")}</h1>
                <div className="flex flex-row items-center gap-4">
                    <h3>{t("nav.greeting")}, [Name]</h3>
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
