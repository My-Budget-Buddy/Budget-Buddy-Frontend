import { Link } from "react-router-dom";
import { Icon, Modal, ModalToggleButton, ModalRef, ModalHeading, Title } from "@trussworks/react-uswds";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import Languages from "./Settings/Languages";
import Profile from "./Settings/Profile";

const NavBar = () => {
    const { t } = useTranslation();
    const modalRef = useRef<ModalRef>(null);
    const [sideNav, setSideNav] = useState(t("nav.profile"));

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

    const settingOptions = [
        {
            title: t("nav.profile"),
            icon: Icon.Person,
            component: <Profile />
        },
        {
            title: t("nav.languages"),
            icon: Icon.Language,
            component: <Languages setSideNav={setSideNav} />
        }
    ];

    return (
        <div className="nav-container bg-base-lighter px-6 h-screen min-w-64 max-w-64">
            <div className="flex flex-col items-center">
                <Link to="/">
                    <Title className="font-semibold text-center">{t("app-name")}</Title>
                </Link>
                <div className="flex flex-row items-center gap-4 mt-4">
                    <h3>{t("nav.greeting")}, [Name]</h3>
                    <ModalToggleButton modalRef={modalRef} opener className="usa-button--unstyled" id="no-focus">
                        <Icon.Settings style={{ fontSize: "1.4rem" }} />
                    </ModalToggleButton>
                    <Modal
                        ref={modalRef}
                        id="settings-modal"
                        aria-labelledby="modal-1-heading"
                        aria-describedby="modal-1-description"
                        isLarge
                        className="h-[90vh]"
                    >
                        <div className="flex justify-center bg-white w-full max-w-2xl rounded-2xl">
                            <div className="flex flex-col">
                                <ModalHeading className="mb-6">{t("nav.settings")}</ModalHeading>
                                <div className="flex">
                                    <ul className="usa-sidenav">
                                        {settingOptions.map((option, idx) => (
                                            <li
                                                key={idx}
                                                className={`usa-sidenav__item px-4 py-3 w-40 flex items-center ${
                                                    sideNav === `${option.title}` ? "usa-current" : ""
                                                }`}
                                            >
                                                <option.icon className="mr-2" />
                                                <button onClick={() => setSideNav(`${option.title}`)} id="no-focus">
                                                    {option.title}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {settingOptions.find((option) => option.title === sideNav)?.component}
                        </div>
                    </Modal>
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
