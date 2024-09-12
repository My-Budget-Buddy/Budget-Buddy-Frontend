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

        const pos = { top: 20, left: 20 };
        this.updateOverlayPosition(pos);
        this.updateOverlayText(
            "Welcome to BudgetBuddy! Here is where you can define and manage your personal budgets."
        );

        // TODO Instead of waiting for a specific message,  refactor
        //  to wait for arbitrary message and choose next step
        // based on message
        await this.waitForUserInput("nextStep");
        if (!this.running) {
            this.cleanup();
            return;
        }

        const f = getRef("AddNewBudgetButton");
        const rect = f?.current?.getBoundingClientRect();

        const center = getCenterCoordinates(rect);
        const centerCast = { top: center.y, left: center.x };

        const newPos = { top: rect?.top as number, left: rect?.right as number };
        this.updateOverlayPosition(newPos);
        this.updateOverlayText("Start by adding a new budget");

        const c = fxManager.getCanvas("AddNewBudgetButton");
        console.log("c: ", c);
        c.updateEnabled(true);

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

        await this.waitForUserInput("nextStep");

        const categoryElement = document.querySelector("#category");
        const categoryRect = categoryElement?.getBoundingClientRect();

        this.updateOverlayPosition({ top: categoryRect?.top, left: categoryRect?.right });
        this.updateOverlayText("Let's select the category of item you'd like to budget for this month.");

        this.toolTip.updateButtonShown(false);

        await this.waitForUserInput("nextStep");

        const totalAmount = document.querySelector("#totalAmount");
        const totalRect = totalAmount?.getBoundingClientRect();

        this.updateOverlayPosition({ top: totalRect?.top, left: totalRect?.right });
        this.updateOverlayText(
            "Put in the amount of money you're willing to budget for this category for this month here."
        );

        await this.waitForUserInput("nextStep");

        this.updateOverlayPosition({ top: totalRect?.top + 80, left: totalRect?.right });
        this.updateOverlayText(
            "Check this box if you want to 'box off' this money from you total remaining cash for the month."
        );

        await delay(5000);

        const submitElement = document.querySelector("#submitButton");
        const submitRect = submitElement?.getBoundingClientRect();

        this.updateOverlayPosition({ top: submitRect?.top, left: submitRect?.right });
        this.updateOverlayText("Now, go ahead and save your budget. You can always change it later. ");

        await this.waitForUserInput("nextStep");

        this.updateOverlayPosition(pos);
        this.updateOverlayText("Congratulations! You've set up your first budget!");

        this.toolTip.updateButtonShown(true);

        await this.waitForUserInput("nextStep");
        this.cleanup();
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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getCenterCoordinates(rect: DOMRect): CenterCoordinates {
    const offsetX = (rect.right - rect.left) / 2;
    const offsetY = (rect.bottom - rect.top) / 2;
    const centerX = rect.left + offsetX;
    const centerY = rect.top + offsetY;

    console.log("center: ", { x: centerX, y: centerY });
    return { x: centerX, y: centerY };
}
