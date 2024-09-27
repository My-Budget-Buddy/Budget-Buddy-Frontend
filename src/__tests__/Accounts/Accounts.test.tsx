import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Accounts from "../../pages/Accounts/Accounts";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';



//Mocks api request
jest.mock("../../api/config", () => ({
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


const mockStore = configureStore([]);
const store = mockStore({
    simpleFormStatus: { isSending: false },
    budgets: {
        monthYear: '2024-9',
        selectedMonthString: 'September',
        selectedYear: 2024,
        budgets: [],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    },
});


test("renders Accounts page without crashing", () => {
    render(
        <Provider store={store}>
            <Accounts />
        </Provider>
    );
});