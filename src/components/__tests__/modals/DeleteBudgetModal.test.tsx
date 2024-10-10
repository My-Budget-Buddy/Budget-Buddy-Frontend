import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAppDispatch, useAppSelector } from '../../../utils/redux/hooks';
import DeleteBudgetModal from '../../modals/DeleteBudgetModal';
import { setIsSending } from '../../../utils/redux/simpleSubmissionSlice';
import { deleteBudget } from '../../../api/requests/budgetRequests';

// Mock the necessary functions
jest.mock('../src/utils/redux/hooks');
jest.mock('../src/api/requests/budgetRequests');

jest.mock('../src/api/config', () => ({
  config: {
    apiUrl: 'http://localhost:mock',
  }
}));

describe('DeleteBudgetModal Component', () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
    (useAppSelector as unknown as jest.Mock).mockReturnValue(false); // Mock isSending as false initially
  });

  test('renders the delete button and modal content correctly', () => {
    render(<DeleteBudgetModal id={1} category="Shopping" />);

    // Check if delete button is present
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();

    // Open the modal by clicking the delete button
    fireEvent.click(deleteButton);

    // Check if the modal is opened with correct content
    expect(screen.getByText('Are you sure you want to delete the Shopping budget?')).toBeInTheDocument();
    expect(screen.getByText('budgets.buttons.delete')).toBeInTheDocument();
    expect(screen.getByText('budgets.buttons.go-back')).toBeInTheDocument();
  });

  test('handles form submission successfully', async () => {
    (deleteBudget as jest.Mock).mockResolvedValue({});
    render(<DeleteBudgetModal id={1} category="Shopping" />);

    // Open the modal
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Click on delete
    const confirmDeleteButton = screen.getByText('budgets.buttons.delete');
    fireEvent.click(confirmDeleteButton);

    // Ensure state change: isSending is set to true
    expect(dispatchMock).toHaveBeenCalledWith(setIsSending(true));

    // Wait for the async action to complete and ensure deleteBudget is called
    await waitFor(() => {
      expect(deleteBudget).toHaveBeenCalledWith(1); // Ensure the correct budget ID is passed
    });

    // Ensure state change: isSending is set back to false
    expect(dispatchMock).toHaveBeenCalledWith(setIsSending(false));
  });

  test('displays error if budget deletion fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    (deleteBudget as jest.Mock).mockRejectedValue(new Error('Deletion failed'));

    render(<DeleteBudgetModal id={1} category="Shopping" />);

    // Open the modal
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Click on delete
    const confirmDeleteButton = screen.getByText('budgets.buttons.delete');
    fireEvent.click(confirmDeleteButton);

    // Ensure state change: isSending is set to true
    expect(dispatchMock).toHaveBeenCalledWith(setIsSending(true));

    // Wait for the async action to complete and ensure the error is logged
    await waitFor(() => {
      expect(deleteBudget).toHaveBeenCalledWith(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    // Ensure state change: isSending is set back to false
    expect(dispatchMock).toHaveBeenCalledWith(setIsSending(false));

    consoleErrorSpy.mockRestore();
  });

  test('delete button is disabled when isSending is true', () => {
    (useAppSelector as unknown as jest.Mock).mockReturnValue(true); // Mock isSending as true

    render(<DeleteBudgetModal id={1} category="Shopping" />);

    // Open the modal
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Check if the delete button is disabled
    const confirmDeleteButton = screen.getByText('budgets.buttons.delete');
    expect(confirmDeleteButton).toBeDisabled();
  });
});
