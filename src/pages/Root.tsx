import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { setAuthenticated } from "../util/redux/authSlice";
import Cookies from "js-cookie";
import ProtoOverlay from "../overlay/proto_overlay";
import { setRef } from "../overlay/refStore";

const Root: React.FC = () => {

    const componentRef = useRef<HTMLDivElement>(this);

    useEffect(() => {
        if (componentRef.current) {
            const rect = componentRef.current.getBoundingClientRect();
            // Convert rect.left, rect.top, rect.width, rect.height to WebGL coordinates
            console.log(rect)
            setRef('RootComponent', componentRef);
        }
        console.log(componentRef)
    }, []);


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
        <div ref={componentRef}>
            <ProtoOverlay />
            <Outlet />
        </div>
    );
};

export default Root;
