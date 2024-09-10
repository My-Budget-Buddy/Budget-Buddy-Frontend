// src/hooks/useCreateRef.ts

import { useEffect, useRef } from "react";
import { setRef } from "./refStore"; // Adjust the import based on where your setRef function is located

const useStoreRef = (refName: string) => {
    const componentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (componentRef.current) {
            const rect = componentRef.current.getBoundingClientRect();
            // You can include additional logic here if needed, such as converting rect to WebGL coordinates
            console.log(rect);
            setRef(refName, componentRef);
        }
    }, [refName]); // refName as a dependency ensures effect re-runs if the name changes

    return componentRef;
};

export default useStoreRef;
