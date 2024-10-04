import React from 'react';
import { render, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaxResults from '../src/pages/Tax/TaxResults';
import Cookies from 'js-cookie';

// Mock the js-cookie library
jest.mock('js-cookie', () => ({
  get: jest.fn()
}));

// Mock the react-confetti library
jest.mock('react-confetti', () => ({
  __esModule: true,
  default: ({ numberOfPieces }: { numberOfPieces: 200 }) => <div data-testid="confetti" data-number-of-pieces={numberOfPieces} />
}));

// Mock the taxesAPI module
jest.mock('../src/pages/Tax/taxesAPI', () => ({
  getCurrentRefundAPI: jest.fn().mockResolvedValue({ data: { federalRefund: 1253, stateRefund: 283 } })
}));

// Mock HTMLCanvasElement.prototype.getContext
HTMLCanvasElement.prototype.getContext = jest.fn();

describe('TaxResults', () => {
  beforeEach(() => {
    // Mock the JWT cookie
    (Cookies.get as jest.Mock).mockReturnValue('mocked-jwt-token');
  });

  it('should fetch and display tax refund data when API call is successful', async () => {
    await act(async () => {
      render(<TaxResults />);
    });

    const fedRefund = screen.getByText('$1,253.00');
    const stRefund = screen.getByText('$283.00');
    const totRefund = screen.getByText('$1,536.00');

    await waitFor(() => expect(fedRefund).toBeInTheDocument());
    expect(stRefund).toBeInTheDocument();
    expect(totRefund).toBeInTheDocument();
  });



  it('should render confetti with the correct number of pieces', async () => {
    await act(async () => {
      render(<TaxResults />);
    });

    const confetti = await screen.findByTestId('confetti');
    expect(confetti).toHaveAttribute('data-number-of-pieces', '200'); // Assuming 200 is the number of pieces you expect
  });
});


