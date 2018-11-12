
function init() {
	addEventListeners();
	render();
}

function render() {
	const tabContentsElem = document.querySelector("#tab-contents");
	let arraySheets = JSON.parse(localStorage.getItem("CanvasSheets"));

	arraySheets.forEach((tab) => {
		const tabElem = tabsObj.add(false);
		let layer = new Layers();

		const layerElem = tabElem.querySelector(".layers-block__layers");
		

		let paintOptions = tabElem.paintOptions;

		paintOptions.setColor(tab.paintOptions.fillColor);
		paintOptions.setSize(tab.paintOptions.size);
		paintOptions.mode = tab.paintOptions.mode;
		paintOptions.figure = tab.paintOptions.figure;
		paintOptions.setCursor(tab.paintOptions.cursor);

		for (let i = 0; i < tab.layers.length; i++) {
			let canvas = layer.add(tabElem, layerElem, tab.layers[i].id);
			const arrayLayersElem = tabElem.querySelectorAll(".layer");
			const layerPreviewElem = arrayLayersElem[i].querySelector(".layer__preview");
			let ctx = canvas.getContext('2d');
			let img = new Image;
			img.src = tab.layers[i].image;
			layerPreviewElem.style.backgroundImage = "url(" + tab.layers[i].image + ")";
			img.onload = function () {
				ctx.drawImage(img, 0, 0);
			};
		}

		tabsObj.onOpen(tabElem);
	});
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
		let tab = getActiveTab();
		tab.paintOptions.clear();
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

	window.addEventListener('beforeunload', function(e) {
		//(e || window.event).returnValue = null;
		const tabs = document.querySelectorAll(".tabcontent");
		if (!tabs && !tabs.length) return null;

		let arraySheets = [];
		tabs.forEach((tab) => {
			let paintOptions = tab.paintOptions;
			let arrayCanvas = tab.querySelectorAll("canvas");
			let layers = getLayers(arrayCanvas);

			let sheet = {
				paintOptions: {
					fillColor: paintOptions.fillColor,
					size: paintOptions.size,
					mode: paintOptions.mode,
					figure: paintOptions.figure,
					cursor: paintOptions.cursor
				},
				layers
			};
			arraySheets.push(sheet);
		});
		localStorage.setItem("CanvasSheets", JSON.stringify(arraySheets));
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

	let self = this;

	canvas.addEventListener('mousedown', function(event) {
		self.mouseMoveHandler(event);
		self.drawFigure(event);
	});

	window.onmouseup = function() {
		canvas.onmousemove = null;
	}

	this.clear = function() {
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	this.drawFigure = function(event) {
		if (self.options.mode !== "figure") return;
		const ctx = canvas.getContext('2d');
		ctx.strokeStyle = self.options.fillColor;
		ctx.fillStyle = self.options.fillColor;
		getFigure(ctx, self.options.size, self.options.figure, event.offsetX, event.offsetY);
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
				canvas.onmousemove = null;
			}
		}
	}
}

