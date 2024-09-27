import React from 'react';
import { render } from '@testing-library/react';
import TaxEditView from '../src/pages/Tax/TaxEditView';
import '@testing-library/jest-dom';

jest.mock("../src/api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

jest.mock('../src/pages/Tax/W2EditView', () => ({
    __esModule: true,
    default: jest.fn(() => <div>W2 Edit View</div>)
}))

describe('TaxEditView', () => {
    it('should render W2EditView component', () => {
        const { getByText } = render(<TaxEditView />);
        expect(getByText('W2 Edit View')).toBeInTheDocument();
    });
});