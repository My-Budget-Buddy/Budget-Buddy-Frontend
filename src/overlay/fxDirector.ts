import { eventEmitter } from "./event_emitter";
import fxManager from "./fxManager";
import { getAllRefs, getRef } from "./refStore";
import tween from "./tween";

class fxDirector {
    private toolTip;
    private running: boolean = true;

    constructor() {}

    async startTutorial() {
        console.log("fxManager component: ", fxManager.getAllCanvases());

        const g = fxManager.getCanvas("GLOBAL");

        g?.updateEnabled(true);

        const pos = { top: 100, left: 100 };
        this.updateOverlayPosition(pos);
        // g.updateRadialHighlightEnabled(true);

        // TODO Instead of waiting for a specific message,  refactor
        //  to wait for arbitrary message and choose next step
        // based on message
        await this.waitForUserInput("nextStep");
        if (!this.running) {
            this.cleanup();
            return;
        }

        // console.log("Ref: ", getRef("AddNewBudgetButton"));
        const f = getRef("AddNewBudgetButton");
        const rect = f?.current?.getBoundingClientRect();

        const center = getCenterCoordinates(rect);
        const centerCast = { top: center.y, left: center.x };
        // console.log(rect);

        const newPos = { top: rect?.top as number, left: rect?.left as number };
        this.updateOverlayPosition(newPos);
        this.updateOverlayText("Add a new budget");

        const c = fxManager.getCanvas("AddNewBudgetButton");
        console.log("c: ", c);
        c.updateEnabled(true);
        // c.updateHighlightEnabled(true);

        // console.log("NEWPOS: ", newPos)

        g.updateRadialPosition(centerCast);
        g.updateRadialHighlightEnabled(true);

        tween({
            from: 1000,
            to: 100,
            duration: 2000,
            onUpdate: (value) => {
                g.updateRadialHighlightRadius(value);
            },
            onComplete: () => {
                setTimeout(() => {
                    g.updateRadialHighlightEnabled(false);
                }, 2000);
            }
        });
    }

    registerAvatarTooltip(_toolTip) {
        this.toolTip = _toolTip;
        // console.log("Tooltip registered: ", _toolTip);
        this.cleanup();
    }

    updateOverlayPosition(position: { top: number; left: number }) {
        if (this.toolTip) {
            this.toolTip.updatePosition(position);
        } else {
            console.warn(`Overlay not found.`);
        }
    }

    updateOverlayText(text: string) {
        if (this.toolTip) {
            this.toolTip.updateText(text);
        } else {
            console.warn(`Overlay not found.`);
        }
    }

    cleanup() {
        const newPos = { top: 100000, left: 100000 };
        this.updateOverlayPosition(newPos);
        this.updateOverlayText("");
    }

    private waitForUserInput(eventName: string): Promise<void> {
        return new Promise((resolve) => {
            // Resolve the promise when the event is emitted
            const handler = () => {
                eventEmitter.off(eventName, handler); // Clean up after handling the event
                resolve();
            };
            eventEmitter.on(eventName, handler);
        });
    }
}

export default new fxDirector();

interface CenterCoordinates {
    x: number;
    y: number;
}

function getCenterCoordinates(rect: DOMRect): CenterCoordinates {
    const offsetX = (rect.right - rect.left) / 2;
    const offsetY = (rect.bottom - rect.top) / 2;
    const centerX = rect.left + offsetX;
    const centerY = rect.top + offsetY;

    console.log("center: ", { x: centerX, y: centerY });
    return { x: centerX, y: centerY };
}
