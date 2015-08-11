var Cell = require('./cell'),
    Distance = require('./distance');

function Grid(rows, cols) {
  this.grid = [];
  for (var r = 0; r < rows; r++) {
    this.grid.push([]);
    for (var c = 0; c < cols; c++) {
      this.grid[r].push(new Cell(r, c));
    }
  }
}

Grid.prototype.eachRow = function () {
  var rows = [];
  for (var r = 0, rlen = this.grid.length; r < rlen; r++) {
    rows.push(this.grid[r]);
  }
  return rows;
};

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

Grid.prototype.distances = function (r, c) {
  var root = this.grid[r||0][c||0],
      distances = new Distance(root),
      frontier = [root];
  while (frontier.length !== 0) {
    var newFrontier = [];
    frontier.forEach(function (cell) {
      cell.links.forEach(function (linked) {
        if (typeof distances.get(linked) === 'number') return;
        distances.set(linked, distances.get(cell)+1);
        newFrontier.push(linked);
      });
    });
    frontier = newFrontier;
  }
  return distances;
};

Grid.prototype.toString = function (contentOf) {
  function body(cell) {
    if (!contentOf) return '   ';
    var content = contentOf(cell);
    if (typeof content !== 'number') return '   ';
    else if (content <  10) return '  '+ content;
    else if (content < 100) return ' ' + content;
    return content;
  }
  var output = '';
  var cols = this.grid[0].length;

  output += '+';
  for (var i = 0; i < cols; i++)
    output += '---+';
  output += '\n';

  for (var r = 0, rlen = this.grid.length; r < rlen; r++) {
    var row = this.grid[r];
    var top = '|', bottom = '+';
    for (var c = 0, clen = row.length; c < clen; c++) {
      var cell = row[c];
      var eastBoundary = cell.isLinked(this.eastOf(cell)) ? ' ' : '|';
      var southBoundary = cell.isLinked(this.southOf(cell)) ? '   ' : '---';
      var corner = '+';
      top += body(cell) + eastBoundary;
      bottom += southBoundary + corner;
    }
    output += top +'\n';
    output += bottom + '\n';
  }
  return output;
};

Grid.prototype.draw = function (param) {
  if (!param.canvasId)
    throw new 'requires canvasId';
  var canvasId = param.canvasId,
      cellSize = param.cellSize || 10;

  var self = this,
      canvas = document.getElementById(canvasId),
      g = canvas.getContext("2d"),
      drawLine = function (x1, y1, x2, y2, color) {
        g.strokeStyle = color || 'black';
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
