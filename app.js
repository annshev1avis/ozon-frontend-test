import Progress from "./components/progress/progress.js";

const valueInput = document.getElementById('value-input');
const animateInput = document.getElementById('animate-input');
const hideInput = document.getElementById('hide-input');
const progressContainer = document.getElementById('progress-container');


const initialValue = Number(valueInput.value);
const progress = new Progress(progressContainer, {
    value: initialValue,
    animated: false,
    hidden: false,
    size: 120,
    strokeWidth: 10,
    duration: 2000,
});

valueInput.addEventListener('input', (event) => {
    progress.setValue(event.target.value);
});

animateInput.addEventListener('change', (event) => {
    progress.setAnimated(event.target.checked);
});

hideInput.addEventListener('change', (event) => {
    progress.setHidden(event.target.checked);
});
