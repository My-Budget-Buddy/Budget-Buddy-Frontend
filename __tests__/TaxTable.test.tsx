import React from 'react';
import { fireEvent, getByLabelText, render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DisplayTaxTables from '../src/pages/Tax/TaxTable';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTaxReturnByUserId, deleteTaxReturn } from '../src/pages/Tax/taxesAPI';
import { setAllTaxReturns } from '../src/pages/Tax/TaxReturnSlice';

// Mock the image import
jest.mock('../src/pages/Tax/tax-report-icon-free-vector.jpg', () => 'mocked-tax-report-icon');

// Mock the necessary modules
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

jest.mock('../src/pages/Tax/taxesAPI', () => ({
  getTaxReturnByUserId: jest.fn(),
  deleteTaxReturn: jest.fn()
}));

jest.mock('../src/pages/Tax/TaxReturnSlice', () => ({
  setAllTaxReturns: jest.fn()
}));

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('TaxTable', () => {
  it('should fetch and display tax returns when component mounts', async () => {
    const mockDispatch = jest.fn();
    const mockNavigate = jest.fn();
    const mockGetTaxReturnByUserId = (getTaxReturnByUserId as jest.Mock).mockResolvedValue({ data: [{ id: 1, filingStatus: 'Single', firstName: 'John', lastName: 'Doe', year: new Date().getFullYear() }] });
    const mockSetAllTaxReturns = setAllTaxReturns;

    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockReturnValue([{ id: 1, filingStatus: 'Single', firstName: 'John', lastName: 'Doe', year: new Date().getFullYear() }]);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(<DisplayTaxTables />);

    await waitFor(() => expect(mockGetTaxReturnByUserId).toHaveBeenCalled());
    expect(mockDispatch).toHaveBeenCalledWith(mockSetAllTaxReturns([{
      id: 1, filingStatus: 'Single', firstName: 'John', lastName: 'Doe', year: new Date().getFullYear(),
      userId: 0,
      email: undefined,
      phoneNumber: undefined,
      address: undefined,
      city: undefined,
      state: undefined,
      zip: undefined,
      dateOfBirth: undefined,
      ssn: undefined
    }]));
  });


  it('should delete a tax return when delete button is clicked', async () => {
    const mockDispatch = jest.fn();
    const mockNavigate = jest.fn();
    const mockDeleteTaxReturn = (deleteTaxReturn as jest.Mock).mockResolvedValue({});
    const mockGetTaxReturnByUserId = (getTaxReturnByUserId as jest.Mock).mockResolvedValue({ data: [{ id: 1, filingStatus: 'Single', firstName: 'John', lastName: 'Doe', year: new Date().getFullYear() }] });
    const mockSetAllTaxReturns = setAllTaxReturns;

    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockReturnValue([{ id: 1, filingStatus: 'Single', firstName: 'John', lastName: 'Doe', year: new Date().getFullYear() }]);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(<DisplayTaxTables />);

    const deleteButton = screen.getByLabelText('delete')

    // Simulate clicking the delete button
    fireEvent.click(deleteButton);

    await waitFor(() => expect(mockDeleteTaxReturn).toHaveBeenCalledWith(1));
    expect(mockDispatch).toHaveBeenCalledWith(mockSetAllTaxReturns([]));
  });

  it('should navigate to edit page when edit button is clicked', async () => {
    const mockDispatch = jest.fn();
    const mockNavigate = jest.fn();
    const mockGetTaxReturnByUserId = (getTaxReturnByUserId as jest.Mock).mockResolvedValue({ data: [{ id: 1, filingStatus: 'Single', firstName: 'John', lastName: 'Doe', year: new Date().getFullYear() }] });
    const mockSetAllTaxReturns = setAllTaxReturns;

    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockReturnValue([{ id: 1, filingStatus: 'Single', firstName: 'John', lastName: 'Doe', year: new Date().getFullYear() }]);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(<DisplayTaxTables />);

    const editButton = screen.getByLabelText('edit');

    // Simulate clicking the edit button
    fireEvent.click(editButton);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/dashboard/tax/1/w2/0'));
  });


});