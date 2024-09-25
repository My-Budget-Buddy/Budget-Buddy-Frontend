import React from 'react';
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import ErrorPage from "../pages/Misc/ErrorPage";
import LandingPage from "../pages/Landing/LandingPage";

// Mock the useRouteError hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useRouteError: () => ({
        status: 404,
        statusText: 'Not Found',
        message: 'Page not found'
    })
}));

jest.mock("../api/config", () => ({
    config: {
        apiUrl: "http://localhost:mock",
    },
}));

beforeEach(() => {
    render(
        <MemoryRouter initialEntries={['/error']}>
            <Routes>
                <Route path="/error" element={<ErrorPage />} />
                <Route path="/" element={<LandingPage />} />
            </Routes>
        </MemoryRouter>
    );
});

afterEach(() => {
    jest.clearAllMocks();
});

it('renders without crashing', () => {
    expect(screen.getByText('Page not found')).toBeInTheDocument();
});

it('contains a link to return to the homepage', () => {
    expect(screen.getByText('Return to homepage')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to homepage' })).toHaveAttribute('href', '/');
});

it('contains a link to start a live chat', () => {
    expect(screen.getByText('Start a live chat with us')).toBeInTheDocument();
});

it('contains a link to call the support number', () => {
    expect(screen.getByText('(555) 555-GOVT')).toBeInTheDocument();
});

it('redirects to the landing page when "Return to homepage" is clicked', () => {
    const returnLink = screen.getByRole('link', { name: 'Return to homepage' });
    fireEvent.click(returnLink);
    expect(screen.getByText('Landing Page')).toBeInTheDocument();
});