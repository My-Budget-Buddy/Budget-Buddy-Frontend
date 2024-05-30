
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ReviewSection.css';

const reviews = [
    {
        "id": 1,
        "author": "John Doe",
        "content": "BudgetBuddy is fantastic! It has completely transformed how I manage my finances.",
        "rating": 5,
        "date": "2024-01-01",
        "image": "https://via.placeholder.com/150"  // Placeholder image URL
    },
    {
        "id": 2,
        "author": "Jane Smith",
        "content": "The best budgeting app I've ever used. Highly recommend!",
        "rating": 5,
        "date": "2024-01-15",
        "image": "https://via.placeholder.com/150"  // Placeholder image URL
    },
    {
        "id": 3,
        "author": "Samuel Green",
        "content": "Simple, effective, and easy to use. BudgetBuddy is a game changer.",
        "rating": 4,
        "date": "2024-02-10",
        "image": "https://via.placeholder.com/150"  // Placeholder image URL
    },
    {
        "id": 4,
        "author": "Emily White",
        "content": "Excellent app for tracking expenses and managing budgets.",
        "rating": 5,
        "date": "2024-03-05",
        "image": "https://via.placeholder.com/150"  // Placeholder image URL
    },
    {
        "id": 5,
        "author": "Michael Brown",
        "content": "A must-have app for anyone serious about their finances.",
        "rating": 5,
        "date": "2024-04-20",
        "image": "https://via.placeholder.com/150"  // Placeholder image URL
    }
];

const ReviewSection = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 10000,
        centerMode: true,
        centerPadding: '0'
    };

    return (
        <section className="review-section py-16 bg-gray-200">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-8">What Our Users Are Saying</h2>
                <Slider {...settings}>
                    {reviews.map(review => (
                        <div key={review.id} className="px-4">
                            <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-between">
                                <div className="image-container mb-4">
                                    <img src={review.image} alt={`${review.author} profile`} className="w-16 h-16 rounded-full mx-auto" />
                                </div>
                                <p className="text-lg text-gray-700 mb-4">"{review.content}"</p>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">{review.author}</p>
                                    <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default ReviewSection;
