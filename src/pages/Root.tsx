import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { setAuthenticated } from "../utils/redux/authSlice";
import Cookies from "js-cookie";

import { URL_validateJwt } from "../api/services/AuthService";

const Root: React.FC = () => {
    //Check if authenticated
    const token = Cookies.get("jwt");
    const dispatch = useDispatch();

    //This is a very hacky solution to doing a network validation
    useEffect(() => {
        fetch(URL_validateJwt, {
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
            <Outlet />
        </>
    );
};

export default Root;
