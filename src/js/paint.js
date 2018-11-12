
function init() {
	addEventListeners();
	render();
}

function render() {
	const tabContentsElem = document.querySelector(".tab-contents");
	//const layerElem = tabContentsElem.querySelectorAll(".tabcontent");
	//console.log(tabContentsElem.querySelectorAll(".tabcontent"))
	let layer = new Layer();

	let arraySheets = JSON.parse(localStorage.getItem("CanvasSheets"));

	arraySheets.forEach((sheet) => {
		let tab = tabsObj.add();
		const layerElem = tab.querySelector(".layers-block__layers");
		console.log(layerElem)
		let canvas = tab.querySelector("canvas");
		console.log(canvas)
		let paintObj = canvas.paintObj;

		paintObj.setColor(sheet.fillColor);
		paintObj.setSize(sheet.size);
		paintObj.mode = sheet.mode;
		paintObj.figure = sheet.figure;
		paintObj.setCursor(sheet.cursor);

		let ctx = canvas.getContext('2d');
		for (let i = 0; i < sheet.layers.length; i++) {
			//console.log(sheet.layers[i])
			layer.renderLayer(sheet.layers[i].idOfLayer, layerElem);
			let img = new Image;
			img.src = sheet.layers[i].image;
			img.onload = function () {
				ctx.drawImage(img, 0, 0);
			};
		}

		tabsObj.onOpen(tab);
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

	tabContentsElem.addEventListener('mousemove', function(event) {
		if (event.target.tagName !== "CANVAS") return;
		canvasCoordXElem.innerHTML = event.offsetX;
		canvasCoordYElem.innerHTML = event.offsetY;
	});

	tabsObj.onOpen = function(tab) {
		let paintObj = tab.querySelector("canvas").paintObj;
		outputElem.value = rngElem.value = paintObj.size;
		colorElem.value = paintObj.fillColor;
	}

	colorElem.addEventListener('input', function() {
		let canvas = getActiveCanvas();
		canvas.paintObj.setColor(colorElem.value);
	});

	rngElem.addEventListener('input', function() {
		outputElem.value = rngElem.value;

		let canvas = getActiveCanvas();
		canvas.paintObj.setSize(this.value);
	});

	btnClearElem.addEventListener('click', function() {
		let canvas = getActiveCanvas();
		canvas.paintObj.clear();
	});

	btnBrushElem.addEventListener('click', function() {
		let canvas = getActiveCanvas();
		canvas.paintObj.setMode("brush");
	});

	dropDownElem.addEventListener('click', function(event) {
		let target = event.target;
		if (target.tagName != 'SPAN') return;

		let canvas = getActiveCanvas();
		canvas.paintObj.getCursor(target.innerHTML);
	});

	window.addEventListener('beforeunload', function(e) {
		(e || window.event).returnValue = null;
		let canvases = document.querySelectorAll("canvas");
		if (!canvases && !canvases.length) return null;

		let arraySheets = [];
		canvases.forEach((canvas) => {
			let paintObj = canvas.paintObj;
			let arrayCanvas = canvas.parentElement.querySelectorAll("canvas");
			console.log(arrayCanvas)
			let temp = [];
			for (let i = 0; i < arrayCanvas.length; i++) {
				temp.push(arrayCanvas[i]);

			}
			let layers = getLayers(temp);
			temp = [];
			let sheet = {
				fillColor: paintObj.fillColor,
				size: paintObj.size,
				mode: paintObj.mode,
				figure: paintObj.figure,
				cursor: paintObj.cursor,
				layers
			};
			arraySheets.push(sheet);
		});
		localStorage.setItem("CanvasSheets", JSON.stringify(arraySheets));
	});
}

function getLayers(array) {
	let arrayOfCanvas = [];
	for (let i = 0; i < array.length; i++) {
		let temp = {
			idOfLayer: array[i].dataset.id,
			idOfTab: array[i].dataset.tabId,
			image: array[i].toDataURL(),
		}
		arrayOfCanvas.push(temp);
	}
	return arrayOfCanvas;
}

//function PaintOptions

function Paint(canvas) {
	this.canvas = canvas;
	this.fillColor = "#000000";
	this.mode = "brush";
	this.figure = "";
	this.size = 10;
	this.cursor = "auto";
	this.image = "";
	this.disabled = false;

	let self = this;

	canvas.addEventListener('mousedown', function(event) {
		if (self.disabled) return;
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

	this.getCursor = function(figure) {
		this.mode = "figure";
		this.figure = figure;
		getFigureForCursor();
	}

	this.setCursor = function(cursor) {
		self.cursor = cursor;

		if (cursor === "auto") {
			canvas.style.cursor = cursor;
			return;
		}
		canvas.style.cursor = 'url(' + cursor + '), auto';
	}

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

	this.drawFigure = function(event) {
		if (self.mode !== "figure") return;
		const ctx = canvas.getContext('2d');
		ctx.strokeStyle = self.fillColor;
		ctx.fillStyle = self.fillColor;
		getFigure(ctx, self.size, self.figure, event.offsetX, event.offsetY);
	}

	this.mouseMoveHandler = function(event) {
		if (self.mode !== "brush") return;
		if (canvas && canvas.getContext) {
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = self.fillColor;

			canvas.onmousemove = function(event) {
				ctx.fillRect(event.offsetX - self.size / 2, event.offsetY - self.size / 2, self.size, self.size);
			};
			canvas.onmouseup = function() {
				canvas.onmousemove = null;
			}
		}
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

