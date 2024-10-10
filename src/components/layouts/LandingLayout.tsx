import { Outlet } from "react-router-dom";
import NavBar from "../navigation/LandingNavBar.tsx";
import LandingFooter from "../navigation/LandingFooter.tsx";
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
