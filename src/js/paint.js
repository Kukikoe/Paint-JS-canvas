function initPaint() {
	addEventListeners();
}

function addEventListeners() {
	const tabContentsElem = document.getElementById("tab-contents");

	const dropDownElem = document.getElementById("dropdown");
	const btnClearElem = document.getElementById("clearBtn");
	const btnBrushElem = document.getElementById("brushBtn");

	let canvasCoordXElem = document.getElementById("canvasCoordX");
	let canvasCoordYElem = document.getElementById("canvasCoordY");

	let rngElem = document.getElementById('range');
	let outputElem = document.getElementById('output');
	let colorElem = document.getElementById("color");

	function getActiveCanvas() {
		return tabContentsElem.querySelector(".tabcontent.active canvas.active");
	}

	function getActiveTab() {
		return tabContentsElem.querySelector(".tabcontent.active");
	}

	tabContentsElem.addEventListener('mousemove', function(event) {
		if (event.target.tagName !== "CANVAS") return;
		canvasCoordXElem.innerHTML = event.offsetX;
		canvasCoordYElem.innerHTML = event.offsetY;
	});

	tabsObj.onOpen = function(tab) {
		let paintOptions = tab.paintOptions;
		outputElem.value = rngElem.value = paintOptions.size;
		colorElem.value = paintOptions.fillColor;
		let canvas = tab.querySelector(".canvas.active");
	}

	colorElem.addEventListener('input', function() {
		let tab = getActiveTab();
		tab.paintOptions.setColor(colorElem.value);
	});

	rngElem.addEventListener('input', function() {
		outputElem.value = rngElem.value;

		let tab = getActiveTab();
		tab.paintOptions.setSize(this.value);
	});

	btnClearElem.addEventListener('click', function() {
		let canvas = getActiveCanvas();
		canvas.paintObj.clear(canvas);
	});

	btnBrushElem.addEventListener('click', function() {
		let tab = getActiveTab();
		tab.paintOptions.setMode("brush");
	});

	dropDownElem.addEventListener('click', function(event) {
		let target = event.target;
		if (target.tagName === 'IMG') {
			target = target.parentElement;
		}
		if (target.tagName != 'SPAN' ) return;

		let tab = getActiveTab();
		tab.paintOptions.getCursor(target.dataset.figure);
	});
}

function getLayers(array) {
	let arrayOfLayers = [];
	for (let i = 0; i < array.length; i++) {
		let layer = {
			id: array[i].dataset.id,
			image: array[i].toDataURL(),
		}
		arrayOfLayers.push(layer);
	}
	return arrayOfLayers;
}

function PaintOptions() {
	this.fillColor = "#000000";
	this.mode = "brush";
	this.figure = "";
	this.size = 10;
	this.cursor = "auto";
	this.image = "";
	this.paintings = [];

	let self = this;

	this.setSize = function(size) {
		this.size = +size;
		getFigureForCursor();
	} 

	this.setColor = function(fillColor) {
		this.fillColor = fillColor;
		getFigureForCursor();
	}

	this.setMode = function(mode) {
		this.mode = mode;
		this.setCursor('auto');
	}

	this.setCursor = function(cursor) {
		self.cursor = cursor;

		self.paintings.forEach((paint) => {
			let canvas = paint.canvas;

			if (cursor === "auto") {
				canvas.style.cursor = cursor;
				return;
			}
			canvas.style.cursor = 'url(' + cursor + '), auto';
		});
	}

	this.getCursor = function(figure) {
		this.mode = "figure";
		this.figure = figure;
		getFigureForCursor();
	}

	function getFigureForCursor() {
		if (self.mode !== "figure") return;

		let cursor = document.createElement('canvas');
		let ctxCurs = cursor.getContext('2d');
		cursor.width = self.size + 2;
		cursor.height = self.size + 2;
		ctxCurs.strokeStyle = self.fillColor;

		getFigure(ctxCurs, self.size, self.figure, 1, 1);

		self.setCursor(cursor.toDataURL());
	}
}


function Paint(canvas, options) {
	this.canvas = canvas;
	this.options = options;

	options.paintings.push(this);
	// set cursor from options for new created paint
	options.setCursor(options.cursor);

	let self = this;

	canvas.addEventListener('mousedown', function(event) {
		self.mouseMoveHandler(event);
		self.drawFigure(event);
	});

	window.addEventListener('mouseup', function() {		
		canvas.onmousemove = null;
	});

	this.clear = function(canvas) {
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		getPreviewLayer(canvas, "none");
	}

	this.drawFigure = function(event) {
		if (self.options.mode !== "figure") return;
		const ctx = canvas.getContext('2d');
		ctx.strokeStyle = self.options.fillColor;
		ctx.fillStyle = self.options.fillColor;
		getFigure(ctx, self.options.size, self.options.figure, event.offsetX, event.offsetY);
		getPreviewLayer(event.path[0], "url(" + canvas.toDataURL() + ")");
	}

	this.mouseMoveHandler = function(event) {
		if (self.options.mode !== "brush") return;
		if (canvas && canvas.getContext) {
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = self.options.fillColor;

			canvas.onmousemove = function(event) {
				ctx.fillRect(event.offsetX - self.options.size / 2, event.offsetY - self.options.size / 2, self.options.size, self.options.size);
			};
			canvas.onmouseup = function() {
				getPreviewLayer(canvas, "url(" + canvas.toDataURL() + ")");
				canvas.onmousemove = null;
			}
		}
	}

	function getPreviewLayer(canvas, str) {
		const arrayLayersElem = canvas.parentElement.querySelector(".layer.active");
		const layerPreviewElem = arrayLayersElem.querySelector(".layer__preview");
		layerPreviewElem.style.backgroundImage = str;
	}
}

function getFigure(ctx, size, figure, x, y) {
	let side = Math.sqrt(Math.pow(size / 2, 2) - Math.pow(size / 4, 2));

	switch (figure) {
		case "circle":
		ctx.beginPath();
		ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 13 * Math.PI / 2);	
		ctx.stroke();
		break;
		case "square":
		ctx.beginPath();
		ctx.strokeRect(x, y, size, size);
		break;
		case "triangle":
		ctx.beginPath();
		ctx.moveTo(x + size / 2, y);
		ctx.lineTo(x, y + Math.sqrt(Math.pow(size, 2) - Math.pow(size / 2, 2)));
		ctx.lineTo(x + size, y + Math.sqrt(Math.pow(size, 2) - Math.pow(size / 2, 2)));
		ctx.lineTo(x + size / 2, y);
		ctx.stroke();
		break;
		case "hexagon":
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
	return ctx;
}


if (typeof module !== 'undefined') {
	module.exports = {
		Paint,
		PaintOptions, 
		getFigure
	};
}

