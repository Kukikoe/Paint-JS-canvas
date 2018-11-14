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
		if (target.tagName != 'SPAN') return;

		let tab = getActiveTab();
		tab.paintOptions.getCursor(target.innerHTML);
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

