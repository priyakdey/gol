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

const clearBuffer = (buf) => {
	for (let row = 0; row < buf.length; row++) {
		for (let col = 0; col < buf[row].length; col++) {
			buf[row][col] = 0;
		}
	}
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

const setup = (preset) => {
	clearBuffer(front);

	const cy = Math.floor(rows / 2) - 1;
	const cx = Math.floor(cols / 2) - 1;

	switch (preset) {
		case "block":
			front[cy][cx] = 1;
			front[cy][cx + 1] = 1;
			front[cy + 1][cx] = 1;
			front[cy + 1][cx + 1] = 1;
			break;
		case "beehive":
			front[cy][cx - 1] = 1;
			front[cy - 1][cx] = 1;
			front[cy + 1][cx] = 1;
			front[cy - 1][cx + 1] = 1;
			front[cy + 1][cx + 1] = 1;
			front[cy][cx + 2] = 1;
			break;
		case "loaf":
			front[cy][cx - 1] = 1;
			front[cy - 1][cx] = 1;
			front[cy + 1][cx] = 1;
			front[cy - 1][cx + 1] = 1;
			front[cy + 2][cx + 1] = 1;
			front[cy][cx + 2] = 1;
			front[cy + 1][cx + 2] = 1;
			break;
		case "boat":
			front[cy - 1][cx] = 1;
			front[cy][cx - 1] = 1;
			front[cy + 1][cx - 1] = 1;
			front[cy + 1][cx] = 1;
			front[cy][cx + 1] = 1;
			break;
		case "longboat":
			front[cy][cx - 1] = 1;
			front[cy + 1][cx - 1] = 1;
			front[cy + 1][cx] = 1;
			front[cy - 1][cx] = 1;
			front[cy][cx + 1] = 1;
			front[cy - 2][cx + 1] = 1;
			front[cy - 1][cx + 2] = 1;
			break;
		case "verylongboat":
			front[cy][cx - 1] = 1;
			front[cy + 1][cx - 1] = 1;
			front[cy + 1][cx] = 1;
			front[cy - 1][cx] = 1;
			front[cy][cx + 1] = 1;
			front[cy - 2][cx + 1] = 1;
			front[cy - 1][cx + 2] = 1;
			front[cy - 3][cx + 2] = 1;
			front[cy - 2][cx + 3] = 1;
			break;
		case "verylongboat":
			front[cy][cx - 1] = 1;
			front[cy + 1][cx - 1] = 1;
			front[cy + 1][cx] = 1;
			front[cy - 1][cx] = 1;
			front[cy][cx + 1] = 1;
			front[cy - 2][cx + 1] = 1;
			front[cy - 1][cx + 2] = 1;
			front[cy - 3][cx + 2] = 1;
			front[cy - 2][cx + 3] = 1;
			break;
		case "cubiclongboat":
			front[cy][cx - 1] = 1;
			front[cy + 1][cx - 1] = 1;
			front[cy + 1][cx] = 1;
			front[cy - 1][cx] = 1;
			front[cy][cx + 1] = 1;
			front[cy - 2][cx + 1] = 1;
			front[cy - 1][cx + 2] = 1;
			front[cy - 3][cx + 2] = 1;
			front[cy - 2][cx + 3] = 1;
			front[cy - 4][cx + 3] = 1;
			front[cy - 3][cx + 4] = 1;
			break;
		case "quadlongboat":
			front[cy][cx - 1] = 1;
			front[cy + 1][cx - 1] = 1;
			front[cy + 1][cx] = 1;
			front[cy - 1][cx] = 1;
			front[cy][cx + 1] = 1;
			front[cy - 2][cx + 1] = 1;
			front[cy - 1][cx + 2] = 1;
			front[cy - 3][cx + 2] = 1;
			front[cy - 2][cx + 3] = 1;
			front[cy - 4][cx + 3] = 1;
			front[cy - 3][cx + 4] = 1;
			front[cy - 5][cx + 4] = 1;
			front[cy - 4][cx + 5] = 1;
			break;
		case "blinker":
			front[cy][cx] = 1;
			front[cy][cx - 1] = 1;
			front[cy][cx + 1] = 1;
			break;
		case "angel":
			front[cy - 1][cx] = 1;
			front[cy][cx - 1] = 1;
			front[cy][cx - 2] = 1;
			front[cy][cx + 1] = 1;
			front[cy][cx + 2] = 1;
			front[cy + 1][cx - 1] = 1;
			front[cy + 1][cx + 1] = 1;
			front[cy + 2][cx] = 1;
			break;
		case "toad":
			front[cy][cx] = 1;
			front[cy][cx + 1] = 1;
			front[cy - 1][cx] = 1;
			front[cy + 1][cx] = 1;
			front[cy + 1][cx + 1] = 1;
			front[cy + 2][cx + 1] = 1;
			break;
		case "beacon":
			front[cy][cx + 1] = 1;
			front[cy][cx + 2] = 1;
			front[cy + 1][cx + 1] = 1;
			front[cy + 1][cx + 2] = 1;
			front[cy - 1][cx] = 1;
			front[cy - 2][cx] = 1;
			front[cy - 1][cx - 1] = 1;
			front[cy - 2][cx - 1] = 1;
			break;
		case "glider":
			front[cy - 1][cx] = 1;
			front[cy][cx + 1] = 1;
			front[cy + 1][cx - 1] = 1;
			front[cy + 1][cx] = 1;
			front[cy + 1][cx + 1] = 1;
			break;
		case "lwss":
			front[cy][cx + 2] = 1;
			front[cy - 2][cx + 2] = 1;
			front[cy - 2][cx - 1] = 1;
			front[cy - 1][cx - 2] = 1;
			front[cy][cx - 2] = 1;
			front[cy + 1][cx - 2] = 1;
			front[cy + 1][cx - 1] = 1;
			front[cy + 1][cx] = 1;
			front[cy + 1][cx + 1] = 1;
			break;
		default:
			// ignore and let user select from scratch
			break;
	}

	draw();
};

const handlePresetChange = (e) => {
	clearBuffer(front);
	setup(e.target.value);
};

const handleGridClick = (e) => {
	const y = Math.floor(e.offsetY / gridSize);
	const x = Math.floor(e.offsetX / gridSize);

	front[y][x] = 1;

	draw();
};

canvas.addEventListener("click", handleGridClick);

document
	.getElementById("preset")
	.addEventListener("change", handlePresetChange);

document.getElementById("delay").addEventListener("input", (e) => {
	renderDelay = e.target.value;
	document.getElementById("delay-value").textContent = `${renderDelay}ms`;
});

document.getElementById("delay-value").textContent = `${renderDelay}ms`;

document.getElementById("play").addEventListener("click", () => {
	isAnimating = true;
	lastRender = 0;

	window.requestAnimationFrame(animate);

	canvas.removeEventListener("click", handleGridClick);

	document
		.getElementById("preset")
		.removeEventListener("change", handlePresetChange);

	document.getElementById("play").classList.add("display-none");
	document.getElementById("pause").classList.remove("display-none");
});

document.getElementById("pause").addEventListener("click", () => {
	isAnimating = false;

	document.getElementById("play").classList.remove("display-none");
	document.getElementById("pause").classList.add("display-none");
});

document.getElementById("reset").addEventListener("click", () => {
	// reset last render flag
	isAnimating = false;
	lastRender = -1;

	// reset the front buffer.
	// clearing back buffer is not required as it serves for
	// storing intermittent state
	clearBuffer(front);

	draw();

	// add back handler for playing animation
	canvas.addEventListener("click", handleGridClick);

	document
		.getElementById("preset")
		.addEventListener("change", handlePresetChange);

	// reset controls
	document.getElementById("play").classList.remove("display-none");
	document.getElementById("pause").classList.add("display-none");

	const delayInput = document.getElementById("delay");
	const defaultDelay = delayInput.getAttribute("default");
	delayInput.value = defaultDelay;
	renderDelay = defaultDelay;

	document.getElementById("delay-value").textContent = `${renderDelay}ms`;
});
