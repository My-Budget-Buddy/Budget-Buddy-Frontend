import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { Header, NavMenuButton, PrimaryNav } from "@trussworks/react-uswds";
import logo from "/images/bb-logo.png";

const navItems = [
    <Link id="login-link" to="/login" className="usa-nav__link">
        Log In
    </Link>,
    <Link id="register-link" to="/register" className="usa-nav__link">
        Register
    </Link>
];

const LandingNavBar = () => {
    const { jwt, logout } = useAuthentication();
    const [mobileExpanded, setMobileExpanded] = useState(false);

    const authenticatedItems = [
        <Link id="dashboard-link" to="/dashboard" className="usa-nav__link">
            Dashboard
        </Link>,
        <button id="logout-button" className="usa-nav__link" onClick={() => logout()}>
            Log Out
        </button>
    ];

    return (
        <Header basic showMobileOverlay={mobileExpanded} className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="usa-nav-container">
                <div className="usa-navbar w-full flex justify-between">
                    <Link id="landing-link" to="/">
                        <img className="logo-img" src={logo} alt="logo" />
                    </Link>

                    <NavMenuButton id="nav-menu-button" label="Menu" onClick={() => setMobileExpanded((prev) => !prev)} />
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

export default LandingNavBar;
