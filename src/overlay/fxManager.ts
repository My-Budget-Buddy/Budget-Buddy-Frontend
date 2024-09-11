import { getRef } from "./refStore";

type CanvasAPI = {
    updateEnabled: (value: boolean) => void;
    getEnabled: () => boolean;
    setMouseCoords: (coords: { x: number; y: number }) => void;
    getMouseCoords: () => { x: number; y: number };
};

type CanvasInfo = {
    canvas: HTMLCanvasElement;
    type: "global" | "component";
    refName?: string;
    api?: CanvasAPI; // Add API to CanvasInfo
};

class fxManager {
    private canvases: Map<string, CanvasInfo> = new Map();

    getComponent(name: string) {
        return getRef(name);
    }

    getCanvas(name: string): CanvasAPI | undefined {
        const canvasInfo = this.canvases.get(name);
        return canvasInfo?.api; // Return the API for manipulation
    }

    getAllCanvases() {
        return this.canvases;
    }

    registerComponentCanvas(
        refName: string,
        ref: HTMLElement | null,
        canvas: HTMLCanvasElement | null,
        api: CanvasAPI
    ) {
        if (ref == null || canvas == null) {
            console.error("Illegal entity attempted to register: ", refName);
            return;
        }

        this.canvases.set(refName, { canvas, type: "component", api });
        console.log("Canvas successfully registered: ", refName);
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
