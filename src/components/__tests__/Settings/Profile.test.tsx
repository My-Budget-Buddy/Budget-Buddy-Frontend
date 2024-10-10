import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../src/components/Settings/Profile';
import { updateUserPassword } from '../src/pages/Tax/taxesAPI';
import { URL_updateUser } from "../src/api/services/UserService";
import { useAuthentication } from '../src/contexts/AuthenticationContext';

// Mock the global fetch function
global.fetch = jest.fn();

// Mock dependencies
jest.mock('../src/pages/Tax/taxesAPI', () => ({
  updateUserPassword: jest.fn(),
}));

// Mock dependencies
jest.mock('../src/api/services/UserService', () => ({
  URL_updateUser: jest.fn()
}));

jest.mock('../src/contexts/AuthenticationContext', () => ({
  useAuthentication: jest.fn(),
}));

jest.mock('../src/api/config', () => ({
  config: {
    apiUrl: 'http://localhost:mock',
  }
}));

const mockProfile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
};

describe('Profile Component', () => {
  const setProfileMock = jest.fn();
  const logoutMock = jest.fn();

  beforeEach(() => {
    (useAuthentication as jest.Mock).mockReturnValue({
      jwt: 'fake-jwt-token',
      profile: mockProfile,
      setProfile: setProfileMock,
      logout: logoutMock,
    });
    jest.clearAllMocks();
  });

  test('renders the Profile form correctly', () => {
    render(<Profile />);

    // Check for form labels and input fields
    expect(screen.getByLabelText('nav.first-name')).toBeInTheDocument();
    expect(screen.getByLabelText('nav.last-name')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.email')).toBeInTheDocument();
    expect(screen.getByLabelText('nav.new-password')).toBeInTheDocument();
    expect(screen.getByLabelText('nav.confirm-password')).toBeInTheDocument();

    // Check if the first name, last name, and email fields are correctly filled with mock data
    expect(screen.getByDisplayValue(mockProfile.firstName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.lastName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.email)).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    render(<Profile />);

    const newPasswordInput = screen.getByLabelText('nav.new-password');
    const confirmPasswordInput = screen.getByLabelText('nav.confirm-password');

    // Toggle to show passwords

    const toggleNewPasswordVisibilityOn = screen.getByTestId('show-password-vis-on');
    const toggleConfirmPasswordVisibilityOn = screen.getByTestId('confirm-password-vis-on');

    // Initially, passwords should be hidden
    expect(newPasswordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Show new password
    fireEvent.click(toggleNewPasswordVisibilityOn);
    expect(newPasswordInput).toHaveAttribute('type', 'text');

    // Show confirm password
    fireEvent.click(toggleConfirmPasswordVisibilityOn);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    // Toggle back to hidden

    const toggleNewPasswordVisibilityOff = screen.getByTestId('show-password-vis-off');
    const toggleConfirmPasswordVisibilityOff = screen.getByTestId('confirm-password-vis-off');

    // Hide new password
    fireEvent.click(toggleNewPasswordVisibilityOff);
    expect(newPasswordInput).toHaveAttribute('type', 'password');

    // Hide confirm password
    fireEvent.click(toggleConfirmPasswordVisibilityOff);
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  test('displays error when passwords do not match', async () => {
    render(<Profile />);

    const newPasswordInput = screen.getByLabelText('nav.new-password');
    const confirmPasswordInput = screen.getByLabelText('nav.confirm-password');
    const submitButton = screen.getByText('nav.save');

    // Enter different passwords
    fireEvent.change(newPasswordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Check for the error alert
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    expect(updateUserPassword).not.toHaveBeenCalled();
  });

  const newAccount = {
    firstName: 'Jane',
    lastName: 'Dane',
  };

  const changeNameFields = () => {
    const firstNameInput = screen.getByLabelText('nav.first-name');
    const lastNameInput = screen.getByLabelText('nav.last-name');
    const submitButton = screen.getByText('nav.save');
    fireEvent.change(firstNameInput, { target: { value: newAccount.firstName } });
    fireEvent.change(lastNameInput, { target: { value: newAccount.lastName } });
    fireEvent.click(submitButton);
  }

  test('submits the form successfully and renders updated first and last names', async () => {

    render(<Profile />);

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(newAccount),
      })
    );

    changeNameFields();

    await waitFor(() => {
      expect(setProfileMock).toHaveBeenCalledWith(newAccount);
      expect(screen.getByDisplayValue(newAccount.firstName)).toBeInTheDocument();
      expect(screen.getByDisplayValue(newAccount.lastName)).toBeInTheDocument();
    });
  });

  const consoleSpy = jest.spyOn(console, 'log'); // Spy on console.log

  test('handles response errors while updating the first and last name', async () => {

    render(<Profile />);


    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: "500",
        json: () => Promise.resolve(newAccount),
      })
    );

    changeNameFields();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("[profile -- updateProfile]: error updating profile (status = 500)");
    });
  });

  test('handles fetch errors while updating the first and last name', async () => {

    render(<Profile />);

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Server is down'))
    );

    changeNameFields();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("[profile -- updateProfile]: error => Error: Server is down");
    });
  });

  test('submits the form with matching passwords', async () => {
    render(<Profile />);

    const newPasswordInput = screen.getByLabelText('nav.new-password');
    const confirmPasswordInput = screen.getByLabelText('nav.confirm-password');
    const submitButton = screen.getByText('nav.save');

    // Enter matching passwords
    fireEvent.change(newPasswordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Check that the API to update the password was called
    await waitFor(() => {
      expect(updateUserPassword).toHaveBeenCalled();
    });

    // Check that the success alert is shown
    await waitFor(() => {
      expect(screen.getByText('Password has been updated')).toBeInTheDocument();
    });
  });

  test('calls logout when the logout button is clicked', () => {
    render(<Profile />);

    const logoutButton = screen.getByText('auth.logout');
    fireEvent.click(logoutButton);

    // Check that logout was called
    expect(logoutMock).toHaveBeenCalled();
  });
});
