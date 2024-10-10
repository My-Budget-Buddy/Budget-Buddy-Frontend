import NavBar from "../navigation/AppNavSidebar";
import { Outlet } from "react-router-dom";
import { AuthenticationProvider } from "../../contexts/AuthenticationContext";

const AppLayout: React.FC = () => {
    return (
        <AuthenticationProvider>
            <div className="layout-container flex">
                <NavBar />
                <main className="main-content px-14 w-full h-screen overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </AuthenticationProvider>
    );
};

export default AppLayout;
