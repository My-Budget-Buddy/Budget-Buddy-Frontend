import { render, screen, fireEvent } from '@testing-library/react';
import W2EditView from '../pages/Tax/W2EditView';

describe('W2EditView', () => {
    it('renders step indicator with correct steps', () => {
        render(<W2EditView />);
        const steps = ['Personal Information', 'File W2s', 'Other Income', 'Deductions', 'Review and submit'];
        steps.forEach(step => {
            expect(screen.getByText(step)).toBeInTheDocument();
        });
    });

    it('initially renders PersonalInfoStep component', () => {
        render(<W2EditView />);
        expect(screen.getByText('Personal Information Content')).toBeInTheDocument();
    });

    it('navigates to next step on Next button click', () => {
        render(<W2EditView />);
        fireEvent.click(screen.getByText('Next'));
        expect(screen.getByText('File W2s Content')).toBeInTheDocument();
    });

    it('navigates to previous step on Prev button click', () => {
        render(<W2EditView />);
        fireEvent.click(screen.getByText('Next'));
        fireEvent.click(screen.getByText('Prev'));
        expect(screen.getByText('Personal Information Content')).toBeInTheDocument();
    });

    it('Next button is disabled on the last step', () => {
        render(<W2EditView />);
        for (let i = 0; i < 4; i++) {
            fireEvent.click(screen.getByText('Next'));
        }
        expect(screen.getByText('Next')).toBeDisabled();
    });

    it('Prev button is disabled on the first step', () => {
        render(<W2EditView />);
        expect(screen.getByText('Prev')).toBeDisabled();
    });
});