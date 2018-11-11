

function initLayers() {
	const btnAddLayerElem = document.querySelector(".add-layer");
	const btnDeleteLayerElem = document.querySelector(".delete-layer");
	const tabContentsElem = document.querySelector(".tab-contents");
	const layerElem = document.querySelector(".layers-block__layers");
	const layerBlockElem = document.querySelector(".layers-block");
	let layer = new Layer();

	btnAddLayerElem.addEventListener("click", function() {
		const activeTab = tabContentsElem.querySelector(".active");
		let newCanvas = layer.add(activeTab, layerElem);
		newCanvas.paintObj = new Paint(newCanvas);
	});

	layerBlockElem.addEventListener("click", (event) => {
		let target = event.target;

		if(target.closest('.layer__delete')) {
			layer.delete(target.closest('.layer__delete').parentElement, tabContentsElem);
			return;
		}
	});
}

function Layer() {
	this.add = function(activeTab, layerElem) {
		let count = activeTab.lastChild.dataset.id;
		++count;
		let canvas = createCanvas(activeTab.id, count);
		activeTab.appendChild(canvas);
		let layer = createLayer(count);
		let allLayers = document.querySelectorAll(".layer");
		for (let i = 0; i < allLayers.length; i++) {
			allLayers[i].classList.remove("active");
		}
		layer.classList.add("active");
		layerElem.appendChild(layer);

		return canvas;
	}
	this.delete = function(parentElem, tabContentsElem) {
		deleteCanvas(parentElem.dataset.id, tabContentsElem);
		parentElem.remove();
	}

	function createLayer(count) {
		let layer = document.createElement("div");
		layer.className = "layer";
		layer.id = "layer-" + count;
		layer.dataset.id = count;
		let layerNumber = document.createElement("span");
		layerNumber.className = "layer__number";
		layerNumber.innerHTML = count;
		let layerPreview = document.createElement("div");
		layerPreview.className = "layer__preview";
		let layerBasket = document.createElement("div");
		layerBasket.className = "layer__delete";
		layer.appendChild(layerNumber);
		layer.appendChild(layerPreview);
		layer.appendChild(layerBasket);
		return layer;
	}

	function createCanvas(id, count) {
		let canvas = document.createElement("canvas");
		canvas.classList.add("canvas");
		canvas.id = "canvas-" + id + "__layer-" + count;
		canvas.dataset.id = count;
		canvas.width = "650";
		canvas.height = "650";
		return canvas;
	}

	function deleteCanvas(id, tabContentsElem) {
		const allCanvasesInActiveTab = tabContentsElem.querySelector(".active").querySelectorAll("canvas");
		for (let i = 0; i < allCanvasesInActiveTab.length; i++) {
			if (allCanvasesInActiveTab[i].dataset.id === id) {
				allCanvasesInActiveTab[i].remove();
				return;
			}
		}
	}
}
