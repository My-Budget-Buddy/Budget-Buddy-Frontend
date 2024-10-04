import { Link } from "react-router-dom";
import { Icon } from "@trussworks/react-uswds";
import budgetImg from "/images/budgeting-illustration.jpg";
import taxImg from "/images/tax-illustration.jpg";
import transactionsImg from "/images/spending-illustration.jpg";
import heroBg from "/images/hero.jpg";
import "./LandingPage.css";
import ReviewSection from "./ReviewSection.tsx";

const features = [
    {
        title: "Budgeting",
        description: `
            <ul class="feature-list">
                <li><b>Effective Budget Management:</b> Take control of your finances with BudgetBuddy's robust budget management tools.</li>
                <li><b>Spending Limits:</b> Set spending limits for different categories to ensure you stay on track.</li>
                <li><b>Progress Tracking:</b> Monitor your budget performance and adjust as needed to meet your financial goals.</li>
                <li><b>Comprehensive Insights:</b> Gain a holistic view of your spending habits and make informed decisions.</li>
                <li><b>User-Friendly Interface:</b> Enjoy a seamless and intuitive budgeting experience with our easy-to-use tools.</li>
            </ul>
        `,
        icon: Icon.Assessment,
        image: budgetImg
    },
    {
        title: "Stay On Top Of Your Spending",
        description: `
            <ul class="feature-list">
                <li><b>Detailed Monitoring:</b> Effortlessly track and categorize your expenses.</li>
                <li><b>Insightful Visualization:</b> Use interactive charts and tables to visualize your spending patterns over time.</li>
                <li><b>Vendor Tracking:</b> Identify your top vendors and see where most of your money is going.</li>
                <li><b>Spending Categories:</b> Pinpoint your highest spending categories and discover areas for improvement.</li>
                <li><b>User-Friendly Interface:</b> Enjoy a simple, visually intuitive, and engaging way to manage your finances.</li>
            </ul>
        `,
        icon: Icon.Insights,
        image: transactionsImg
    },
    {
        title: "Tax Filing",
        description: `
            <ul class="feature-list">
                <li><b>Seamless Tax Filing:</b> File your taxes directly within the BudgetBuddy app.</li>
                <li><b>Income Documentation:</b> Easily add W-2 and 1099 forms to document your income.</li>
                <li><b>Accurate Calculations:</b> The app calculates your refund or tax due with precision.</li>
                <li><b>User-Friendly Interface:</b> Navigate through the tax filing process with ease and confidence.</li>
                <li><b>Compliance and Accuracy:</b> Ensure your tax filings are compliant with the latest regulations and accurate.</li>
            </ul>
        `,
        icon: Icon.AttachMoney,
        image: taxImg
    }
];


export default function LandingPage() {
    return (
        <>
            <section className="usa-hero custom-hero" aria-label="Introduction">
                <div className="relative w-full h-screen flex items-center">
                    <div className="absolute inset-0">
                        <img src={heroBg} alt="Hero" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                    </div>
                    <div className="relative usa-hero__callout max-w-2xl p-8 mx-6 lg:mx-8 bg-opacity-80 backdrop-blur-sm rounded-lg shadow-lg text-left">
                        <h1 className="usa-hero__heading text-4xl font-bold tracking-tight text-accent-cool sm:text-6xl">
                            <span className="usa-hero__heading--alt">BudgetBuddy:</span> Your Personal Finance Assistant
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-100">
                            BudgetBuddy helps you track spending, manage budgets, and achieve financial goals with ease. Make every dollar count with BudgetBuddy.
                        </p>
                        <div className="mt-10 flex justify-start">
                            <Link to="/dashboard" className="usa-button" id="btnGetStarted">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16">
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className={`flex flex-col lg:flex-row items-center gap-x-8 mb-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            {feature.image && (
                                <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
                                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover rounded-lg" />
                                </div>
                            )}
                            <div className="w-full lg:w-1/2">
                                <div className="flex items-center gap-x-4 mb-4 lg:mb-0">
                                    <feature.icon className="h-16 w-16 text-[#005ea2]" style={{ fontSize: 40 }} aria-hidden="true" />
                                    <h2 className="text-4xl font-semibold leading-8 text-gray-900">{feature.title}</h2>
                                </div>
                                <div className="mt-4">
                                    <div id="feature-text" className="text-xl leading-8 text-gray-600" dangerouslySetInnerHTML={{ __html: feature.description }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ReviewSection />

        </>
    );
}
