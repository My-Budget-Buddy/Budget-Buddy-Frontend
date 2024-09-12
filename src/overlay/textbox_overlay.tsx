import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import fxDirector from './fxDirector';
import { eventEmitter } from './event_emitter';

// Define props and exposed methods interface
type TextBoxOverlayProps = {
    position: { top: number; left: number }; // Position in viewport coordinates
    text: string; // Text to display in the overlay
    onClose?: () => void; // Optional callback to handle overlay close
};

export interface TextBoxOverlayHandle {
    updatePosition: (position: { top: number; left: number }) => void;
    updateText: (text: string) => void;
}

// Define the TextBoxOverlay component with forwardRef
const TextBoxOverlay = forwardRef<TextBoxOverlayHandle, TextBoxOverlayProps>(
    ({ position, text }, ref) => {
        const [internalPosition, setInternalPosition] = useState(position);
        const [internalText, setInternalText] = useState(text);
        // const [isVisible, setIsVisible] = useState(false);

        const componentRef = useRef<HTMLDivElement>(null);

        // Update internal state when props change
        useEffect(() => {
            setInternalPosition(position);
        }, [position]);

        useEffect(() => {
            setInternalText(text);
        }, [text]);

        // Expose methods to parent via ref
        useImperativeHandle(ref, () => ({
            updatePosition: (newPosition: { top: number; left: number }) => {
                setInternalPosition(newPosition);
            },
            updateText: (newText: string) => {
                setInternalText(newText);
            }
        }), []); // Empty dependency array ensures ref is updated once

        const onClick = () => {
            eventEmitter.emit('nextStep');
        }

        const onClose = () => {
            eventEmitter.emit('close');
            console.log("close")
        }

        return (
            <div
                ref={componentRef}
                style={{
                    position: 'absolute',
                    top: internalPosition.top,
                    left: internalPosition.left,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '5px',
                    borderRadius: '4px',
                    zIndex: 10000,
                    pointerEvents: 'auto', // Allow interactions if needed
                }}
            >
                {internalText}
                {/* {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            marginLeft: '5px',
                            background: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        X
                    </button>
                )} */}
                {onClick && (
                    <button
                        onClick={onClick}
                        style={{
                            marginLeft: '5px',
                            background: 'green',
                            color: 'black',
                            borderRadius: '4px',
                            // cursor: 'pointer',
                        }}
                    >
                        O
                    </button>
                )}
            </div>
        );
    }
);

export default TextBoxOverlay;
