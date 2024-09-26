import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import Login from '../pages/AuthenticationPages/Login';
import { AuthenticationProvider, useAuthentication } from '../contexts/AuthenticationContext';
import { store } from '../util/redux/store';
import { Provider } from 'react-redux';
import Cookies from 'js-cookie';

// --- DECLARE MOCKS ---

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock API endpoint
jest.mock('../api/config', () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

// Mock fetch requests
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ jwt: 'fetch-mock-jwt' }),
    } as Response)
);

// Mock authentication
jest.mock('../contexts/AuthenticationContext', () => ({
    useAuthentication: () => ({
        jwt: null,
        loading: false,
        setJwt: jest.fn()
    })
}))

const cookiesSpy = jest.spyOn(Cookies, 'get');

describe('Login Component', () => {
    // Render the Login page before each test
    beforeEach(() => {
        // Mocks
        cookiesSpy.mockReturnValue({ 'jwt': 'mock-jwt' });

        render(
            <Provider store={store}>
                <Router>
                    <Login />
                </Router>
            </Provider>
        );
    });

    // Clear the mocks after each test.
    afterEach(() => {
        jest.clearAllMocks();
    });

    // --- TESTS ---

    // Test if the form renders
    it('renders login form', () => {
        expect(screen.getByLabelText('auth.email')).toBeInTheDocument();
        expect(screen.getByLabelText('auth.password')).toBeInTheDocument();
        expect(screen.getByText('auth.login', { selector: 'button' })).toBeInTheDocument();
    });

    // Test if the form allows typing
    it('allows user to type in username and password', () => {
        const usernameInput = screen.getByLabelText('auth.email');
        const passwordInput = screen.getByLabelText('auth.password');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(usernameInput).toHaveValue('testuser');
        expect(passwordInput).toHaveValue('password123');
    });

    // Test if the form can be submitted.
    it('submits the form', () => {
        global.fetch = jest.fn(() => Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(
                { jwt: 'fetch-mock-jwt' }
            )
        } as Response))

        const usernameInput = screen.getByLabelText('auth.email');
        const passwordInput = screen.getByLabelText('auth.password');
        const submitButton = screen.getByText('auth.login', { selector: 'button' });

        fireEvent.change(usernameInput, { target: { value: 'user@email.com' } })
        fireEvent.change(passwordInput, { taarget: { value: 'password123' } })
        fireEvent.click(submitButton);

        expect(global.fetch).toHaveBeenCalled();
    });
});