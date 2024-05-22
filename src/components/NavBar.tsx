import { Link } from "react-router-dom";
import {
    Icon,
    Modal,
    ModalToggleButton,
    ModalRef,
    ModalHeading,
    Fieldset,
    Radio,
    Form,
    Label,
    TextInput,
    Button,
    InputGroup,
    InputSuffix
} from "@trussworks/react-uswds";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";


const NavBar = () => {
    const { t } = useTranslation();
    const modalRef = useRef<ModalRef>(null);
    const [sideNav, setSideNav] = useState("Profile");
    const { i18n } = useTranslation();
    const [currLang, setCurrLang] = useState(i18n.language);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            icon: Icon.Person
        },
        {
            title: t("nav.languages"),
            icon: Icon.Language
        },
    ]

    return (
        <div className="nav-container bg-base-lighter px-6 h-screen min-w-64 max-w-64">
            <div className="flex flex-col items-center">
                <h1 className="font-semibold text-center">{t("app-name")}</h1>
                <div className="flex flex-row items-center gap-4">
                    <h3>{t("nav.greeting")}, [Name]</h3>
                    <ModalToggleButton modalRef={modalRef} opener className="usa-button--unstyled" id="no-focus" >
                        <Icon.Settings style={{ fontSize: "1.4rem" }} />
                    </ModalToggleButton>
                    <Modal
                        ref={modalRef}
                        id="settings-modal"
                        aria-labelledby="modal-1-heading"
                        aria-describedby="modal-1-description"
                        isLarge
                    >
                        <div className="flex flex-col justify-center bg-white w-full max-w-2xl rounded-2xl">
                            <ModalHeading>{t("nav.settings")}</ModalHeading>
                            <div className="flex mt-2">
                                <ul className="usa-sidenav">
                                    {settingOptions.map((option)=> (
                                        <>
                                            <li className={`usa-sidenav__item px-4 py-2 w-40 flex items-center ${sideNav === `${option.title}` ? 'usa-current' : ''}`}>
                                                <option.icon className="mr-2"/>
                                                <button onClick={() => setSideNav(`${option.title}`)} id="no-focus">
                                                    {option.title}
                                                </button>
                                            </li>
                                        </>
                                    ))}
                                </ul>
                                {sideNav === t("nav.profile") && 
                                <div className="flex w-full justify-center">
                                    <Form onSubmit={() => {}} className="w-9/12">
                                        <Fieldset legend={t("nav.profile")} legendStyle="large">
                                            <Label htmlFor="first-name" >{t("nav.first-name")}</Label>
                                            <TextInput
                                                id="first-name"
                                                name="first-name"
                                                type="text"
                                                autoComplete="first-name"
                                            />
                                            <Label htmlFor="last-name">{t("nav.last-name")}</Label>
                                            <TextInput
                                                id="last-name"
                                                name="last-name"
                                                type="text"
                                                autoComplete="last-name"
                                            />
                                            <Label htmlFor="email">{t("auth.email")}</Label>
                                            <TextInput id="email" name="email" type="text" autoComplete="email" disabled />

                                            <Label htmlFor="new-password">{t("nav.new-password")}</Label>
                                            <InputGroup>
                                                <TextInput id="new-password" name="new-password" type={showNewPassword ? "text" : "password"} />
                                                <InputSuffix onClick={()=> setShowNewPassword(!showNewPassword)}>
                                                    {showNewPassword ? <Icon.VisibilityOff /> : <Icon.Visibility/>}
                                                </InputSuffix>
                                            </InputGroup>
                                            <Label htmlFor="confirm-password">{t("nav.confirm-password")}</Label>
                                            <InputGroup>
                                                <TextInput id="confirm-password" name="confirm-password" type={showConfirmPassword ? "text" : "password"} />
                                                <InputSuffix onClick={()=> setShowConfirmPassword(!showConfirmPassword)}>
                                                    {showConfirmPassword ? <Icon.VisibilityOff/> : <Icon.Visibility/>}
                                                </InputSuffix>
                                            </InputGroup>
                                            <Button type="submit">{t("nav.save")}</Button>
                                        </Fieldset>
                                    </Form>
                                </div>}
                                {sideNav === t("nav.languages") && 
                                <div className="flex w-full justify-center">
                                    <Fieldset legend={t("nav.languages")} legendStyle="large" className="w-9/12">
                                        <Radio 
                                            id="english" 
                                            name="language" 
                                            label="English" 
                                            checked={currLang === "en"}
                                            onChange={() => {
                                                i18n.changeLanguage("en")
                                                setCurrLang('en')
                                                setSideNav(t('nav.languages'))
                                            }}
                                        />
                                        <Radio 
                                            id="spanish" 
                                            name="language" 
                                            label="Español" 
                                            checked={currLang === "es"}
                                            onChange={() => {
                                                i18n.changeLanguage("es")
                                                setCurrLang('es')
                                                setSideNav(t('nav.languages'))
                                            }}
                                        />
                                    </Fieldset>
                                </div>}
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
        </div>
    );
};

export default NavBar;
