import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingNavBar from '../src/components/navigation/LandingNavBar';
import { BrowserRouter } from 'react-router-dom';
import { PrimaryNav } from '@trussworks/react-uswds';

jest.mock("../src/api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock" // mock with localhost url
    }
}));

jest.mock("../src/contexts/AuthenticationContext", () => ({
    useAuthentication: jest.fn() // Create a mock function here
}));

describe('Landing Header Not Logged In', () => {
    beforeEach(() => {
        require("../src/contexts/AuthenticationContext").useAuthentication.mockReturnValue({
            jwt:null,
            logout: jest.fn()
        });

        render(
            <BrowserRouter>
                <LandingNavBar />
            </BrowserRouter>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the landing header', async () => {
        await waitFor(() => {
            const headerLogo = screen.getByTestId('header-logo');
            expect(headerLogo).toBeInTheDocument();
            expect(headerLogo).toHaveAttribute('src', "test-image-stub");
            expect(document.getElementById('nav-menu-button')).toBeInTheDocument();
        });
    });

    it('renders the navigation links in menu', async () => {
        const navMenuButton = document.getElementById('nav-menu-button');
        navMenuButton?.click();

        expect(screen.getByTestId('navCloseButton')).toBeInTheDocument();

        await waitFor(() => {
            expect(document.getElementById('login-link')).toBeInTheDocument();
            expect(document.getElementById('register-link')).toBeInTheDocument();
        });

        const navMenuCloseButton = screen.getByTestId('navCloseButton');
        navMenuCloseButton.click();

        expect(document.getElementById('nav-menu-button')).toBeInTheDocument();

    });
});

describe('Landing Header Logged In', () => {
    beforeEach(() => {
        require("../src/contexts/AuthenticationContext").useAuthentication.mockReturnValue({
            jwt: 'mock-jwt',
            logout: jest.fn()
        });

        render(
            <BrowserRouter>
                <LandingNavBar />
            </BrowserRouter>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the landing header', async () => {
        await waitFor(() => {
            const headerLogo = screen.getByTestId('header-logo');
            expect(headerLogo).toBeInTheDocument();
            expect(headerLogo).toHaveAttribute('src', "test-image-stub");
            expect(document.getElementById('nav-menu-button')).toBeInTheDocument();
        });
    });

    it('renders the navigation links in menu', async () => {
        const navMenuButton = document.getElementById('nav-menu-button');
        navMenuButton?.click();

        await waitFor(() => {
            expect(document.getElementById('dashboard-link')).toBeInTheDocument();
            expect(document.getElementById('logout-button')).toBeInTheDocument();
        });
    });

    it('logs out when logout button is clicked', async () => {
        const navMenuButton = document.getElementById('nav-menu-button');
        navMenuButton?.click();

        await waitFor(() => {
            const logoutButton = document.getElementById('logout-button');
            logoutButton?.click();
            expect(require("../src/contexts/AuthenticationContext").useAuthentication().logout).toHaveBeenCalled();
        });
    });
});

