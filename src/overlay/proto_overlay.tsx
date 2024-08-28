// src/components/CanvasOverlay.tsx
import React, { useRef, useEffect } from 'react';
import { webGLMain } from './webgl';

const ProtoOverlay: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // const context = canvas.getContext('2d');
        // if (!context) return;

        canvas.id = "glcanvas"
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        // context.fillRect(0, 0, canvas.width, canvas.height);

        // context.font = '48px sans-serif';
        // context.fillStyle = 'white';
        // context.textAlign = 'center';
        // context.textBaseline = 'middle';
        // context.fillText('Overlay Text', canvas.width / 2, canvas.height / 2);

        webGLMain(canvas)
    }, []);


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
