function Cell(r, c) {
  this.row = r;
  this.col = c;
  this.links = [];
}

Cell.prototype.getRow = function () {
  return this.row;
};

Cell.prototype.getCol = function () {
  return this.col;
};

Cell.prototype.link = function (cell, bidi) {
  this.links.push(cell);
  if (typeof bidi === 'undefined' || !!bidi) cell.link(this, false);
};

Cell.prototype.unlink = function (cell, bidi) {
  var i = this.links.indexOf(cell);
  if (i >= 0)
    this.links.splice(i, 1);
  if (typeof bidi === 'undefined' || !!bidi) cell.unlink(this, false);
};

Cell.prototype.isLinked = function (cell) {
  return this.links.indexOf(cell) >= 0;
};

Cell.prototype.toString = function () {
  return "c("+this.row+","+this.col+")";
};

module.exports = Cell;
