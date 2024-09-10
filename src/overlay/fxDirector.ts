class fxDirector {
    private toolTip;

    constructor() {
        // pass
    }

    startTutorial() {
        console.log("Tutorial!");
        console.log("tt: ", this.toolTip);
        // this.toolTip.position = { top: 1000, left: 1000 };
        const pos = { top: 100, left: 1000 };
        this.updateOverlayPosition(pos);
    }

    registerAvatarTooltip(_toolTip) {
        this.toolTip = _toolTip;
        console.log("Tooltip registered: ", _toolTip);
    }

    updateOverlayPosition(position: { top: number; left: number }) {
        if (this.toolTip) {
            this.toolTip.updatePosition(position);
        } else {
            console.warn(`Overlay with name ${name} not found.`);
        }
    }

    // updateOverlayText(name: string, text: string) {
    //     const overlay = this.overlays.get(name);
    //     if (overlay) {
    //         overlay.updateText(text);
    //     } else {
    //         console.warn(`Overlay with name ${name} not found.`);
    //     }
    // }
}

export default new fxDirector();
