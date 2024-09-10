// src/components/CanvasOverlay.tsx]

// TODO- Abstract this component out. Multiple canvases will exist for each effect- one for highlighting, one for the radial blocking, etc. 

import React, { useRef, useEffect, useState } from 'react';
import { webGLMain } from './webgl';
import { getRef } from "./refStore";

const ProtoOverlay: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mouseCoords, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.id = "glcanvas";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // const ref = getRef("RootComponent");

        // Mouse move handler to update mouse position state
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
            // Optional: You can call webGLMain here if needed
            // webGLMain(canvas, { ref, mousePosition: { x: event.clientX, y: event.clientY } });
        };

        // Add event listener
        // TODO Porbably move this into draw_scene
        window.addEventListener('mousemove', handleMouseMove);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ref = getRef("RootComponent");

        // Call webGLMain with the mouse position
        webGLMain(canvas, { ref, mouseCoords });
    }, [mouseCoords]); // Re-run when mousePosition updates


    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 2,
            }}
        />
    );
};

export default ProtoOverlay;
