import { eventEmitter } from "./event_emitter";
import { getAllRefs, getRef } from "./refStore";

class fxDirector {
    private toolTip;

    constructor() {
        // pass
    }

    async startTutorial() {
        console.log("Tutorial!");
        console.log("tt: ", this.toolTip);
        // this.toolTip.position = { top: 1000, left: 1000 };
        const pos = { top: 100, left: 1000 };
        this.updateOverlayPosition(pos);

        await this.waitForUserInput("nextStep");

        // console.log("Ref: ", getRef("AddNewBudgetButton"));
        const f = getRef("AddNewBudgetButton");
        let rect = f?.current?.getBoundingClientRect();
        console.log(rect);

        const newPos = { top: rect?.top as number, left: rect?.left as number };
        this.updateOverlayPosition(newPos);
        this.updateOverlayText("Add a new budget");
    }

    registerAvatarTooltip(_toolTip) {
        this.toolTip = _toolTip;
        console.log("Tooltip registered: ", _toolTip);
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
