import Profile from "../Settings/Profile";
import Languages from "../Settings/Languages";
import buddyLogo from "/images/bb-logo-medium.png"
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import RequestPageOutlinedIcon from "@mui/icons-material/RequestPageOutlined";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { Icon, Modal, ModalToggleButton, ModalRef, ModalHeading } from "@trussworks/react-uswds";

const AppNavSidebar = () => {
    const { t } = useTranslation();
    const { profile } = useAuthentication();

    const modalRef = useRef<ModalRef>(null);

    const [sideNav, setSideNav] = useState(t("nav.profile"));

    const pages = [
        {
            path: "/dashboard",
            title: t("dashboard.title"),
            icon: <Icon.List className="mr-3" />,
            id: "navbar-dashboard"
        },
        {
            path: "/dashboard/accounts",
            title: t("accounts.title"),
            icon: <Icon.AccountBalance className="mr-3" />,
            id: "navbar-accounts"
        },
        {
            path: "/dashboard/budgets",
            title: t("budgets.title"),
            icon: <Icon.Assessment className="mr-3" />,
            id: "navbar-budgets"
        },
        {
            path: "/dashboard/spending",
            title: t("spending.title"),
            icon: <ReceiptOutlinedIcon className="mr-3" fontSize="small" />,
            id: "navbar-spending"
        },
        {
            path: "/dashboard/transactions",
            title: t("transactions.title"),
            icon: <Icon.Search className="mr-3" />,
            id: "navbar-transactions"
        },
        {
            path: "/dashboard/tax",
            title: t("tax.title"),
            icon: <RequestPageOutlinedIcon className="mr-3" fontSize="small" />,
            id: "navbar-tax"
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
        <div className="nav-container bg-[#005ea2] px-6 h-screen min-w-64 max-w-min-w-64 flex flex-col pt-6">
            <Link id="navbar-landing" to="/" className="">
                <img src={buddyLogo} className="w-44 ml-4"></img>
                {/*<h2 className="font-semibold text-center text-2xl text-white">{t("app-name")}</h2>*/}
            </Link>
            <div className="flex flex-col items-center gap-6 mt-8">
                {pages.map((pages) => (
                    <Link
                        id={pages.id}
                        to={pages.path}
                        className="w-full usa-button min-w-full text-left items-center"
                        key={pages.path}
                    >
                        {pages.icon} {pages.title}
                    </Link>
                ))}
            </div>

            {/* Profile Information + Settings Button */}
            {profile && (
                <div className="border-t border-t-[#73b3e7] w-full mt-auto pb-8">
                    <div className="py-2" />
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col">
                            {profile.firstName && (
                                <p className="text-lg font-bold text-white">{`${profile.firstName} ${profile?.lastName ?? ""}`}</p>
                            )}
                            <p className="text-sm text-neutral-200">{`${profile.email}`}</p>
                        </div>
                        <ModalToggleButton modalRef={modalRef} opener className="usa-button--unstyled" id="toggle-settings-modal-button"><Icon.Settings className="text-[#d9e8f6]" /></ModalToggleButton>
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
                                        <ul className="usa-sidenav" data-testid="profile-modal-sidenav">
                                            {settingOptions.map((option, idx) => (
                                                <li
                                                    key={idx}
                                                    className={`usa-sidenav__item px-4 py-3 w-40 flex items-center ${sideNav === `${option.title}` ? "usa-current" : ""
                                                        }`}
                                                >
                                                    <option.icon className="mr-2" fontSize={"small"} />
                                                    <button onClick={() => setSideNav(`${option.title}`)} id="no-focus" data-testid={option.title.toLowerCase()}>
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
            )}
        </div>
    );
};

export default AppNavSidebar;
