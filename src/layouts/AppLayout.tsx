import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";

const AppLayout: React.FC = () => {
    return (
        <div className="layout-container flex">
            <NavBar />
            <main className="main-content px-14 w-full h-screen overflow-y-scroll">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
