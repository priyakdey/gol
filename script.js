const color_arsenic = "#202020";
const color_black = "#000000";
const color_red = "#ff0000";

const gridSize = 50;
const lineWidth = 1;

let renderDelay = document.getElementById("delay").value;

let isAnimating = false;

const container = document.querySelector(".container");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// take the container dimension as canvas dimension
const height = container.clientHeight;
const width = container.clientWidth;

// set canvas dimensions to container dimension
canvas.height = height;
canvas.width = width;

const rows = Math.floor(height / gridSize);
const cols = Math.floor(width / gridSize);

let front = Array.from({ length: rows }, () =>
	new Array(Math.floor(width / gridSize)).fill(0)
);

let back = Array.from({ length: cols }, () =>
	new Array(Math.floor(width / gridSize)).fill(0)
);

var lastRender = -1;

const mod = (a, b) => ((a % b) + b) % b;

const countNbors = (cy, cx) => {
	let nbors = 0;

	for (let dy = -1; dy <= 1; dy++) {
		for (let dx = -1; dx <= 1; dx++) {
			if (dx === 0 && dy === 0) {
				continue;
			}

			y = mod(cy + dy, rows);
			x = mod(cx + dx, cols);

			nbors += front[y][x];
		}
	}

	return nbors;
};

// ref: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
// Any live cell with fewer than two live neighbors dies, as if by underpopulation.
// Any live cell with two or three live neighbors lives on to the next generation.
// Any live cell with more than three live neighbors dies, as if by overpopulation.
// Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
const updateBuffer = () => {
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const nbors = countNbors(row, col);
			if (front[row][col] === 1) {
				back[row][col] = nbors === 2 || nbors === 3 ? 1 : 0;
			} else {
				back[row][col] = nbors === 3 ? 1 : 0;
			}
		}
	}

	// swap the buffers
	[front, back] = [back, front];
};

const draw = () => {
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = color_black;

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			ctx.fillStyle = front[y][x] === 1 ? color_red : color_arsenic;

			ctx.fillRect(
				x * gridSize,
				y * gridSize,
				gridSize - lineWidth,
				gridSize - lineWidth
			);
		}
	}
};

const animate = (timestamp) => {
	if (!isAnimating) return;
	if (lastRender === -1) return;

	updateBuffer();
	draw();

	lastRender = timestamp;

	setTimeout(() => window.requestAnimationFrame(animate), renderDelay);
};

ctx.fillStyle = color_arsenic;
ctx.fillRect(0, 0, width, height);

ctx.lineWidth = lineWidth;

ctx.strokeStyle = color_black;
for (let col = 0; col <= width; col += gridSize) {
	ctx.beginPath();
	ctx.moveTo(col + gridSize, 0);
	ctx.lineTo(col + gridSize, height);
	ctx.stroke();
}

for (let row = 0; row <= height; row += gridSize) {
	ctx.beginPath();
	ctx.moveTo(0, row + gridSize);
	ctx.lineTo(width, row + gridSize);
	ctx.stroke();
}

const handleGridClick = (e) => {
	const y = Math.floor(e.offsetY / gridSize);
	const x = Math.floor(e.offsetX / gridSize);

	front[y][x] = 1;

	draw();
};

canvas.addEventListener("click", handleGridClick);

document.getElementById("play").addEventListener("click", () => {
	isAnimating = true;
	lastRender = 0;

	window.requestAnimationFrame(animate);

	canvas.removeEventListener("click", handleGridClick);
	document.getElementById("play").classList.toggle("display-none");
	document.getElementById("pause").classList.toggle("display-none");
});

document.getElementById("pause").addEventListener("click", () => {
	isAnimating = false;

	document.getElementById("play").classList.toggle("display-none");
	document.getElementById("pause").classList.toggle("display-none");
});

document.getElementById("reset").addEventListener("click", () => {
	// reset last render flag
	isAnimating = false;
	lastRender = -1;

	// reset the buffer
	front = Array.from({ length: rows }, () =>
		new Array(Math.floor(width / gridSize)).fill(0)
	);

	back = Array.from({ length: cols }, () =>
		new Array(Math.floor(width / gridSize)).fill(0)
	);

	draw();

	// add back handler for playing animation
	canvas.addEventListener("click", handleGridClick);

	// reset controls
	document.getElementById("play").classList.toggle("display-none");
	document.getElementById("pause").classList.toggle("display-none");

	const delayInput = document.getElementById("delay");
	const defaultDelay = delayInput.getAttribute("default");
	delayInput.value = defaultDelay;
	renderDelay = defaultDelay;
});

document
	.getElementById("delay")
	.addEventListener("change", (e) => (renderDelay = e.target.value));
