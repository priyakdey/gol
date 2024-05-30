const color_arsenic = "#202020";
const color_black = "#000000";
const color_red = "#ff0000";
const gridSize = 50;
const lineWidth = 1;

const container = document.querySelector(".container");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// take the container dimension as canvas dimension
const height = container.clientHeight;
const width = container.clientWidth;

// set canvas dimensions to container dimension
canvas.height = height;
canvas.width = width;

const front = Array.from({ length: Math.floor(height / gridSize) }, () =>
	new Array(Math.floor(width / gridSize)).fill(0)
);

const back = Array.from({ length: Math.floor(height / gridSize) }, () =>
	new Array(Math.floor(width / gridSize)).fill(0)
);

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

canvas.addEventListener("click", (e) => {
	const y = Math.floor(e.offsetY / gridSize);
	const x = Math.floor(e.offsetX / gridSize);

	ctx.fillStyle = color_red;

	front[y][x] = 1;

	ctx.fillRect(
		x * gridSize,
		y * gridSize,
		gridSize - lineWidth,
		gridSize - lineWidth
	);

	console.log(front);
});
