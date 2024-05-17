import {
  Header,
  NavMenuButton,
  PrimaryNav,
  Title,
} from "@trussworks/react-uswds";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const navItems = [
  <Link to="/login" className="usa-nav__link">
    Log In
  </Link>,
  <Link to="/register" className="usa-nav__link">
    Register
  </Link>,
];

const LandingLayout: React.FC = () => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <div className="layout-container">
      {/* Header component */}
      <Header basic showMobileOverlay={mobileExpanded}>
        <div className="usa-nav-container">
          <div className="usa-navbar w-full">
            <Link to="/">
              <Title>BudgetBuddy</Title>
            </Link>

            <NavMenuButton
              label="Menu"
              onClick={() => setMobileExpanded((prev) => !prev)}
            />
          </div>

          <PrimaryNav
            items={navItems}
            mobileExpanded={mobileExpanded}
            onToggleMobileNav={() => setMobileExpanded((prev) => !prev)}
          ></PrimaryNav>
        </div>
      </Header>

      <main className="min-h-full w-full">
        <Outlet />
      </main>
      {/*<FooterComponent/>*/}
    </div>
  );
};

export default LandingLayout;
