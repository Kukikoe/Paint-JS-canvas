function getFigure(ctx, size, figure, x, y) {
	let side = Math.sqrt(Math.pow(size / 2, 2) - Math.pow(size / 4, 2));

	switch (figure) {
		case "Circle":
		ctx.beginPath();
		ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 13 * Math.PI / 2);	
		ctx.stroke();
		break;
		case "Square":
		ctx.beginPath();
		ctx.strokeRect(x, y, size, size);
		break;
		case "Triangle":
		ctx.beginPath();
		ctx.moveTo(x + size / 2, y);
		ctx.lineTo(x, y + Math.sqrt(Math.pow(size, 2) - Math.pow(size / 2, 2)));
		ctx.lineTo(x + size, y + Math.sqrt(Math.pow(size, 2) - Math.pow(size / 2, 2)));
		ctx.lineTo(x + size / 2, y);
		ctx.stroke();
		break;
		case "Hexagon":
		ctx.beginPath();
		ctx.moveTo(x + size / 4, y - side  + size / 2);
		ctx.lineTo(x, y + size / 2);
		ctx.lineTo(x + size / 4, y + side  + size / 2);
		ctx.lineTo(x + size / 4 + size / 2, y + side  + size / 2);
		ctx.lineTo(x + size, y  + size / 2);
		ctx.lineTo(x + size / 4 + size / 2, y - side  + size / 2);
		ctx.lineTo(x + size / 4, y - side  + size / 2);
		ctx.stroke();
		break;	
	}
	return ctx;
}
module.exports = getFigure;