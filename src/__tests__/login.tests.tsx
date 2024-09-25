import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import Login from '../pages/AuthenticationPages/Login';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('Login Component', () => {
    beforeEach(() => {
        render(
            <Router>
                <Login />
            </Router>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders login form', () => {
        expect(screen.getByLabelText('login.username')).toBeInTheDocument();
        expect(screen.getByLabelText('login.password')).toBeInTheDocument();
        expect(screen.getByText('login.submit')).toBeInTheDocument();
    });

    it('allows user to type in username and password', () => {
        const usernameInput = screen.getByLabelText('login.username');
        const passwordInput = screen.getByLabelText('login.password');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(usernameInput).toHaveValue('testuser');
        expect(passwordInput).toHaveValue('password123');
    });

    it('submits the form', () => {
        const usernameInput = screen.getByLabelText('login.username');
        const passwordInput = screen.getByLabelText('login.password');
        const submitButton = screen.getByText('login.submit');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        // Add your assertions here based on what should happen on form submission
    });
});