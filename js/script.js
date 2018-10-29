window.onload = function() {
	init();
};

const canvas = document.getElementById('canvas');

let rng = document.getElementById('range');
let output = document.getElementById('output'); // p - абзац
let color = document.getElementById("color");
let canvasCoordX = document.getElementById("canvasCoordX");
let canvasCoordY = document.getElementById("canvasCoordY");

const dropDown = document.getElementById("dropdown");
const btnClear = document.getElementById("clearBtn");
const btnBrush = document.getElementById("brushBtn");

let fillColor = localStorage.getItem("Color") || "#000";

let figure;
let mode = "brush";
let size = Number(localStorage.getItem("Size")) || 10;

color.value = fillColor;
output.value = rng.value = size;

function init() {
	addEventListeners();
}

function addEventListeners() {
	canvas.addEventListener('mousemove', function(event) {
		canvasCoordX.innerHTML = event.offsetX;
		canvasCoordY.innerHTML = event.offsetY;
	});
	canvas.addEventListener('mousedown', mouseMoveHandler);
	color.addEventListener('input', changeColor);
	btnBrush.addEventListener('click', function() {
		canvas.style.cursor = 'auto';
		mode = "brush";
	});
	canvas.addEventListener('mousedown', function() {
		drawFigure(event);
	});
	rng.addEventListener('input', getSizeFromRange);
	btnClear.addEventListener('click', clearAll);
	dropDown.addEventListener('click', getCursor);
}

function getCursor(event) {
	mode = "figure";
	let target = event.target;
	if (target.tagName != 'SPAN') return;
	figure = target.innerHTML;
	getFigureForCursor();
}

function getFigureForCursor() {
	if (mode !== "figure") return;
 
	let size = Number(localStorage.getItem("Size"));
	let cursor = document.createElement('canvas');
	let ctxCurs = cursor.getContext('2d');
	cursor.width = size + 2;
	cursor.height = size + 2;
	ctxCurs.strokeStyle = fillColor;
	getFigure(ctxCurs, size, figure, 1, 1);
	canvas.style.cursor = 'url(' + cursor.toDataURL() + '), auto';
}

/*function getFigure(ctx, size, figure, x, y) {
	let side = Math.sqrt(Math.pow(size / 2, 2) - Math.pow(size / 4, 2));

	switch (figure) {
		case "Circle":
		ctx.beginPath();
		ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 13 * Math.PI / 2);	
		ctx.stroke();
		break;
		case "Square":
		ctx.beginPath();
		ctx.strokeRect(x, y, size, size);
		break;
		case "Triangle":
		ctx.beginPath();
		ctx.moveTo(x + size / 2, y);
		ctx.lineTo(x, y + Math.sqrt(Math.pow(size, 2) - Math.pow(size / 2, 2)));
		ctx.lineTo(x + size, y + Math.sqrt(Math.pow(size, 2) - Math.pow(size / 2, 2)));
		ctx.lineTo(x + size / 2, y);
		ctx.stroke();
		break;
		case "Hexagon":
		ctx.beginPath();
		ctx.moveTo(x + size / 4, y - side  + size / 2);
		ctx.lineTo(x, y + size / 2);
		ctx.lineTo(x + size / 4, y + side  + size / 2);
		ctx.lineTo(x + size / 4 + size / 2, y + side  + size / 2);
		ctx.lineTo(x + size, y  + size / 2);
		ctx.lineTo(x + size / 4 + size / 2, y - side  + size / 2);
		ctx.lineTo(x + size / 4, y - side  + size / 2);
		ctx.stroke();
		break;	
	}
}
module.exports = getFigure;*/

function drawFigure(event) {
	if (mode !== "figure") return;
	let size = Number(localStorage.getItem("Size"));
	const ctx = canvas.getContext('2d');
	ctx.strokeStyle = fillColor;
	ctx.fillStyle = fillColor;
	getFigure(ctx, size, figure, event.offsetX, event.offsetY);
}

function getSizeFromRange() {
	output.value = rng.value;
	localStorage.setItem("Size", output.value);
	size = output.value;
	getFigureForCursor();
}

function clearAll() {
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function mouseMoveHandler(event) {
	if (mode !== "brush") return;

	const canvas = event.target;

	if (canvas && canvas.getContext) {
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = fillColor;

		canvas.onmousemove = function(event) {
			ctx.fillRect(event.offsetX - size / 2, event.offsetY - size / 2, size, size);
		};
		canvas.onmouseup = function() {
			canvas.onmousemove = null;
		}
	}
}

function changeColor() {
	fillColor = color.value;
	localStorage.setItem("Color", fillColor);
	getFigureForCursor();
}


