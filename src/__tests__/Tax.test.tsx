import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tax from '../pages/Tax/Tax';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../util/redux/store';

jest.mock("../api/config", () => ({
    config: {
      apiUrl: "http://localhost:mock",
    },
  }));

  // Mock the useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  }));

describe('Tax Component', () => {
    it('should render without crashing', () => {
        const { container } = render(
            <Provider store={store}>
                <BrowserRouter>
                    <Tax />
                </BrowserRouter>
            </Provider>
        );
        expect(container).toBeInTheDocument();
    });
       
   
});