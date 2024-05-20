import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const AppLayout: React.FC = () => {
  return (
    <div className="layout-container flex">
      <NavBar />
      <main className="main-content px-14">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
