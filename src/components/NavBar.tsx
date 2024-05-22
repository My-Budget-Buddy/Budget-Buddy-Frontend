import { Link } from "react-router-dom";
import {
    Icon,
    Modal,
    ModalToggleButton,
    ModalRef,
    ModalHeading,
    SideNav,
    Form,
    Label,
    TextInput,
    Button,
    LanguageSelector
} from "@trussworks/react-uswds";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import i18next from "i18next";

const NavBar = () => {
    const { t } = useTranslation();
    const modalRef = useRef<ModalRef>(null);

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
    const sideNavItems = [
        <a href="#one" className="usa-current" key="one">
            Account
        </a>,
        <a href="#two" key="two">
            General
        </a>
    ];

    return (
        <div className="nav-container bg-base-lighter px-6 min-h-screen min-w-64 max-w-64">
            <div className="flex flex-col items-center">
                <h1 className="font-semibold">{t("app-name")}</h1>
                <div className="flex flex-row items-center gap-4">
                    <h3>{t("nav.greeting")}, [Name]</h3>
                    <ModalToggleButton modalRef={modalRef} opener className="usa-button--unstyled" onClick={() => {}}>
                        <Icon.Settings style={{ fontSize: "1.4rem" }} />
                    </ModalToggleButton>
                    <Modal
                        ref={modalRef}
                        id="settings-modal"
                        aria-labelledby="modal-1-heading"
                        aria-describedby="modal-1-description"
                        isLarge
                    >
                        <div className="flex flex-col justify-center bg-white w-full max-w-xl rounded-2xl">
                            <ModalHeading>Settings</ModalHeading>
                            <div className="flex mt-2">
                                <SideNav items={sideNavItems} />
                                <div className="flex w-full justify-center">
                                    <Form onSubmit={() => {}} className="w-9/12">
                                        {/* <Fieldset legend={t("auth.login-desc")} legendStyle="default"> */}
                                        <Label htmlFor="first-name">First Name</Label>
                                        <TextInput
                                            id="first-name"
                                            name="first-name"
                                            type="text"
                                            autoComplete="first-name"
                                        />
                                        <Label htmlFor="last-name">Last Name</Label>
                                        <TextInput
                                            id="last-name"
                                            name="last-name"
                                            type="text"
                                            autoComplete="last-name"
                                        />
                                        <Label htmlFor="email">{t("auth.email")}</Label>
                                        <TextInput id="email" name="email" type="text" autoComplete="email" disabled />

                                        <Label htmlFor="new-password">{t("auth.password")}</Label>
                                        <TextInput id="new-password" name="new-password" type={"text"} />
                                        <Label htmlFor="confirm-password">Confirm Password</Label>
                                        <TextInput id="confirm-password" name="confirm-password" type={"text"} />
                                        <Button
                                            type="button"
                                            title="Toggle Password Visibility"
                                            className="usa-show-password"
                                            aria-controls="password"
                                            onClick={() => {}}
                                        >
                                            {t("auth.show")}
                                        </Button>

                                        <Button type="submit">Save</Button>
                                        {/* </Fieldset> */}
                                    </Form>
                                </div>
                            </div>
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
            <div className="flex flex-col items-center gap-6 absolute bottom-5">
                <LanguageSelector
                    className="w-full min-w-full text-left items-center"
                    langs={[
                        {
                            attr: "es",
                            label: "Cambiar al español",
                            label_local: "Spanish - Mexican",
                            on_click: () => i18next.changeLanguage("es")
                        },
                        {
                            attr: "en",
                            label: "Switch to English",
                            on_click: () => i18next.changeLanguage("en")
                        }
                    ]}
                />
            </div>
        </div>
    );
};

export default NavBar;
