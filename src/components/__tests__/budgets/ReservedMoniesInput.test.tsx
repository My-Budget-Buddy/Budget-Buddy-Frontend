import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ReservedMoniesInput from '../../budgets/ReservedMoniesInput';

jest.mock('@trussworks/react-uswds', () => ({
    ...jest.requireActual('@trussworks/react-uswds'),
    Icon: {
        Add: () => <span data-testid="icon-add">Add Icon</span>,
        Remove: () => <span data-testid="icon-remove">Remove Icon</span>,
    }
}));

describe('ReservedMoniesInput', () => {

    it('should render the ReservedMoniesInput component and call onChange function', () => {
        const mockOnChange = jest.fn();
        const mockProps = {
            max: 1000,
            amount: 500, 
            disabled: false,
            onChange: mockOnChange
        }

        render(<ReservedMoniesInput {...mockProps} />);

        expect(screen.getByDisplayValue('500')).toBeInTheDocument();
        expect(mockOnChange).toHaveBeenCalledWith(500);
    });

    it('should input element should call onChange when new value is inserted', async () => {
        const mockOnChange = jest.fn();
        const mockProps = {
            max: 1000,
            amount: 500, 
            disabled: false,
            onChange: mockOnChange
        }

        render(<ReservedMoniesInput {...mockProps} />);
        
        const inputElement = screen.getByDisplayValue('500');
        expect(inputElement).toBeInTheDocument();
        
        await waitFor(() => {
            fireEvent.change(inputElement, { target: { value: '600' } });
            expect(screen.getByDisplayValue('600')).toBeInTheDocument();
            expect(mockOnChange).toHaveBeenCalledWith(600);
        });
    });

    it('should increment value by 100', async() => {
        const user = userEvent.setup()
        const mockOnChange = jest.fn();
        const mockProps = {
            max: 1000,
            amount: 500, 
            disabled: false,
            onChange: mockOnChange
        }

        render(<ReservedMoniesInput {...mockProps} />);

        await user.click(screen.getByTestId('icon-add'));

        expect(mockOnChange).toHaveBeenCalledWith(600);
    });

    it('should increment value to max when Add icon clicked', async() => {
        const user = userEvent.setup()
        const mockOnChange = jest.fn();
        const mockProps = {
            max: 1000,
            amount: 950, 
            disabled: false,
            onChange: mockOnChange
        }

        render(<ReservedMoniesInput {...mockProps} />);

        await user.click(screen.getByTestId('icon-add'));

        expect(mockOnChange).toHaveBeenCalledWith(1000);
    });

    it('should decrement value by 100', async() => {
        const user = userEvent.setup()
        const mockOnChange = jest.fn();
        const mockProps = {
            max: 1000,
            amount: 500, 
            disabled: false,
            onChange: mockOnChange
        }

        render(<ReservedMoniesInput {...mockProps} />);

        await user.click(screen.getByTestId('icon-remove'));

        expect(mockOnChange).toHaveBeenCalledWith(400);
    });

    it('should decrement value to max when Remove icon clicked', async() => {
        const user = userEvent.setup()
        const mockOnChange = jest.fn();
        const mockProps = {
            max: 1000,
            amount: 50, 
            disabled: false,
            onChange: mockOnChange
        }

        render(<ReservedMoniesInput {...mockProps} />);

        await user.click(screen.getByTestId('icon-remove'));

        expect(mockOnChange).toHaveBeenCalledWith(50);
    });
});