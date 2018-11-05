window.addEventListener("load", function() {
	initTabs();
	init();
});

function initTabs() {
	const tabBtnsElem = document.querySelector(".tab");
	const tabContentsElem = document.querySelector(".tab-contents");

	tabBtnsElem.addEventListener("click", (event) => {
		let tabsObj = new Tabs(tabBtnsElem, tabContentsElem);
		let target = event.target;

		if(target.closest('.tablinks__button')) {
			tabsObj.delete(target.closest('.tablinks'));
			return;
		}
		if (target.closest('.tablinks')) {
			if(target.closest('.tablinks').dataset.id === "add-tab") {
				tabsObj.add(tabBtnsElem.firstChild.nextSibling);
				return;
			}

			tabsObj.open(target.closest('.tablinks'));
			return;
		}
	});
}

function Tabs(tabBtnsElem, tabContentsElem) {
	this.add = function(btn) {
		Tabs.count++;
		let position = tabBtnsElem.children[tabBtnsElem.children.length - 1];
		let newTab = btn.cloneNode(true);
		newTab.dataset.id = "tab-" + Tabs.count;
		newTab.querySelector(".sheet-name").innerHTML = 'Sheet ' + Tabs.count;
		tabBtnsElem.insertBefore(newTab, position);
		addSheetForTab(newTab.dataset.id);
		this.open(newTab);
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
	}

	function addSheetForTab(id) {
		let newCanvasForTab = createSheet(id);
		tabContentsElem.appendChild(newCanvasForTab);
		addEventListeners(newCanvasForTab.querySelector(".canvas"));
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

Tabs.count = 1;









