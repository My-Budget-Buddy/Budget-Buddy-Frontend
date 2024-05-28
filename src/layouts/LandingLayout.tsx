import { Outlet } from "react-router-dom";
import { AuthenticationProvider } from "../contexts/AuthenticationContext";
import LandingHeader from "../components/LandingHeader";

const LandingLayout: React.FC = () => {
    return (
        <AuthenticationProvider>
            <div className="layout-container">
                <LandingHeader />

                <main className="min-h-full w-full">
                    <div className="relative isolate px-6 pt-14 lg:px-8">
                        <Outlet />
                    </div>
                </main>
                {/*<FooterComponent/>*/}
            </div>
        </AuthenticationProvider>
    );
};

export default LandingLayout;
