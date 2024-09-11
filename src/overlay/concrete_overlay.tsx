import React, { useRef, useEffect, useState, RefObject, useImperativeHandle, forwardRef } from 'react';
import { webGLMain } from './webgl';
import { getRef } from "./refStore";
import fxManager from './fxManager';

interface CanvasOverlayProps {
    name: string // For use by FXDirector
    wraps: RefObject<HTMLElement>; // the component to overlay
    effectType: string; // determine which WebGL effect to apply
}

const ConcreteCanvasOverlay = forwardRef<any, CanvasOverlayProps>(
    ({ name, wraps, effectType }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        // const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
        const [enabled, setEnabled] = useState(false);

        const [mouseCoords, setMousePosition] = useState({ x: 0, y: 0 });


        const updateEnabled = (value: boolean) => {
            setEnabled(value);
        };

        useEffect(() => {
            // IMPORTANT! Component must register itself with the fxManager
            // in order to be controlled.
            const registerAndUpdate = () => {
                if (wraps.current && canvasRef.current) {
                    updateCanvasSizeAndPosition();
                    // Register with fxManager using the imperative handle
                    fxManager.registerComponentCanvas(name, wraps.current, canvasRef.current, {
                        updateEnabled,
                        getEnabled: () => enabled,
                        setMouseCoords: (coords: { x: number; y: number }) => {
                            setMousePosition(coords);
                        },
                        getMouseCoords: () => mouseCoords,
                    });
                }
            };

            // Mouse move handler to update mouse position state
            const handleMouseMove = (event: MouseEvent) => {
                setMousePosition({ x: event.clientX, y: event.clientY });
                // Optional: You can call webGLMain here if needed
                // webGLMain(canvas, { ref, mousePosition: { x: event.clientX, y: event.clientY } });
            };

            window.addEventListener('mousemove', handleMouseMove);

            // Delay registration to ensure DOM readiness
            const rafId = requestAnimationFrame(registerAndUpdate);

            window.addEventListener('resize', updateCanvasSizeAndPosition);

            // console.log("Asdf")
            return () => {
                cancelAnimationFrame(rafId);
                window.removeEventListener('resize', updateCanvasSizeAndPosition);
                // unregister the canvas if needed
                // fxManager.unregisterComponentCanvas(name);
            };
        }, [wraps.current]);


        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ref = wraps.current;

            updateCanvasSizeAndPosition();

            webGLMain(canvas, { ref, mouseCoords });
        }, [mouseCoords]); // Re-run when mousePosition updates

        useImperativeHandle(ref, () => ({
            // Expose state and functions to manipulate them
            updateEnabled: (value: boolean) => {
                setEnabled(value);
            },
            getEnabled: () => enabled, // Optional: to get the current state of 'enabled'
        }));

        const updateCanvasSizeAndPosition = () => {
            if (wraps.current && canvasRef.current) {
                const rect = wraps.current.getBoundingClientRect();
                const canvas = canvasRef.current;

                // Update canvas dimensions and position to match the wrapped element
                canvas.style.width = `${rect.width}px`;
                canvas.style.height = `${rect.height}px`;
                canvas.style.top = `${rect.top}px`;
                canvas.style.left = `${rect.left}px`;
                canvas.width = rect.width; // Set canvas internal resolution
                canvas.height = rect.height;

                // console.log("Canvas updated to match wraps:", rect);
            }
        };

        return (
            <canvas hidden={!enabled}
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    zIndex: 2,
                    pointerEvents: 'none', // Allow interactions with underlying elements
                }}
            />
        );
    });

export default ConcreteCanvasOverlay;
