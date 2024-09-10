import React, { useRef, useEffect, useState, RefObject } from 'react';
import { webGLMain } from './webgl';
import { getRef } from "./refStore";

interface CanvasOverlayProps {
    wraps: RefObject<HTMLElement>; // the component to overlay
    effectType: string; // determine which WebGL effect to apply
}

const CanvasOverlay: React.FC<CanvasOverlayProps> = ({ wraps, effectType }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const targetElement = wraps.current;
        if (!canvas || !targetElement) return;

        const updateCanvasSize = () => {
            const rect = targetElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            canvas.style.top = `${rect.top}px`;
            canvas.style.left = `${rect.left}px`;
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        const handleMouseMove = (event: MouseEvent) => {
            setMouseCoords({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, [wraps]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ref = getRef("RootComponent");

        webGLMain(canvas, { ref, mouseCoords, effectType });
    }, [mouseCoords, effectType]); // Re-run when mouseCoords or effectType updates

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

export default CanvasOverlay;
