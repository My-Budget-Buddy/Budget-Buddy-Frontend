const tween = ({ from, to, duration, onUpdate, onComplete }) => {
    const start = performance.now();

    const animate = (time) => {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = from + (to - from) * progress;

        onUpdate(value);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            if (onComplete) onComplete();
        }
    };

    requestAnimationFrame(animate);
};

export default tween;
