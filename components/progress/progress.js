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

export default class Progress {
    constructor(container, options = {}) {
        if (!container) {
            throw new Error("Progress: container is required");
        }

        this.container = container;
        this.state = {
            value: normalizeProgressValue(options.value),
            animated: Boolean(options.animated),
            hidden: Boolean(options.hidden),
        };
        this.config = {
            size: options.size ?? 130,
            strokeWidth: options.strokeWidth ?? 10,
            duration: options.duration ?? 1200,
            trackColor: options.trackColor,
            valueColor: options.valueColor,
        };

        this.render();
    }

    render() {
        const { size, strokeWidth, duration, trackColor, valueColor } = this.config;
        const center = size / 2;
        const radius = (size - strokeWidth) / 2;

        this.circumference = 2 * Math.PI * radius;

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "progress");
        svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
        svg.setAttribute("width", size);
        svg.setAttribute("height", size);

        if (trackColor) {
            svg.style.setProperty("--progress-track", trackColor);
        }

        if (valueColor) {
            svg.style.setProperty("--progress-value", valueColor);
        }

        if (duration) {
            svg.style.setProperty("--progress-duration", `${duration}ms`);
        }

        const trackCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        trackCircle.setAttribute("class", "progress__track");
        trackCircle.setAttribute("cx", center);
        trackCircle.setAttribute("cy", center);
        trackCircle.setAttribute("r", radius);
        trackCircle.setAttribute("fill", "none");
        trackCircle.setAttribute("stroke-width", strokeWidth);

        const valueCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        valueCircle.setAttribute("class", "progress__value");
        valueCircle.setAttribute("cx", center);
        valueCircle.setAttribute("cy", center);
        valueCircle.setAttribute("r", radius);
        valueCircle.setAttribute("fill", "none");
        valueCircle.setAttribute("stroke-width", strokeWidth);
        valueCircle.setAttribute("stroke-dasharray", this.circumference);
        valueCircle.setAttribute("transform", `rotate(-90 ${center} ${center})`);

        svg.append(trackCircle, valueCircle);
        this.container.append(svg);

        this.svg = svg;
        this.valueCircle = valueCircle;

        this.syncViewState();
    }

    syncViewState() {
        this.updateValue();
        this.updateAnimation();
        this.updateVisibility();
    }

    setValue(value) {
        const nextValue = normalizeProgressValue(value);

        if (nextValue === this.state.value) {
            return;
        }

        this.state.value = nextValue;
        this.updateValue();
    }

    updateValue() {
        const progress = this.state.value / 100;
        const dashOffset = this.circumference * (1 - progress);

        this.valueCircle.style.strokeDashoffset = `${dashOffset}`;
    }

    setAnimated(animated) {
        this.state.animated = Boolean(animated);
        this.updateAnimation();
    }

    updateAnimation() {
        this.svg.classList.toggle("progress--animated", this.state.animated);
    }

    setHidden(hidden) {
        this.state.hidden = Boolean(hidden);
        this.updateVisibility();
    }

    updateVisibility() {
        this.svg.classList.toggle("progress--hidden", this.state.hidden);
    }

    destroy() {
        if (this.svg) {
            this.svg.remove();
        }

        this.svg = null;
        this.valueCircle = null;
    }
}
