
class CtxMock {
  constructor(mock) {
    this.mock = mock
  }

  beginPath() {
    this.mock.push('[beginPath]')
  }

  moveTo(x, y) {
    this.mock.push('[moveTo ' + x + ', ' + y + ']')
  }

  lineTo(x, y) {
    this.mock.push('[lineTo ' + x + ', ' + y + ']')
  }

  arc(x, y, radius, sAngle, eAngle) {
    this.mock.push('[arc ' + x + ', ' + y + ', ' + radius + ', ' + sAngle + ', ' + eAngle + ']')
  }

  strokeRect(x, y, width, height) {
    this.mock.push('[strokeRect ' + x + ', ' + y + ', ' + width + ', ' + height + ']')
  }

  stroke() {
    this.mock.push('[stroke]')
  }
}

module.exports = CtxMock;
