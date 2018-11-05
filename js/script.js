window.addEventListener("load", function() {
	initTabs();
	init();
});

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
	this.add = function() {
		Tabs.count++;
		let newTab = document.createElement("div");
		newTab.className = "tablinks";
		newTab.dataset.id = "tab-" + Tabs.count;

		let span = document.createElement("span");
		span.className = "sheet-name";
		span.innerHTML = 'Sheet ' + Tabs.count;

		let btnDel = document.createElement("div");
		btnDel.className = "tablinks__close";
		newTab.appendChild(span);
		newTab.appendChild(btnDel);

		let position = tabBtnsElem.children[tabBtnsElem.children.length - 1];
		tabBtnsElem.insertBefore(newTab, position);
		let tabCanvas = addSheetForTab(newTab.dataset.id);
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

	function addSheetForTab(id) {
		let newCanvasForTab = createSheet(id);
		let canvas = newCanvasForTab.querySelector("canvas");
		canvas.paintObj = new Paint(canvas);
		tabContentsElem.appendChild(newCanvasForTab);
		return newCanvasForTab;
		//console.dir(canvas)
		//addEventListeners(newCanvasForTab.querySelector(".canvas"));
	}

	function createSheet(id) {
		let sheet = document.createElement("div");
		sheet.id = id;
		sheet.classList.add("tabcontent");
		let canvas = document.createElement("canvas");
		canvas.classList.add("canvas");
		canvas.width = "650";
		canvas.height = "650";
		sheet.appendChild(canvas);
		return sheet;
	}

	function deleteTabContent(id) {
		document.getElementById(id).remove();
	}
}

Tabs.count = 0;









