import { Outlet } from "react-router-dom";
import LandingHeader from "../components/LandingHeader";
import LandingFooter from "../components/LandingFooter.tsx";
const LandingLayout: React.FC = () => {
    return (
        <div className="layout-container">
            <LandingHeader />
            <main className="min-h-dvh l w-full ">
                <div className="relative isolate ">
                    <Outlet />
                </div>
            </main>
            {/*<FooterComponent/>*/}
            <LandingFooter />
        </div>
    );
};

export default LandingLayout;
