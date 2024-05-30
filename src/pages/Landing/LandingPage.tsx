import { Link } from "react-router-dom";
import { Icon } from "@trussworks/react-uswds";
import budgetImg from "../../assets/budgets/Mar-Business_11.jpg";
import taxImg from "../../assets/taxes/Wavy_Tech-03_Single-12.jpg";
import transactionsImg from "../../assets/transactions/20943914.jpg";
import heroBg from "../../assets/hero.jpg";

const features = [
    {
        title: "Budgeting",
        description:
            "Take control of your finances with BudgetBuddy's effective budget management. Set spending limits for different categories and track your progress to stay on budget.",
        icon: Icon.Assessment,
        image: budgetImg
    },
    {
        title: "Stay On Top Of Your Spending",
        description:
            "Monitor your spending with BudgetBuddy's detailed transaction tracking. Easily view and categorize your expenses to gain insights into your financial habits to see where your money is going and how to improve",
        icon: Icon.Insights,
        image: transactionsImg
    },
    {
        title: "Tax Filing",
        description:
            "Simplify your tax season with BudgetBuddy's seamless tax filing. File your taxes directly within the app and ensure accuracy and compliance with ease.",
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
                            <span className="usa-hero__heading--alt">BudgetBuddy:</span>
                            Your Personal Finance Assistant
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-100">
                            BudgetBuddy helps you track spending, manage budgets, and achieve financial goals with ease. Make every dollar count with BudgetBuddy.
                        </p>
                        <div className="mt-10 flex justify-start">
                            <Link to="/dashboard" className="usa-button">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16">
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    {features.map((feature, index) => (
                        <div key={feature.title} className={`flex flex-col lg:flex-row items-center gap-x-8 mb-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
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
                                    <p className="text-xl leading-8 text-gray-600">{feature.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
