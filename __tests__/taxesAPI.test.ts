import "@testing-library/jest-dom";
import { createTaxReturn } from "../src/pages/Tax/taxesAPI";
import apiClient from "../src/pages/Tax/index";

// import.meta isn't in the right format, mocking so it stops throwing errors
jest.mock("../src/api/config", () => ({
    // Mock the API endpoint
    config: {
        // Whatever works I think
        apiUrl: "http://localhost:1234"
    }
}));

// Mock the apiClient.post method
jest.mock("../src/pages/Tax/index", () => {
    // Mock index (contains apiClient)
    const originalModule = jest.requireActual("../src/pages/Tax/index"); // Need to import the original module
    return {
        // Return the factory content
        __esModule: true, // Fix errors with esModule
        ...originalModule, // Spread the properties of the original module (apiClient) to the new module
        default: {
            // Selectively mocking POST method
            ...originalModule.default, // Again, spread original module properties
            post: jest.fn() // Overrides POST with jest mock
        }
    };
});

describe("createTaxReturn", () => {
    it("should call apiClient.post with the correct arguments", async () => {
        const initTaxReturn = {
            // year, userId
            year: 2024,
            userId: 1
        };

        await createTaxReturn(initTaxReturn);
        // Check if the POST method was called with the correct arguments
        expect(apiClient.post).toHaveBeenCalledWith("/taxes/taxreturns", initTaxReturn);
    });
});
