import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewSection from '../src/pages/Landing/ReviewSection';

// Mock the Slider component from 'react-slick'
// jest.mock('react-slick', () => {
//     return ({ children }) => <div>{children}</div>;
// });

describe('ReviewSection', () => {
    beforeEach(() => {
        render(<ReviewSection />);
    });

    it('renders the section title', () => {
        expect(screen.getByText('What Our Users Are Saying')).toBeInTheDocument();
    });

    it('renders all reviews with correct content', () => {
        const reviews = [
            {
                id: 1,
                author: 'John Doe',
                content: 'BudgetBuddy is fantastic! It has completely transformed how I manage my finances.',
                date: '2024-01-01',
                image: 'https://via.placeholder.com/150'
            },
            {
                id: 2,
                author: 'Jane Smith',
                content: "The best budgeting app I've ever used. Highly recommend!",
                date: '2024-01-15',
                image: 'https://via.placeholder.com/150'
            },
            {
                id: 3,
                author: 'Samuel Green',
                content: 'Simple, effective, and easy to use. BudgetBuddy is a game changer.',
                date: '2024-02-10',
                image: 'https://via.placeholder.com/150'
            },
            {
                id: 4,
                author: 'Emily White',
                content: 'Excellent app for tracking expenses and managing budgets.',
                date: '2024-03-05',
                image: 'https://via.placeholder.com/150'
            },
            {
                id: 5,
                author: 'Michael Brown',
                content: 'A must-have app for anyone serious about their finances.',
                date: '2024-04-20',
                image: 'https://via.placeholder.com/150'
            }
        ];

        reviews.forEach(review => {
            // Check if the review content is rendered
            expect(screen.getAllByText(`"${review.content}"`).length).toBeGreaterThan(0);

            // Check if the author name is rendered
            expect(screen.getAllByText(review.author).length).toBeGreaterThan(0);

            // Check if the date is rendered correctly
            const formattedDate = new Date(review.date).toLocaleDateString();
            expect(screen.getAllByText(formattedDate).length).toBeGreaterThan(0);

            // Check if the image is rendered with correct src
            const imgElements = screen.getAllByAltText(`${review.author} profile`);
            expect(imgElements.some(img => img.getAttribute('src') === review.image)).toBe(true);
        });
    });
});