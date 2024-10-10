import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useTranslation } from 'react-i18next';
import { useAuthentication } from '../../../contexts/AuthenticationContext';
import NavBar from '../../navigation/AppNavSidebar';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
}));

jest.mock('../../../contexts/AuthenticationContext', () => ({
  useAuthentication: jest.fn(),
}));

jest.mock('../../../api/config', () => ({
  config: {
    apiUrl: 'http://localhost:mock',
  }
}));

describe('NavBar Component', () => {
  const profileMock = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };

  beforeEach(() => {
    (useAuthentication as jest.Mock).mockReturnValue({
      profile: profileMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('handles changing settings options in the modal', async () => {
    render(
      <Router>
        <NavBar />
      </Router>
    );

    // Open the settings modal
    const settingsButton = document.getElementById('toggle-settings-modal-button');
    // press enter to avoid error in output:
    // Your focus-trap must have at least one container with at least one tabbable node in it at all times
    // which isn't even applicable here
    fireEvent.keyDown(settingsButton!, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(screen.getByText('nav.settings')).toBeInTheDocument();
    });

    const modal = screen.getByTestId('modalWindow');
    const sideNav = within(modal).getByTestId('profile-modal-sidenav');

    const profileOption = within(sideNav).getByTestId('nav.profile');
    const languagesOption = within(sideNav).getByTestId('nav.languages');

    expect(profileOption).toBeInTheDocument();
    expect(languagesOption).toBeInTheDocument();

    // Click to change to languages option
    fireEvent.click(languagesOption);

    // Verify the component for Languages is rendered
    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('Español')).toBeInTheDocument();
    });

    // Switch back to profile option
    fireEvent.click(profileOption);

    await waitFor(() => {
      expect(screen.getByLabelText('nav.first-name')).toBeInTheDocument();
      expect(screen.getByLabelText('nav.last-name')).toBeInTheDocument();
      expect(screen.getByLabelText('auth.email')).toBeInTheDocument();
      expect(screen.getByLabelText('nav.new-password')).toBeInTheDocument();
      expect(screen.getByLabelText('nav.confirm-password')).toBeInTheDocument();
    });
  });
});
