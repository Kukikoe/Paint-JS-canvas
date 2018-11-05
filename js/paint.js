window.onload = function() {
	init();
};

let canvasCoordXElem = document.getElementById("canvasCoordX");
let canvasCoordYElem = document.getElementById("canvasCoordY");

const dropDownElem = document.getElementById("dropdown");
const btnClearElem = document.getElementById("clearBtn");
const btnBrushElem = document.getElementById("brushBtn");

let rngElem = document.getElementById('range');
let outputElem = document.getElementById('output'); // p - абзац
let colorElem = document.getElementById("color");

let fillColor = localStorage.getItem("Color") || "#000";

let figure;
let mode = "brush";
let size = Number(localStorage.getItem("Size")) || 10;

colorElem.value = fillColor;
outputElem.value = rngElem.value = size;

function init() {
	let canvas = document.querySelector('canvas');
	addEventListeners(canvas);
}

function addEventListeners(canvas) {
	canvas.addEventListener('mousemove', function(event) {
		canvasCoordXElem.innerHTML = event.offsetX;
		canvasCoordYElem.innerHTML = event.offsetY;
	});
	canvas.addEventListener('mousedown', mouseMoveHandler);
	colorElem.addEventListener('input', changeColor);
	btnBrushElem.addEventListener('click', function() {
		canvas.style.cursor = 'auto';
		mode = "brush";
	});
	canvas.addEventListener('mousedown', function(event) {
		drawFigure(event, canvas);
	});
	rngElem.addEventListener('input', getSizeFromRange);
	btnClearElem.addEventListener('click', function() {
		clearAll(canvas);
	});
	dropDownElem.addEventListener('click', function(event) {
		getCursor(event, canvas);
	});
}

function getCursor(event, canvas) {
	mode = "figure";
	let target = event.target;
	if (target.tagName != 'SPAN') return;
	figure = target.innerHTML;
	getFigureForCursor(canvas);
}

function getFigureForCursor(canvas) {
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

function drawFigure(event, canvas) {
	if (mode !== "figure") return;
	let size = Number(localStorage.getItem("Size"));
	const ctx = canvas.getContext('2d');
	ctx.strokeStyle = fillColor;
	ctx.fillStyle = fillColor;
	getFigure(ctx, size, figure, event.offsetX, event.offsetY);
}

function getSizeFromRange() {
	outputElem.value = rngElem.value;
	localStorage.setItem("Size", outputElem.value);
	size = outputElem.value;
	getFigureForCursor();
}

function clearAll(canvas) {
	console.log(canvas)
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
	fillColor = colorElem.value;
	localStorage.setItem("Color", fillColor);
	getFigureForCursor();
}