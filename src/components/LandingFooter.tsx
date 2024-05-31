import React from "react";
import { Link } from "react-router-dom";
import footerLogo from "../images/footerLogo.png";

const Footer: React.FC = () => {
    return (


        <footer className="usa-footer usa-footer--slim bg-white shadow-md w-full z-50">
            <div className="grid-container usa-footer__return-to-top" style={{ backgroundColor: 'transparent' }}>
                <a href="#" aria-label="Return to top" className="usa-footer__return-to-top-link">
                    <svg
                        className="usa-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        role="img"
                        style={{ width: '40px', height: '40px' }}
                    >
                        <circle cx="12" cy="12" r="10" fill="#005ea2" />
                        <path
                            fill="white"
                            d="M12 8c.28 0 .53.11.71.29l4 4a1.003 1.003 0 01-1.42 1.42L12 10.41l-3.29 3.3a1.003 1.003 0 01-1.42-1.42l4-4c.18-.18.43-.29.71-.29z"
                        />
                    </svg>
                </a>
            </div>
            <div className="usa-footer__primary-section">
                <div className="usa-footer__primary-container grid-row">
                    <div className="mobile-lg:grid-col-8">
                        <nav className="usa-footer__nav" aria-label="Footer navigation">
                            <ul className="grid-row grid-gap">
                                <li className="mobile-lg:grid-col-6 desktop:grid-col-auto usa-footer__primary-content">
                                    <Link className="usa-footer__primary-link" to="/">
                                        About Us
                                    </Link>
                                </li>
                                <li className="mobile-lg:grid-col-6 desktop:grid-col-auto usa-footer__primary-content">
                                    <Link className="usa-footer__primary-link" to="/">
                                        Services
                                    </Link>
                                </li>
                                <li className="mobile-lg:grid-col-6 desktop:grid-col-auto usa-footer__primary-content">
                                    <Link className="usa-footer__primary-link" to="/">
                                        Contact
                                    </Link>
                                </li>
                                <li className="mobile-lg:grid-col-6 desktop:grid-col-auto usa-footer__primary-content">
                                    <Link className="usa-footer__primary-link" to="/">
                                        Support
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="mobile-lg:grid-col-4">
                        <address className="usa-footer__address">
                            <div className="grid-row grid-gap">
                                <div className="grid-col-auto mobile-lg:grid-col-12 desktop:grid-col-auto">
                                    <div className="usa-footer__contact-info">
                                        <a href="tel:1-800-555-5555">(800) 555-1234</a>
                                    </div>
                                </div>
                                <div className="grid-col-auto mobile-lg:grid-col-12 desktop:grid-col-auto">
                                    <div className="usa-footer__contact-info">
                                        <a href="mailto:info@budgetbuddy.com">info@budgetbuddy.com</a>
                                    </div>
                                </div>
                            </div>
                        </address>
                    </div>
                </div>
            </div>
            <div className="usa-footer__secondary-section">
                <div className="grid-container bg-transparent">
                    <div className="usa-footer__logo grid-row grid-gap-2">
                        <div className="grid-col-auto">
                            <img className="usa-footer__logo-img" src={footerLogo} alt="BudgetBuddy Logo" />
                        </div>
                        <div className="grid-col-auto">
                            <p className="usa-footer__logo-heading">BudgetBuddy</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>


    );
};

export default Footer;
