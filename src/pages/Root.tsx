import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { setAuthenticated } from "../util/redux/authSlice";
import Cookies from "js-cookie";
import ProtoOverlay from "../overlay/proto_overlay";

const Root: React.FC = () => {
    //Check if authenticated
    const token = Cookies.get("jwt");
    const dispatch = useDispatch();

    //This is a very hacky solution to doing a network validation
    useEffect(() => {
        fetch("https://api.skillstorm-congo.com/auth/validate", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                return response.ok;
            })
            .then((isAuthenticated) => {
                dispatch(setAuthenticated(isAuthenticated));
            })
            .catch(() => {
                dispatch(setAuthenticated(false));
            });
    }, []);

    return (
        <>
            <ProtoOverlay />
            <Outlet />
        </>
    );
};

export default Root;
