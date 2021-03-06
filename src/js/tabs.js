function initTabs() {
	const tabBtnsElem = document.querySelector(".tab");
	const tabContentsElem = document.querySelector(".tab-contents");
	let tabsObj = new Tabs(tabBtnsElem, tabContentsElem);
	window.tabsObj = tabsObj;

	tabBtnsElem.addEventListener("click", (event) => {
		let target = event.target;

		if(target.closest('.tablinks__close')) {
			tabsObj.delete(target.closest('.tablinks'));
			return;
		}
		if (target.closest('.tablinks')) {
			if(target.closest('.tablinks').dataset.id === "add-tab") {
				tabsObj.add();
				return;
			}

			tabsObj.open(target.closest('.tablinks'));
			return;
		}
	});
}

function Tabs(tabBtnsElem, tabContentsElem) {
	this.add = function(shouldCreateCanvas = true) {
		Tabs.count++;
		let newTab = document.createElement("div");
		newTab.className = "tablinks";
		newTab.dataset.id = "tab-" + Tabs.count;

		let span = document.createElement("span");
		span.className = "sheet-name";
		span.innerHTML = " " + Tabs.count;
		let spanForName = document.createElement("span");
		spanForName.dataset.lang = "Sheet";
		spanForName.innerHTML = langObj("Sheet");
		span.prepend(spanForName);

		let btnDel = document.createElement("div");
		btnDel.className = "tablinks__close";
		newTab.appendChild(span);
		newTab.appendChild(btnDel);

		let position = tabBtnsElem.children[tabBtnsElem.children.length - 1];
		tabBtnsElem.insertBefore(newTab, position);
		let tabCanvas = addSheetForTab(newTab.dataset.id, shouldCreateCanvas);
		this.open(newTab);
		return tabCanvas;
	}

	this.delete = function(tabBtn) {
		deleteTabContent(tabBtn.dataset.id);
		tabBtn.remove();
		if(tabBtn.closest(".active")) {
			this.open(tabBtnsElem.children[tabBtnsElem.children.length - 2]);
		}	
	}

	this.open = function(btn) {
		let tabContentsChildren = tabContentsElem.children;
		if (tabContentsChildren.length === 0) {
			return;
		}

		let tabBtnsChildren = tabBtnsElem.children;
		for (let i = 0; i < tabContentsChildren.length; i++) {
			tabContentsChildren[i].classList.remove("active");
			tabBtnsChildren[i].classList.remove("active");
		}
		const tab = document.getElementById(btn.dataset.id);
		tab.classList.add("active");
		btn.classList.add("active");
		this.onOpen(tab, btn);
	}

	this.onOpen = function() {}

	function addSheetForTab(id, shouldCreateCanvas) {
		let newSheetForTab = createSheet(id, shouldCreateCanvas);
		const layerElem = newSheetForTab.querySelector(".layers-block__layers");

		let paintOptions = new PaintOptions();
		newSheetForTab.paintOptions = paintOptions;

		if (shouldCreateCanvas) {
			let layer = new Layers();
			layer.add(newSheetForTab, layerElem, 1);
		}

		tabContentsElem.appendChild(newSheetForTab);
		return newSheetForTab;
	}

	function createSheet(id, shouldCreateCanvas) {
		let sheet = document.createElement("div");
		sheet.id = id;
		sheet.classList.add("tabcontent");

		let layerBlock = document.createElement("div");
		layerBlock.className = "layers-block";
		layerBlock.dataset.tabId = id;
		layerBlock.dataset.id = id + "__layers-block";

		let buttonsBlock = document.createElement("div");
		buttonsBlock.className = "layers-block__buttons";

		let btnAddLayer = document.createElement("button");
		btnAddLayer.className = "btn-layers add-layer";
		btnAddLayer.dataset.lang = "add";
		btnAddLayer.innerHTML = "add";
		buttonsBlock.appendChild(btnAddLayer)

		let layersBlockOfLayers = document.createElement("div");
		layersBlockOfLayers.className = "layers-block__layers";
		layerBlock.appendChild(buttonsBlock);
		layerBlock.appendChild(layersBlockOfLayers);
		sheet.appendChild(layerBlock);
		return sheet;
	}

	function deleteTabContent(id) {
		document.getElementById(id).remove();
	}
}

Tabs.count = 0;









