var Cell = require('./cell');

function Grid(rows, cols) {
  this.grid = [];
  for (var r = 0; r < rows; r++) {
    this.grid.push([]);
    for (var c = 0; c < cols; c++) {
      this.grid[r].push(new Cell(r, c));
    }
  }
}

Grid.prototype.eachCell = function () {
  var cells = [];
  for (var r = 0, rlen = this.grid.length; r < rlen; r++) {
    for (var c = 0, clen = this.grid[r].length; c < clen; c++) {
      cells.push(this.grid[r][c]);
    }
  }
  return cells;
};

Grid.prototype.northOf = function (cell) {
  var r = cell.getRow() - 1;
  if (r < 0) {
    return null;
  }
  return this.grid[r][cell.getCol()];
};

Grid.prototype.eastOf = function (cell) {
  var r = cell.getRow(),
      c = cell.getCol() + 1;
  if (c >= this.grid[r].length) {
    return null;
  }
  return this.grid[r][c];
};

Grid.prototype.southOf = function (cell) {
  var r = cell.getRow() + 1;
  if (r >= this.grid.length) {
    return null;
  }
  return this.grid[r][cell.getCol()];
};

Grid.prototype.westOf = function (cell) {
  var c = cell.getCol() - 1;
  if (c < 0) {
    return null;
  }
  return this.grid[cell.getRow()][c];
};

Grid.prototype.toString = function () {
  var output = '';
  var cols = this.grid[0].length;

  output += '+';
  for (var i = 0; i < cols; i++)
    output += '---+';
  output += '\n';

  for (var r = 0, rlen = this.grid.length; r < rlen; r++) {
    var row = this.grid[r];
    var top = '|', bottom = '+', body = '   ';
    for (var c = 0, clen = row.length; c < clen; c++) {
      var cell = row[c];
      var eastBoundary = cell.isLinked(this.eastOf(cell)) ? ' ' : '|';
      var southBoundary = cell.isLinked(this.southOf(cell)) ? '   ' : '---';
      var corner = '+';
      top += body + eastBoundary;
      bottom += southBoundary + corner;
    }
    output += top +'\n';
    output += bottom + '\n';
  }
  return output;
};

module.exports = Grid;
