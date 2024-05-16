import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <section className="flex justify-center items-center min-h-screen">
      <div className="flex-col">
        <h1 className="font-bold text-7xl mb-4">Welcome to BudgetBuddy</h1>
        <p className="text-center text-xl">
          Your ultimate tool to visualize spending habits and manage your budget
          effectively.
        </p>

        <div className="flex justify-center">
          <Link to="/login" className="usa-button mt-4">
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
