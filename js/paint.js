

let canvas = document.querySelector('canvas');

let figure;
let mode = "brush";

function init() {
	addEventListeners(canvas);
}

function addEventListeners(canvas) {
	let arraySheets = JSON.parse(localStorage.getItem("CanvasSheets")) || [];

	const tabBtnsElem = document.querySelector(".tab");

	tabBtnsElem.addEventListener("click", (event) => {
		let target = event.target;

		if (tabBtnsElem.querySelector(".active")) {
			let sheetObj = arraySheets.filter((sheet) => sheet.id === tabBtnsElem.querySelector(".active").dataset.id);
			
			if(sheetObj.length === 0) {
				mode = "brush";
				colorElem.value = "#000";
				outputElem.value = rngElem.value = 10;
			}
			else {
				colorElem.value = sheetObj[0].color;
				outputElem.value = rngElem.value = sheetObj[0].size;
			}
			console.log(tabBtnsElem.querySelector(".active").dataset.id)
			return;
		}
	});

	const dropDownElem = document.getElementById("dropdown");
	const btnClearElem = document.getElementById("clearBtn");
	const btnBrushElem = document.getElementById("brushBtn");

	let canvasCoordXElem = document.getElementById("canvasCoordX");
	let canvasCoordYElem = document.getElementById("canvasCoordY");

	let rngElem = document.getElementById('range');
	let outputElem = document.getElementById('output');
	let colorElem = document.getElementById("color");

	let paintConstructor = new Paint();

	canvas.addEventListener('mousemove', function(event) {
		canvasCoordXElem.innerHTML = event.offsetX;
		canvasCoordYElem.innerHTML = event.offsetY;
	});

	canvas.addEventListener('mousedown', function(event) {
		paintConstructor.mouseMoveHandler(event, canvas, colorElem.value, outputElem.value);
	});

	colorElem.addEventListener('input', function() {
		paintConstructor.changeColor(canvas, arraySheets, colorElem.value, outputElem.value);
	});

	btnBrushElem.addEventListener('click', function() {
		canvas.style.cursor = 'auto';
		mode = "brush";
	});

	canvas.addEventListener('mousedown', function(event) {
		paintConstructor.drawFigure(event, canvas, outputElem.value, colorElem);
	});

	rngElem.addEventListener('input', function() {
		paintConstructor.getSizeFromRange(canvas, arraySheets, colorElem.value, outputElem, rngElem);
	});

	btnClearElem.addEventListener('click', function() {
		if (canvas.closest(".active")) {
			paintConstructor.clearAll(canvas);
		}
	});

	dropDownElem.addEventListener('click', function(event) {
		paintConstructor.getCursor(event, canvas, colorElem.value, outputElem.value);
	});

	window.onmouseup = function() {
		canvas.onmousemove = null;
	}
}

function Paint() {
	this.clearAll = function(canvas) {
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	this.getCursor = function(event, canvas, fillColor, size) {
		mode = "figure";
		let target = event.target;
		if (target.tagName != 'SPAN') return;
		figure = target.innerHTML;
		getFigureForCursor(canvas, fillColor, size);
	}

	this.getSizeFromRange = function(canvas, arraySheets, fillColor, outputElem, rngElem) {
		outputElem.value = rngElem.value;
		console.log(canvas.parentElement.id)
		setSheetInLS(canvas.parentElement.id, fillColor, outputElem.value, arraySheets);
		getFigureForCursor(canvas, fillColor, outputElem.value);
	} 

	this.changeColor = function(canvas, arraySheets, fillColor, size) {
		setSheetInLS(canvas.parentElement.id, fillColor, size, arraySheets);
		getFigureForCursor(canvas, fillColor, size);
	}

	this.drawFigure = function(event, canvas, size, colorElem) {
		if (mode !== "figure") return;
		const ctx = canvas.getContext('2d');
		ctx.strokeStyle = colorElem.value;
		ctx.fillStyle = colorElem.value;
		getFigure(ctx, size, figure, event.offsetX, event.offsetY);
	}

	this.mouseMoveHandler = function(event, canvas, fillColor, size) {
		if (mode !== "brush") return;
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

	function setSheetInLS(id, color, size, arraySheets) {
		let sheet = {
			id,
			color,
			size
		};
		arraySheets = arraySheets.concat(sheet);
		localStorage.setItem("CanvasSheets", JSON.stringify(arraySheets));
	}

	function getFigureForCursor(canvas, fillColor, size) {
		if (mode !== "figure") return;

		let cursor = document.createElement('canvas');
		let ctxCurs = cursor.getContext('2d');
		cursor.width = +size + 2;
		cursor.height = +size + 2;
		ctxCurs.strokeStyle = fillColor;
		getFigure(ctxCurs, +size, figure, 1, 1);
		canvas.style.cursor = 'url(' + cursor.toDataURL() + '), auto';
	}
}