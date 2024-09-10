import React, { useRef, useEffect, useState, RefObject, useImperativeHandle } from 'react';
import { webGLMain } from './webgl';
import { getRef } from "./refStore";
import fxManager from './fxManager';

interface CanvasOverlayProps {
    name: string // For use by FXDirector
    wraps: RefObject<HTMLElement>; // the component to overlay
    effectType: string; // determine which WebGL effect to apply
}

const ConcreteCanvasOverlay: React.FC<CanvasOverlayProps> = (
    { name, wraps, effectType }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        // IMPORTANT! Component must register itself with the fxManager
        // in order to be controlled.
        // console.log("\n\n\n canvasRef: ", canvasRef)
        // fxManager.registerComponentCanvas(name, wraps?.current, canvasRef.current)

        const registerCanvas = () => {
            if (wraps.current && canvasRef.current) {
                fxManager.registerComponentCanvas(name, wraps.current, canvasRef.current);
                console.log("Canvas registered with fxManager:", canvasRef.current);
            } else {
                console.warn(`Cannot register canvas: wraps or canvas ref is not available.`);
            }
        };


        // Using requestAnimationFrame to ensure DOM readiness
        const rafId = requestAnimationFrame(registerCanvas);

        // Cleanup function
        return () => {
            cancelAnimationFrame(rafId);
            // Optionally, unregister the canvas if needed
            // fxManager.unregisterComponentCanvas(name);
        };

    }, [wraps.current]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                zIndex: 2,
                pointerEvents: 'none', // Allow interactions with underlying elements
            }}
        />
    );
};

export default ConcreteCanvasOverlay;
