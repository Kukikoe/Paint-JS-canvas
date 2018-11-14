function initLayers() {
	const btnAddLayerElem = document.querySelector(".add-layer");
	const tabContentsElem = document.querySelector("#tab-contents");
	const btnDeleteLayerElem = document.querySelector(".delete-layer");
	const layerBlockElem = document.querySelector(".layers-block");

	let layer = new Layers();

	tabContentsElem.addEventListener("click", function() {
		let target = event.target;

		if(target.closest('.add-layer')) {
			const tabContentActiveElem = document.querySelector(".tabcontent.active");
			const layerElem = tabContentActiveElem.querySelector(".layers-block__layers");
			let newCanvas = layer.add(tabContentActiveElem, layerElem);
			return;
		}

		if(target.closest('.layer__delete')) {
			layer.delete(target.closest('.layer__delete').parentElement, tabContentsElem);
			return;
		}

		if(target.closest('.layer') && !target.closest('.layer__delete')) {
			const tabContentActiveElem = document.querySelector(".tabcontent.active");
			const allLayers = tabContentActiveElem.querySelectorAll(".layer");
			const arrayOfCanvas = tabContentActiveElem.querySelectorAll(".canvas");
			let activeTabId = tabContentActiveElem.id;
			let activeLayerId = target.closest('.layer').dataset.id;
			let canvasId = "canvas-" + activeTabId + "__layer-" + activeLayerId;
			const activeCanvas = document.getElementById(canvasId);

			for (let i = 0; i < arrayOfCanvas.length; i++) {
				arrayOfCanvas[i].classList.remove("active");
			}
			activeCanvas.classList.add("active");
			for (let i = 0; i < allLayers.length; i++) {
				allLayers[i].classList.remove("active");
			}
			target.closest('.layer').classList.add("active");
			return;
		}
	});
}

function Layers() {
	this.add = function(activeTab, layerElem, id) {
		const allLayers = activeTab.querySelectorAll(".layer");
		const allCanvases = activeTab.querySelectorAll(".canvas");

		let count = this.getId(id, allLayers);
		let canvas = createCanvas(activeTab.id, count);	

		this.makeActive(canvas, allCanvases);
		activeTab.appendChild(canvas);
		let layer = createLayer(count);

		this.makeActive(layer, allLayers);
		layerElem.appendChild(layer);

		let paintOptions = activeTab.paintOptions;
		canvas.paintObj = new Paint(canvas, paintOptions);
		return canvas;
	}

	this.getId = function(id, allLayers) {
		let count;
		if (id === undefined) {
			if (allLayers.length === 0) {
				count = 1;
			}
			else {
				count = allLayers[allLayers.length - 1].dataset.id;
				count++;
			}
		}
		else {
			count = id;
		}
		return count;
	}

	this.makeActive = function(elem, collection) {
		for (let i = 0; i < collection.length; i++) {
			collection[i].classList.remove("active");
		}
		elem.classList.add("active");
	}

	this.delete = function(layerElem, tabContentsElem) {
		const activeTabContent = tabContentsElem.querySelector(".tabcontent.active");
		const layerBlock = activeTabContent.querySelector(".layers-block__layers");

		deleteCanvas(layerElem.dataset.id, activeTabContent);
		layerElem.remove();
		if (!layerBlock.lastChild) return;
		layerBlock.lastChild.classList.add("active");
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
		canvas.dataset.tabId = id;
		canvas.width = "850";
		canvas.height = "650";
		return canvas;
	}

	function deleteCanvas(id, activeTabContent) {		
		const canvasId = "canvas-" + activeTabContent.id + "__layer-" + id;
		document.getElementById(canvasId).remove();
		activeTabContent.lastChild.classList.add("active");
	}
}
