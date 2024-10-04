import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '../src/utils/redux/store';
import { BrowserRouter as Router } from 'react-router-dom';
import PersonalInfoStep from '../src/pages/Tax/PersonalInfoStep';
import { getTaxReturnById, updateTaxReturnAPI } from '../src/pages/Tax/taxesAPI';

jest.mock("../src/api/config", () => ({
  config: {
    apiUrl: "http://localhost:mock",
  },
}));

// Mock the taxesAPI module
jest.mock('../src/pages/Tax/taxesAPI', () => ({
  getTaxReturnById: jest.fn(),
  updateTaxReturnAPI: jest.fn()
}));

describe('PersonalInfoStep', () => {
  beforeEach(() => {
    // Provide mock implementations
    (getTaxReturnById as jest.Mock).mockResolvedValue({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        dateOfBirth: '1990-01-01',
        ssn: '123-45-6789'
      }
    });

    (updateTaxReturnAPI as jest.Mock).mockResolvedValue({
      data: {
        success: true
      }
    });
  });

  it('should render correctly with initial state', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <PersonalInfoStep />
          </Router>
        </Provider>
      );
    });

    const firstName = screen.getByLabelText('First Name');
    const lastName = screen.getByLabelText('Last Name');
    const streetName = screen.getByLabelText('Street Name');
    const city = screen.getByLabelText('City');
    const state = screen.getByLabelText('State');
    const zip = screen.getByLabelText('ZIP');
    const dob = screen.getByLabelText('Date of Birth');
    const ssn = screen.getByLabelText('Social Security Number');
    const save = screen.getByText('Save');

    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
    expect(streetName).toBeInTheDocument();
    expect(city).toBeInTheDocument();
    expect(state).toBeInTheDocument();
    expect(zip).toBeInTheDocument();
    expect(dob).toBeInTheDocument();
    expect(ssn).toBeInTheDocument();
    expect(save).toBeInTheDocument();
  });


  it('should update form fields correctly', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <PersonalInfoStep />
          </Router>
        </Provider>
      );
    });

    const firstName = screen.getByLabelText('First Name');
    fireEvent.change(firstName, { target: { value: 'Jane' } });
    expect(firstName).toHaveValue('Jane');

    const lastName = screen.getByLabelText('Last Name');
    fireEvent.change(lastName, { target: { value: 'Smith' } });
    expect(lastName).toHaveValue('Smith');
  });

  it('should call handleSave on save button click', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <PersonalInfoStep />
          </Router>
        </Provider>
      );
    });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(updateTaxReturnAPI).toHaveBeenCalled();
  });

});