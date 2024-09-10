// Checks the current page, and plays the tutorials if tutorialRun == true

let tutorialRun = true;

type CanvasInfo = {
    canvas: HTMLCanvasElement;
    type: "global" | "component";
    refName?: string;
};

class fxManager {
    private canvases: Map<string, CanvasInfo> = new Map();

    constructor() {
        // pass
    }

    private createCanvas(id: string): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        canvas.id = id;
        canvas.style.position = "absolute";
        canvas.style.pointerEvents = "none"; // Prevent blocking interactions
        document.body.appendChild(canvas);
        return canvas;
    }

    registerGlobalCanvas(canvas: HTMLCanvasElement) {
        // const canvas = this.createCanvas("globalCanvas");
        // canvas.style.position = "fixed";
        // canvas.style.top = "0";
        // canvas.style.left = "0";
        // canvas.style.width = "100%";
        // canvas.style.height = "100%";
        // canvas.style.zIndex = "9999"; // Uhhhh...
        this.canvases.set("global", { canvas, type: "global" });
        // this.initializeWebGL(canvas);
    }

    registerComponentCanvas(refName: string, ref: HTMLElement, canvas: HTMLCanvasElement) {
        // const canvas = this.createCanvas(`canvas-${refName}`);
        this.canvases.set(refName, { canvas, type: "component", refName });
        // this.updateCanvasPosition(canvas, ref);
        // this.initializeWebGL(canvas);

        window.addEventListener("resize", () => this.updateCanvasPosition(canvas, ref));
    }

    private updateCanvasPosition(canvas: HTMLCanvasElement, ref: HTMLElement) {
        const rect = ref.getBoundingClientRect();
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        canvas.style.top = `${rect.top}px`;
        canvas.style.left = `${rect.left}px`;
        canvas.style.zIndex = "2"; // Ensure it's above the component but below global canvas
    }

    private initializeWebGL(canvas: HTMLCanvasElement) {
        console.log(`Initializing WebGL on canvas with ID: ${canvas.id}`);
    }

    cleanup() {
        this.canvases.forEach(({ canvas }) => {
            canvas.remove();
        });
        this.canvases.clear();
    }

    getCanvases() {
        return this.canvases;
    }
}

export default new fxManager();
