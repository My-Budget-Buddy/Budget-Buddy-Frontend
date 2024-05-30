import { Outlet } from "react-router-dom";
import LandingHeader from "../components/LandingHeader";
import LandingFooter from "../components/LandingFooter.tsx";
import { useEffect } from "react";
import { useAuthentication } from "../contexts/AuthenticationContext.tsx";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../util/redux/authSlice.ts";

const LandingLayout: React.FC = () => {
    //Check if authenticated
    const { jwt } = useAuthentication();
    const dispatch = useDispatch();
    useEffect(() => {
        if (jwt) {
            fetch("https://api.skillstorm-congo.com/auth/validate", {
                headers: { Authorization: `Bearer ${jwt}` }
            })
                .then((response) => {
                    return response.ok;
                })
                .then((isAuthenticated) => {
                    dispatch(setAuthenticated(isAuthenticated));
                });
        } else {
            dispatch(setAuthenticated(false));
        }
    }, [jwt]);

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
