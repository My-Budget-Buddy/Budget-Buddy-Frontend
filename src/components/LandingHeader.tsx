import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthentication } from "../contexts/AuthenticationContext";
import { Header, NavMenuButton, PrimaryNav, Title } from "@trussworks/react-uswds";

const navItems = [
    <Link to="/login" className="usa-nav__link">
        Log In
    </Link>,
    <Link to="/register" className="usa-nav__link">
        Register
    </Link>
];

const LandingHeader = () => {
    const { jwt, logout } = useAuthentication();
    const [mobileExpanded, setMobileExpanded] = useState(false);

    const authenticatedItems = [
        <Link to="/dashboard" className="usa-nav__link">
            Dashboard
        </Link>,
        <button className="usa-nav__link" onClick={() => logout()}>
            Log Out
        </button>
    ];

    return (
        <Header basic showMobileOverlay={mobileExpanded} className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="usa-nav-container">
                <div className="usa-navbar w-full flex justify-between">
                    <Link to="/">
                        <Title>BudgetBuddy</Title>
                    </Link>

                    <NavMenuButton label="Menu" onClick={() => setMobileExpanded((prev) => !prev)} />
                </div>

                <PrimaryNav
                    items={jwt ? authenticatedItems : navItems}
                    mobileExpanded={mobileExpanded}
                    onToggleMobileNav={() => setMobileExpanded((prev) => !prev)}
                ></PrimaryNav>
            </div>
        </Header>
    );
};

export default LandingHeader;
