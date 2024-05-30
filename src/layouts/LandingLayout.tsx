import { Outlet } from "react-router-dom";
import { AuthenticationProvider } from "../contexts/AuthenticationContext";
import LandingHeader from "../components/LandingHeader";
import LandingFooter from "../components/LandingFooter.tsx";

const LandingLayout: React.FC = () => {
    return (
        <AuthenticationProvider>
            <div className="layout-container">
                <LandingHeader />

                <main className="min-h-full w-full">
                    <div className="relative isolate ">
                        <Outlet />
                    </div>
                </main>
                {/*<FooterComponent/>*/}
                <LandingFooter />
            </div>
        </AuthenticationProvider>
    );
};

export default LandingLayout;
