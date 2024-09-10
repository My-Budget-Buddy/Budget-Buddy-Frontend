import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { setAuthenticated } from "../util/redux/authSlice";
import Cookies from "js-cookie";
import { setRef } from "../overlay/refStore";
import fxManager from "../overlay/fxManager";
import ConcreteCanvasOverlay from "../overlay/concrete_overlay";
import TextBoxOverlay, { TextBoxOverlayHandle } from "../overlay/textbox_overlay";
import fxDirector from "../overlay/fxDirector";

const Root: React.FC = () => {

    const componentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (componentRef.current) {
            const rect = componentRef.current.getBoundingClientRect();
            // Convert rect.left, rect.top, rect.width, rect.height to WebGL coordinates
            console.log(rect)
            setRef('RootComponent', componentRef);
        }
        console.log(componentRef)

        setTimeout(() => {
            fxDirector.startTutorial()
        }, 1000);
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

    const f = fxManager.getCanvases()
    console.log("fxManager: ", f)

    const textBoxRef = useRef<TextBoxOverlayHandle>(null);

    // const handleUpdate = () => {
    //     if (textBoxRef.current) {
    //         textBoxRef.current.updatePosition({ top: 1000, left: 1000 });
    //         textBoxRef.current.updateText('Updated text');
    //     }
    // };


    useEffect(() => {
        const c = textBoxRef.current
        console.log("Textbox: ", c)

        fxDirector.registerAvatarTooltip(c)

    }, [])


    return (
        <div ref={componentRef}>
            <Outlet />
            {/* <CanvasOverlay effectType="highlighting" /> */}
            <ConcreteCanvasOverlay name="GLOBAL" effectType="GLOBAL" wraps={componentRef} />

            <TextBoxOverlay
                position={{ top: 100, left: 100 }}
                text={"My text"}
                onClose={() => { }}
                ref={textBoxRef}
            />

        </div>
    );
};

export default Root;
