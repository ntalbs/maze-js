function Distance(root) {
  this.root = root;
  this.cells = {};
  this.cells[root] = 0;
}

Distance.prototype.get = function (cell) {
  return this.cells[cell];
};

Distance.prototype.set = function (cell, distance) {
  this.cells[cell] = distance;
};

module.exports = Distance;
