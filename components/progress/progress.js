function clamp(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

function normalizeProgressValue(value) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
        return 0;
    }

    return clamp(numericValue, 0, 100);
}

const SVG_NS = "http://www.w3.org/2000/svg";

const createSvgEl = (tag) =>
    document.createElementNS(SVG_NS, tag);

export default class Progress {
    constructor(container, options = {}) {
        if (!container) {
            throw new Error("Progress: container is required");
        }

        this.container = container;

        // state
        this.value = normalizeProgressValue(options.value);
        this.animated = !!options.animated;
        this.hidden = !!options.hidden;

        // config
        this.size = options.size ?? 130;
        this.strokeWidth = options.strokeWidth ?? 10;
        this.duration = options.duration ?? 1200;
        this.trackColor = options.trackColor;
        this.valueColor = options.valueColor;

        this.render();
    }

    // ---------- lifecycle ----------

    render() {
        this.setupGeometry();
        this.createSvg();
        this.createCircles();
        this.applyStyles();
        this.mount();
        this.sync();
    }

    destroy() {
        if (!this.svg) return;

        this.svg.remove();
        this.svg = null;
    }

    // ---------- setup ----------

    setupGeometry() {
        this.center = this.size / 2;
        this.radius = (this.size - this.strokeWidth) / 2;
        this.circumference = 2 * Math.PI * this.radius;
    }

    createSvg() {
        const svg = createSvgEl("svg");

        svg.setAttribute("class", "progress");
        svg.setAttribute("viewBox", `0 0 ${this.size} ${this.size}`);
        svg.setAttribute("width", this.size);
        svg.setAttribute("height", this.size);

        this.svg = svg;
    }

    createCircles() {
        const track = createSvgEl("circle");
        const value = createSvgEl("circle");

        [track, value].forEach((circle) => {
            circle.setAttribute("cx", this.center);
            circle.setAttribute("cy", this.center);
            circle.setAttribute("r", this.radius);
            circle.setAttribute("fill", "none");
            circle.setAttribute("stroke-width", this.strokeWidth);
        });

        track.setAttribute("class", "progress__track");

        value.setAttribute("class", "progress__value");
        value.setAttribute("stroke-dasharray", this.circumference);
        value.setAttribute("transform", `rotate(-90 ${this.center} ${this.center})`);

        this.trackCircle = track;
        this.valueCircle = value;
    }

    applyStyles() {
        if (this.trackColor) {
            this.svg.style.setProperty("--progress-track", this.trackColor);
        }

        if (this.valueColor) {
            this.svg.style.setProperty("--progress-value", this.valueColor);
        }

        if (this.duration) {
            this.svg.style.setProperty("--progress-duration", `${this.duration}ms`);
        }
    }

    mount() {
        this.svg.append(this.trackCircle, this.valueCircle);
        this.container.append(this.svg);
    }

    // ---------- state sync ----------

    sync() {
        this.updateValue();
        this.updateAnimation();
        this.updateVisibility();
    }

    updateValue() {
        if (!this.valueCircle) return;

        const progress = this.value / 100;
        const offset = this.circumference * (1 - progress);

        this.valueCircle.style.strokeDashoffset = `${offset}`;
    }

    updateAnimation() {
        this.toggleClass("progress--animated", this.animated);
    }

    updateVisibility() {
        this.toggleClass("progress--hidden", this.hidden);
    }

    toggleClass(name, state) {
        if (!this.svg) return;
        this.svg.classList.toggle(name, state);
    }

    // ---------- public API ----------

    setValue(value) {
        const next = normalizeProgressValue(value);
        if (next === this.value) return;

        this.value = next;
        this.updateValue();
    }

    setAnimated(animated) {
        this.animated = Boolean(animated);
        this.updateAnimation();
    }

    setHidden(hidden) {
        this.hidden = Boolean(hidden);
        this.updateVisibility();
    }
}