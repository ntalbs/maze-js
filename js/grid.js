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

Grid.prototype.draw = function (canvasId, cellSize) {
  var self = this,
      canvas = document.getElementById(canvasId),
      g = canvas.getContext("2d"),
      drawLine = function (x1, y1, x2, y2, color) {
        g.strokeStyle = !!color ? color : 'black';
        g.beginPath();
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        g.lineWidth = 1;
        g.stroke();
      };

  canvas.width = cellSize * this.grid[0].length + 1;
  canvas.height = cellSize * this.grid.length + 1;

  g.translate(0.5, 0.5);

  this.eachCell().forEach(function (cell) {
    var x1 = cell.col * cellSize,
        y1 = cell.row * cellSize,
        x2 = (cell.col + 1) * cellSize,
        y2 = (cell.row + 1) * cellSize;
    if (!self.northOf(cell)) drawLine(x1, y1, x2, y1);
    if (!self.westOf(cell)) drawLine(x1, y1, x1, y2);
    if (!cell.isLinked(self.eastOf(cell))) drawLine(x2, y1, x2, y2);
    if (!cell.isLinked(self.southOf(cell))) drawLine(x1, y2, x2, y2);
  });
};

module.exports = Grid;
