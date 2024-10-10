import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useTranslation } from 'react-i18next';
import Languages from '../../Settings/Languages';

const changeLanguageMock = jest.fn();
const setSideNavMock = jest.fn();

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: changeLanguageMock,
    },
  }),
}));

describe('Languages Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('has operational settings buttons', async () => {

    render(<Languages setSideNav={setSideNavMock} />);

    const englishRadio = screen.getByLabelText('English');
    const spanishRadio = screen.getByLabelText('Español');

    // Click on the Spanish radio button to change the language
    fireEvent.click(spanishRadio);

    expect(spanishRadio).toBeChecked();
    expect(englishRadio).not.toBeChecked();

    expect(changeLanguageMock).toHaveBeenCalledWith('es');

    // Change back to English
    fireEvent.click(englishRadio);

    expect(englishRadio).toBeChecked();
    expect(spanishRadio).not.toBeChecked();

    expect(changeLanguageMock).toHaveBeenCalledWith('en');
  });
});
