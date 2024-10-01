import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useTranslation } from 'react-i18next';
import { createTaxReturn } from '../src/pages/Tax/taxesAPI';
import { setTaxReturnInfo } from '../src/pages/Tax/TaxReturnSlice';
import TaxNav from '../src/pages/Tax/TaxNav';

// Mock dependencies
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn().mockReturnValue({}),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../src/pages/Tax/taxesAPI', () => ({
  createTaxReturn: jest.fn(),
}));

jest.mock('../src/pages/Tax/TaxReturnSlice', () => ({
  setTaxReturnInfo: jest.fn(),
}));

describe('TaxNav Component', () => {
  const dispatchMock = jest.fn();
  const navigateMock = jest.fn();

  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);
    dispatchMock.mockClear();
    navigateMock.mockClear();
  });

  test('renders the TaxNav component correctly', () => {
    render(<TaxNav />);
    expect(screen.getByText('tax.file-taxes')).toBeInTheDocument();
    expect(screen.getByText('tax.estimate-refund')).toBeInTheDocument();
    expect(screen.getByText('tax.document-checklist')).toBeInTheDocument();
    expect(screen.getByText('tax.refund-planning')).toBeInTheDocument();
  });

  // Rewrite after Document Checklist functionality is implemented
  test('handles Document Checklist button click', async () => {

    render(<TaxNav />);

    const initialState = document.body.innerHTML;
    const fileTaxesButton = document.getElementById("document-checklist");

    fireEvent.click(fileTaxesButton!);

    const postClickState = document.body.innerHTML;

    await waitFor(() => {
      expect(postClickState).toBe(initialState);
    });
  });

  // Rewrite after Refund Planning functionality is implemented
  test('handles Refund Planning button click', async () => {

    render(<TaxNav />);

    const initialState = document.body.innerHTML;
    const fileTaxesButton = document.getElementById("refund-planning");

    fireEvent.click(fileTaxesButton!);

    const postClickState = document.body.innerHTML;

    await waitFor(() => {
      expect(postClickState).toBe(initialState);
    });
  });

  // Rewrite after Estimate Refund functionality is implemented
  test('handles Estimate Refund button click', async () => {

    render(<TaxNav />);

    const initialState = document.body.innerHTML;
    const fileTaxesButton = document.getElementById("estimate-refund");

    fireEvent.click(fileTaxesButton!);

    const postClickState = document.body.innerHTML;

    await waitFor(() => {
      expect(postClickState).toBe(initialState);
    });
  });

  test('handles File Taxes button click', async () => {
    (createTaxReturn as jest.Mock).mockResolvedValue({
      data: { id: 123 },
    });

    render(<TaxNav />);

    const fileTaxesButton = document.getElementById("file-taxes");

    fireEvent.click(fileTaxesButton!);

    await waitFor(() => {
      expect(createTaxReturn).toHaveBeenCalledWith({
        year: 2024,
        userId: 1,
      });
      screen.findByText('tax.file-taxes');
      expect(dispatchMock).toHaveBeenCalledWith(setTaxReturnInfo({ id: 123 }));
      expect(navigateMock).toHaveBeenCalledWith('/dashboard/tax/123');
    });
  });

  test('handles error when creating tax return fails', async () => {
    const consoleSpy = jest.spyOn(console, 'log'); // Spy on console.log
    (createTaxReturn as jest.Mock).mockRejectedValue(new Error('Error'));

    render(<TaxNav />);
    const fileTaxesButton = document.getElementById("file-taxes");
    fireEvent.click(fileTaxesButton!);

    expect(createTaxReturn).toHaveBeenCalledWith({
      year: 2024,
      userId: 1,
    });

    await waitFor(() => {
      expect(createTaxReturn).toHaveBeenCalledWith({
        year: 2024,
        userId: 1,
      });

      expect(consoleSpy).toHaveBeenCalledWith("Error: Could not create new tax return");
    });
  });
});
