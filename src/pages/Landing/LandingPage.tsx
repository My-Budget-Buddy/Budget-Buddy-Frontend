import { Link } from "react-router-dom";
import { Icon } from "@trussworks/react-uswds";

const features = [
  {
    title: "Budgeting",
    description:
      "Take control of your finances with BudgetBuddy's effective budget management. Set spending limits for different categories and track your progress to stay on budget.",
    icon: Icon.Assessment,
  },
  {
    title: "Transactions",
    description:
      "Monitor your spending with BudgetBuddy's detailed transaction tracking. Easily view and categorize your expenses to gain insights into your financial habits",
    icon: Icon.Insights,
  },
  {
    title: "Tax Filing",
    description:
      "Simplify your tax season with BudgetBuddy's seamless tax filing. File your taxes directly within the app and esnure accuracy and compliance with ease.",
    icon: Icon.AttachMoney,
  },
];

export default function LandingPage() {
  return (
    <>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Welcome to, BudgetBuddy
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            BudgetBuddy helps you track spending, manage budgets, and achieve
            financial goals with ease. Make every dollar count with BudgetBuddy.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/login" className="usa-button">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold">Spend Smarter</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your Personal Guide to Smarter Spending
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon
                    className="h-5 w-5 flex-none text-[#005ea2]"
                    aria-hidden="true"
                  />
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}
