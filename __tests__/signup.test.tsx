import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../src/pages/AuthenticationPages/Register';
import Cookies from 'js-cookie';
import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom';
import * as router from 'react-router-dom'
import Login from '../src/pages/AuthenticationPages/Login';
import { act } from 'react';
import ReactDOM from 'react-dom';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock authentication
jest.mock('../src/contexts/AuthenticationContext', () => ({
    useAuthentication: () => ({
        jwt: null,
        loading: false,
        setJwt: jest.fn()
    })
}))

// Mock API endpoint
jest.mock('../src/api/config', () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

// Mock OK fetch
// global.fetch = jest.fn(() =>
//     Promise.resolve({
//         json: () => Promise.resolve({ jwt: 'fetch-mock-jwt' }),
//         ok: true,
//         status: 200
//     } as Response)
// );

// Mock bad fetch
// global.fetch = jest.fn(() =>
//     Promise.resolve({
//         json: () => Promise.resolve({ jwt: 'fetch-mock-jwt' }),
//         ok: false,
//         status: 400,
//         headers: new Headers({
//             'content-type': 'text/plain'
//         }),
//         text: () => Promise.resolve('Mocked failed fetch.')
//     } as Response)
// );

// Mock grab cookies
const cookieSpy = jest.spyOn(Cookies, 'get').mockReturnValue({ 'jwt': 'cookie-mock-jwt' });

// Spy on setShowPassword state method
const showPassSpy = jest.spyOn(React, 'useState')

describe('Register Component', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<div>mock login.</div>} />
                    <Route path="*" element={<Navigate to="/register" />} />
                </Routes>
            </BrowserRouter>
        )
    })

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    })

    // Check that the base page renders
    it('renders Register component', () => {
        expect(screen.getByText('auth.register', { selector: 'em' })).toBeInTheDocument();
    });

    // Check that the form renders
    it('renders input fields', () => {
        expect(screen.getByLabelText('auth.email')).toBeInTheDocument();
        expect(screen.getByLabelText('auth.new-password')).toBeInTheDocument();
        expect(screen.getByLabelText('auth.confirm-password')).toBeInTheDocument();
    });

    // Check that the form can have information entered.
    it('allows user to type in input fields', () => {
        const emailInput = screen.getByLabelText('auth.email');
        const passwordInput = screen.getByLabelText('auth.new-password');
        const confirmPasswordInput = screen.getByLabelText('auth.confirm-password');

        fireEvent.change(emailInput, { target: { value: 'mock.test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

        expect(emailInput).toHaveValue('mock.test@example.com');
        expect(passwordInput).toHaveValue('password123');
        expect(confirmPasswordInput).toHaveValue('password123');
    });

    // Check that the form has info validation for invalid info (empty fields and email checking handled by trussworks, so only mismatched passwords is tested.)
    it('shows error message on invalid input', () => {
        // Spy/mock fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ jwt: 'fetch-mock-jwt' }),
                ok: false,
                status: 400,
                headers: new Headers({
                    'content-type': 'text/plain'
                }),
                text: () => Promise.resolve('Mocked failed fetch.')
            } as Response)
        );

        // Grab html elements
        const emailInput = screen.getByLabelText('auth.email');
        const passwordInput = screen.getByLabelText('auth.new-password');
        const confirmPasswordInput = screen.getByLabelText('auth.confirm-password');
        const submitButton = screen.getByText('auth.register', { selector: 'button' });

        fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password1' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password2' } });
        fireEvent.click(submitButton);

        //expect(screen.getByText('Error Creating Account')).toBeInTheDocument();
        expect(global.fetch).not.toHaveBeenCalled();
        expect(global.window.location.href).toContain('/register')
    });

    // Check that valid information is sent along
    it('submits form with valid input', async () => {
        // Remove all from dom
        cleanup();

        // Render with act
        const { getByTestId, getByText, asFragment } = render(
            <BrowserRouter>
                <Routes>
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<div>mock login.</div>} />
                    <Route path="*" element={<Navigate to="/register" />} />
                </Routes>
            </BrowserRouter>
        );

        // Mock global fetch
        global.fetch = jest.fn((str, req) =>
            Promise.resolve({
                ok: true,
                status: 200
            } as Response)
        );

        // Perform sign up
        const emailInput = screen.getByLabelText('auth.email');
        const passwordInput = screen.getByLabelText('auth.new-password');
        const confirmPasswordInput = screen.getByLabelText('auth.confirm-password');
        const submitButton = screen.getByText('auth.register', { selector: 'button' });

        fireEvent.change(emailInput, { target: { value: 'mock.test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

        submitButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        // Add more assertions based on what happens after form submission
        expect(global.fetch).toHaveBeenCalledTimes(1);

        const loginNode = await waitFor(() => getByText('mock login.'));
        expect(screen.getByText('mock login.')).toBeInTheDocument();    // Ensure login has loaded
    });
});