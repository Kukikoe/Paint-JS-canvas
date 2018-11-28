const paint = require('../src/js/paint.js');
const assert = require('assert');
const chai = require('chai');
const jsdom = require('jsdom-global');
const sinon = require('sinon');

function getSinonStubs() {
	const ctx = {
		beginPath: () => false,
		arc: () => "",
		stroke: () => "",
		lineTo: () => "",
		moveTo: () => "",
		strokeRect: () => ""
	};
	const ctxStub = {
		ctx: ctx,
		beginPathStub: sinon.stub(ctx, 'beginPath'),
		arcStub : sinon.stub(ctx, 'arc'),
		strokeStub : sinon.stub(ctx, 'stroke'),
		lineToStub : sinon.stub(ctx, 'lineTo'),
		moveToStub : sinon.stub(ctx, 'moveTo'),
		strokeRectStub : sinon.stub(ctx, 'strokeRect')
	}
	return ctxStub;
}

describe('getFigure', () => {
	describe('should be able to call ctx method', () => {
		it('circle', () => {
			let size = 10, 
			figure = "circle", 
			x = 15, 
			y = 20;
			let ctxStub = getSinonStubs();
			paint.getFigure(ctxStub.ctx, size, figure, x, y);

			assert.deepEqual(ctxStub.beginPathStub.calledOnce, true);
			assert.deepEqual(ctxStub.arcStub.calledOnce, true);
			assert.deepEqual(ctxStub.strokeStub.calledOnce, true);
		});
		it('square', () => {
			let size = 10, 
			figure = "square", 
			x = 15, 
			y = 23;
			let ctxStub = getSinonStubs();
			paint.getFigure(ctxStub.ctx, size, figure, x, y);

			assert.deepEqual(ctxStub.beginPathStub.calledOnce, true);
			assert.deepEqual(ctxStub.strokeRectStub.calledOnce, true);
		});
		it('triangle', () => {
			let size = 10, 
			figure = "triangle", 
			x = 15, 
			y = 23;
			let ctxStub = getSinonStubs();
			paint.getFigure(ctxStub.ctx, size, figure, x, y);

			assert.deepEqual(ctxStub.beginPathStub.calledOnce, true);
			assert.deepEqual(ctxStub.moveToStub.calledOnce, true);
			assert.deepEqual(ctxStub.lineToStub.calledThrice, true);
			assert.deepEqual(ctxStub.strokeStub.calledOnce, true);
		});
		it('hexagon', () => {
			let size = 10, 
			figure = "hexagon", 
			x = 10, 
			y = 20;
			let ctxStub = getSinonStubs();
			paint.getFigure(ctxStub.ctx, size, figure, x, y);

			assert.deepEqual(ctxStub.beginPathStub.calledOnce, true);
			assert.deepEqual(ctxStub.moveToStub.calledOnce, true);
			assert.deepEqual(ctxStub.lineToStub.callCount, 6);
			assert.deepEqual(ctxStub.strokeStub.calledOnce, true);
		});
	});
});

describe('paint constructor PaintOptions', function () {
	jsdom();
	const option = new paint.PaintOptions();
	it('must match initial parameters', function () {
		chai.expect(option.mode).to.equal("brush");
		chai.expect(option.fillColor).to.equal("#000000");
		chai.expect(option.figure).to.equal("");
		chai.expect(option.size).to.equal(10);
		chai.expect(option.cursor).to.equal("auto");
		chai.expect(option.image).to.equal("");
		assert.deepEqual(option.paintings, []);
});
	it('method setCursor', function () {
		option.setCursor('circle');
		chai.expect(option.cursor).to.equal("circle");
	});
	it('method setMode', function () {
		option.setMode('figure');
		chai.expect(option.mode).to.equal("figure");
		chai.expect(option.cursor).to.equal("auto");
	});
	it('method setColor', function () {
		option.setColor('#ffffff');
		chai.expect(option.fillColor).to.equal("#ffffff");
	});
	it('method setSize', function () {
		option.setSize("24");
		chai.expect(option.size).to.equal(24);
	});
});

HTMLCanvasElement.prototype.getContext = () => { 
	return "";
};

HTMLCanvasElement.prototype.toDataURL = () => {
	return "";
};
