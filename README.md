# Progress Component

## Описание проекта

Этот проект представляет собой прототип блока `Progress` для мобильных web-приложений.

Основная задача компонента: отображать ход выполнения процесса и его текущий прогресс. Компонент реализован как переиспользуемый круговой progress bar, который можно встроить в любой интерфейс и управлять им из JavaScript.

## Стек

- HTML5
- CSS3
- JavaScript (ES Modules)
- SVG

## API компонента

Компонент экспортируется из файла [components/progress/progress.js](C:/Users/Anna/Desktop/personal_projects/ozon-frontend-test/components/progress/progress.js).

### Создание экземпляра

```js
import Progress from "./components/progress/progress.js";

const container = document.getElementById("progress-container");

const progress = new Progress(container, {
    value: 65,
    animated: false,
    hidden: false,
    size: 120,
    strokeWidth: 10,
    duration: 2000,
    trackColor: "#dae6ec",
    valueColor: "#005cff",
});
```

### Параметры конструктора

- `container: HTMLElement`  
  DOM-элемент, в который будет вставлен SVG progress bar.

- `options.value: number`  
  Текущее значение прогресса от `0` до `100`. Если передать некорректное значение, компонент приведёт его к безопасному диапазону.

- `options.animated: boolean`  
  Включает или выключает анимацию вращения.

- `options.hidden: boolean`  
  Скрывает или показывает компонент.

- `options.size: number`  
  Размер компонента в пикселях. По умолчанию `130`.

- `options.strokeWidth: number`  
  Толщина окружности progress bar. По умолчанию `10`.

- `options.duration: number`  
  Длительность одного цикла анимации в миллисекундах. По умолчанию `1200`.

- `options.trackColor: string`  
  Цвет фоновой окружности.

- `options.valueColor: string`  
  Цвет активной части progress bar.

### Методы экземпляра

- `setValue(value)`  
  Обновляет значение прогресса. Диапазон автоматически ограничивается от `0` до `100`.

- `setAnimated(animated)`  
  Включает или выключает анимацию.

- `setHidden(hidden)`  
  Скрывает или показывает компонент.

- `destroy()`  
  Удаляет SVG компонента из DOM.

## Как использовать в своём проекте

1. Скопируйте файлы:
   - `components/progress/progress.js`
   - `components/progress/progress.css`

2. Подключите CSS на страницу:

```html
<link rel="stylesheet" href="./components/progress/progress.css">
```

3. Создайте контейнер в HTML:

```html
<div id="progress-container"></div>
```

4. Импортируйте компонент и создайте экземпляр:

```js
import Progress from "./components/progress/progress.js";

const progress = new Progress(document.getElementById("progress-container"), {
    value: 40,
    animated: true,
});
```

5. При необходимости обновляйте состояние:

```js
progress.setValue(80);
progress.setAnimated(false);
progress.setHidden(false);
```

## Особенности

Компонент переиспользуемый и не зависит от конкретной страницы. Его можно создавать в любом контейнере и использовать в разных частях проекта.

Что можно кастомизировать:

- размер компонента через `size`
- толщину линии через `strokeWidth`
- текущее значение через `value`
- анимацию через `animated`
- длительность анимации через `duration`
- видимость через `hidden`
- цвет трека через `trackColor`
- цвет активной части через `valueColor`

Пример кастомизации:

```js
const progress = new Progress(container, {
    value: 75,
    size: 160,
    strokeWidth: 12,
    duration: 1500,
    trackColor: "#d9d9d9",
    valueColor: "#22c55e",
    animated: true,
});
```

Компонент использует CSS custom properties:

- `--progress-track`
- `--progress-value`
- `--progress-duration`

Эти переменные устанавливаются автоматически из параметров конструктора, поэтому компонент удобно переиспользовать без изменения его внутренней логики.
