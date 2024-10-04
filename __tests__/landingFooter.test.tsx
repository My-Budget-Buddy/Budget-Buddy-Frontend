import { screen, render, waitFor } from "@testing-library/react";
import LandingFooter from "../src/components/navigation/LandingFooter";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

beforeEach(() => {
    render(
        <MemoryRouter>
            <LandingFooter />
        </MemoryRouter>
    );
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("LandingFooter", () => {
    it("renders the footer button", async () => {
        await waitFor(() => {
            const footerButton = document.getElementById("return-to-top-button");
            expect(footerButton).toBeInTheDocument();
            expect(footerButton).toHaveAttribute("href", "#");
        });
    });

    it("renders the footer navigation links", async () => {
        await waitFor(() => {
            expect(document.getElementById("about-us-link")).toBeInTheDocument();
            expect(document.getElementById("services-link")).toBeInTheDocument();
            expect(document.getElementById("contact-link")).toBeInTheDocument();
            expect(document.getElementById("support-link")).toBeInTheDocument();
        });
    });

    it("renders the contact information", async () => {
        await waitFor(() => {
            const phoneNumber = document.getElementById("phone-attachment");
            expect(phoneNumber).toHaveAttribute("href", "tel:1-800-555-5555");
            const email = document.getElementById("email-attachment");
            expect(email).toBeInTheDocument();
            expect(email).toHaveAttribute("href", "mailto:info@budgetbuddy.com");
        });
    });

    it("renders the footer logo", async () => {
        await waitFor(() => {
            const footerLogo = screen.getByTestId("footer-logo");
            expect(footerLogo).toBeInTheDocument();
            expect(footerLogo).toHaveAttribute("src", "test-image-stub");
        });
    });

    it("renders the BudgetBuddy heading", async () => {
        await waitFor(() => {
            expect(screen.getByText("BudgetBuddy")).toBeInTheDocument();
        });
    });
});