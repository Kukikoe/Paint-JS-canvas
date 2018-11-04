window.onload = function() {
	init();
};

let canvasCoordX = document.getElementById("canvasCoordX");
let canvasCoordY = document.getElementById("canvasCoordY");

const dropDown = document.getElementById("dropdown");
const btnClear = document.getElementById("clearBtn");
const btnBrush = document.getElementById("brushBtn");

const tabElem = document.querySelector(".tab");
const tabContentElem = document.querySelector(".tab-contents");
const canvasForCopyElem = document.getElementById("canvas-for-copy");
let count = 1;

tabElem.addEventListener("click", (event) => {
	let tabCont = document.querySelectorAll(".tabcontent");
	let target = event.target;
	if(target.closest('.tablinks').dataset.id === "add-tab") {
		count++;
		addTabSheet(tabElem.firstChild.nextSibling, tabElem.children.length - 1, count);

		return;
	}
	if(target.closest('.tablinks__button')) {
		deleteTabSheet(target.closest('.tablinks__button').parentElement);
		return;
	}
	for (let i = 0; i < tabCont.length; i++) {
		tabCont[i].classList.remove("active");
	}
	openSheet(target.closest('.tablinks'));
});

function deleteTabSheet(sheet) {
	deleteCanvasForTab(sheet);
	sheet.remove();
}

function deleteCanvasForTab(sheet) {
document.getElementById(sheet.dataset.id).remove();
}

function addTabSheet(btn, position, count) {
	let newTab = btn.cloneNode(true);
	newTab.dataset.id = "tab-" + (position + 1);
	newTab.querySelector(".sheet-name").innerHTML = 'Sheet ' + count;
	let parentElemOfBtns = btn.parentElement;
	parentElemOfBtns.insertBefore(newTab, parentElemOfBtns.children[position]);
	addCanvasForTab(newTab.dataset.id);
}

function addCanvasForTab(id) {
 
	let newCanvasForTab = canvasForCopyElem.cloneNode(true);
	newCanvasForTab.id = id;
	tabContentElem.appendChild(newCanvasForTab);
	addEventListeners(newCanvasForTab.querySelector(".canvas"));
}

function openSheet(btn) {
	const tab = document.getElementById(btn.dataset.id);
	tab.classList.add("active");
}


let canvas = document.getElementById('canvas');
let rng = document.getElementById('range');
let output = document.getElementById('output'); // p - абзац
let color = document.getElementById("color");



let fillColor = localStorage.getItem("Color") || "#000";

let figure;
let mode = "brush";
let size = Number(localStorage.getItem("Size")) || 10;

color.value = fillColor;
output.value = rng.value = size;

function init() {
	addEventListeners(canvas);
}

function addEventListeners(canvas) {
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


