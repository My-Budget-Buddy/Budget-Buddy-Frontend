import { Outlet } from "react-router-dom";
import NavBar from "../components/navigation/LandingNavBar.tsx";
import LandingFooter from "../components/navigation/LandingFooter.tsx";
const LandingLayout: React.FC = () => {
    return (
        <div className="layout-container">
            <NavBar />
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
