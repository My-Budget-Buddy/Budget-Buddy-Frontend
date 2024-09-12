import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";

let squareRotation = 0.0;
// let deltaTime = 0;

export function webGLMain(canvas, todoVars) {
    // console.log("RENDERING: ", todoVars);

    // const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext("webgl2");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;
        void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vColor = aVertexColor;
        }
    `;

    const fsSource = `
        precision mediump float; // Set default precision for floats

        varying lowp vec4 vColor;

        uniform vec2 uViewportSize; // Viewport size uniform
        uniform vec2 uMouseCoords; 
        uniform float uLightness; 
        uniform vec2 uRadialPos; 
        uniform bool uRadialEnabled; 
        uniform bool uHighlightEnabled; 
        uniform float uRadialRadius; 

        void main(void) {
            if (uRadialEnabled) {
                vec2 fragCoordNormalized = (gl_FragCoord.xy) / uViewportSize; // Normalize coordinates
                    // gl_FragColor = vec4(fragCoordNormalized, 1.0, 0.6); // Example: color based on normalized coordinates
                    
                    // Convert mouse coordinates to normalized space
                    // vec2 coordsNormalized = uRadialPos / uViewportSize;
                    vec2 mouseCoordsNormalized = uMouseCoords / uViewportSize;

                    // Calculate the distance from the current fragment to the mouse coordinates
                    float distanceToPoint = distance(gl_FragCoord.xy, uRadialPos) / uViewportSize.y;

                    // Check if the distance is less than the radius (normalized to viewport size)
                    if (distanceToPoint < (uRadialRadius / uViewportSize.y)) {
                        // Inside the circle
                        gl_FragColor = vec4(1.0, 1.0, 1.0, 0.); // White color
                    } else {
                        // Outside the circle
                        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.7); // Black color
                    }

                    // gl_FragColor.r = distance(gl_FragCoord.xy, uRadialPos) / uViewportSize.y;
            }
            else if (uHighlightEnabled){
                gl_FragColor.rgb = vec3(0.5);
            }
            
        }
    `;

    // console.log(todoVars);

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Collect all the info needed to use the shader program.
    // Look up which attributes our shader program is using
    // for aVertexPosition, aVertexColor and also
    // look up uniform locations.
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor")
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            viewportSize: gl.getUniformLocation(shaderProgram, "uViewportSize"),
            lightness: gl.getUniformLocation(shaderProgram, "uLightness"),
            mouseCoords: gl.getUniformLocation(shaderProgram, "uMouseCoords"),
            range: gl.getUniformLocation(shaderProgram, "uRange"),
            radialEnabled: gl.getUniformLocation(shaderProgram, "uRadialEnabled"),
            radialPosition: gl.getUniformLocation(shaderProgram, "uRadialPos"),
            radialRadius: gl.getUniformLocation(shaderProgram, "uRadialRadius")
        }
    };

    const buffers = initBuffers(gl);
    drawScene(gl, programInfo, buffers, squareRotation, canvas, todoVars);

    // Draw the scene repeatedly
    // This is essentially the control layer
    // function render(now) {
    //     now *= 0.001; // convert to seconds
    //     deltaTime = now - then;
    //     then = now;

    //     drawScene(gl, programInfo, buffers, squareRotation);
    //     squareRotation += deltaTime;

    //     requestAnimationFrame(render);
    // }
    // requestAnimationFrame(render);
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
        return null;
    }

    return shaderProgram;
}

// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
