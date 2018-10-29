var CanvasMock = require('./CanvasMock.js');
var CtxMock = require('./CtxMock.js');
var getFigure = require('../js/getFigure.js');
var assert = require('assert');
var chai = require('chai');

describe('CanvasMock and CtxMock', () => {
    it('should be able to return width and height', () => {
      let canvas = new CanvasMock(500,600);
      assert.equal(canvas.width, 500);
      assert.equal(canvas.height, 600);
    });
    it('should be able to update mock for getContext', () => {
      let canvas = new CanvasMock(500,600);
      let ctx = canvas.getContext('2d');
      assert.equal(canvas.mock, '[getContext 2d]');
    });
});

describe('getFigure', () => {
	describe('should be able to return correct canvas', () => {
		it('circle', () => {
			let size = 10, 
					figure = "Circle", 
					x = 15, 
					y = 23;

			let testCanvas = new CanvasMock(500, 600);
			let testCtx = testCanvas.getContext('2d');

			let realCanvas = new CanvasMock(500, 600);
			let realCtx = realCanvas.getContext('2d');

			testCtx.beginPath();
			testCtx.arc(x + size / 2, y + size / 2, size / 2, 0, 13 * Math.PI / 2);	
			testCtx.stroke();

			assert.deepEqual(
				getFigure(realCtx, size, figure, x, y).mock, 
				testCanvas.mock, 
				[ '[getContext 2d]', '[beginPath]', '[arc ' + x + size / 2 + ', ' + y + size / 2 + ', ' + size / 2 + ', 0, ' + 13 * Math.PI / 2 + ']', '[stroke]' ]
				);
		});

		it('square', () => {
			let size = 10, 
				figure = "Square", 
				x = 15, 
				y = 23;

			let testCanvas = new CanvasMock(500, 600);
			let testCtx = testCanvas.getContext('2d');

			let realCanvas = new CanvasMock(500, 600);
			let realCtx = realCanvas.getContext('2d');

			testCtx.beginPath();
			testCtx.strokeRect(x, y, size, size);

			assert.deepEqual(
				getFigure(realCtx, size, figure, x, y).mock, 
				testCanvas.mock, 
				[ '[getContext 2d]', '[beginPath]', '[strokeRect ' + x + ', ' + y + ', ' + size + ', ' + size + ']' ]
				);
		});

		it('triangle', () => {
			let size = 10, 
					figure = "Triangle", 
					x = 15, 
					y = 23;

			let testCanvas = new CanvasMock(500, 600);
			let testCtx = testCanvas.getContext('2d');

			let realCanvas = new CanvasMock(500, 600);
			let realCtx = realCanvas.getContext('2d');

			testCtx.beginPath();
			testCtx.moveTo(x + size / 2, y);
			testCtx.lineTo(x, y + Math.sqrt(Math.pow(size, 2) - Math.pow(size / 2, 2)));
			testCtx.lineTo(x + size, y + Math.sqrt(Math.pow(size, 2) - Math.pow(size / 2, 2)));
			testCtx.lineTo(x + size / 2, y);
			testCtx.stroke();

			assert.deepEqual(
				getFigure(realCtx, size, figure, x, y).mock, 
				testCanvas.mock
				);
		});

		it('hexagon', () => {
			let size = 10, 
					figure = "Hexagon", 
					x = 15, 
					y = 23;
			let side = Math.sqrt(Math.pow(size / 2, 2) - Math.pow(size / 4, 2));

			let testCanvas = new CanvasMock(500, 600);
			let testCtx = testCanvas.getContext('2d');

			let realCanvas = new CanvasMock(500, 600);
			let realCtx = realCanvas.getContext('2d');

			testCtx.beginPath();
			testCtx.moveTo(x + size / 4, y - side  + size / 2);
			testCtx.lineTo(x, y + size / 2);
			testCtx.lineTo(x + size / 4, y + side  + size / 2);
			testCtx.lineTo(x + size / 4 + size / 2, y + side  + size / 2);
			testCtx.lineTo(x + size, y  + size / 2);
			testCtx.lineTo(x + size / 4 + size / 2, y - side  + size / 2);
			testCtx.lineTo(x + size / 4, y - side  + size / 2);
			testCtx.stroke();

			assert.deepEqual(
				getFigure(realCtx, size, figure, x, y).mock, 
				testCanvas.mock
				);
		});
	});
});