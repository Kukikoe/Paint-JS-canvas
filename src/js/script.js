window.addEventListener("load", function() {
	initTabs();
	initPaint();
	initLayers();
	render();
});

function render() {
	let arraySheets = JSON.parse(localStorage.getItem("CanvasSheets")) || [];

	arraySheets.forEach((tab) => {
		const tabElem = tabsObj.add(false);
		let layer = new Layers();

		const layerElem = tabElem.querySelector(".layers-block__layers");

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
		let paintOptions = tabElem.paintOptions;
		paintOptions.setColor(tab.paintOptions.fillColor);
		paintOptions.setSize(tab.paintOptions.size);
		paintOptions.mode = tab.paintOptions.mode;
		paintOptions.figure = tab.paintOptions.figure;
		paintOptions.setCursor(tab.paintOptions.cursor);

		tabsObj.onOpen(tabElem);
	});
}

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