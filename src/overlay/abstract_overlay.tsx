// src/components/CanvasOverlay.tsx

import React, { useRef, useEffect } from 'react';
import fxManager from './fxManager'; // Import the FxManager instance
import ConcreteCanvasOverlay from './concrete_overlay';

type CanvasOverlayProps = {
    refName?: string; // Optional ref name for component-specific overlays
    effectType: string; // Placeholder for effect type, can be used for different WebGL effects
};

const CanvasOverlay: React.FC<CanvasOverlayProps> = ({ refName, effectType }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Register the canvas with FxManager
        if (refName) {
            // Component-specific canvas
            const componentElement = document.querySelector(`[data-refname="${refName}"]`) as HTMLElement;
            if (componentElement) {
                fxManager.registerComponentCanvas(refName, componentElement);
            }
        } else {
            // Global canvas overlay
            fxManager.registerGlobalCanvas();
        }

        // Cleanup on component unmount
        return () => {
            fxManager.cleanup();
        };
    }, [refName, effectType]);

    switch (effectType) {
        case "highlighting":
            console.log("ASdf")
            break;
        case "radialBlocking":
            // Code for radial blocking effect
            break;
        case "shadowEffect":
            // Code for shadow effect
            break;
        default:
            // Code for any other cases or a fallback
            break;
    }

    // Render the canvas, using ref to attach it to the DOM
    return (
        // <canvas
        //     ref={canvasRef}
        //     style={{
        //         position: refName ? 'absolute' : 'fixed', // Adjust positioning based on type
        //         top: 0,
        //         left: 0,
        //         width: '100%',
        //         height: '100%',
        //         zIndex: 9999, // Ensure the canvas overlays appropriately
        //         pointerEvents: 'none', // Prevent blocking of user interactions
        //     }}
        // />

        <ConcreteCanvasOverlay ref={canvasRef} wraps={canvasRef} effectType={"highlighting"}>

        </ConcreteCanvasOverlay>
    );
};

export default CanvasOverlay;
