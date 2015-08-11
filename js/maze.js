var Cell = require('./cell');
var Grid = require('./grid');

function rand(limit) {
  return Math.floor(Math.random() * limit);
}

function binaryTree (rows, cols) {
  var grid = new Grid(rows, cols);
  grid.eachCell().forEach(function (cell) {
    var neighbors = [];

    var north = grid.northOf(cell);
    if (north) neighbors.push(north);

    var east = grid.eastOf(cell);
    if (east) neighbors.push(east);

    if (neighbors.length > 0) {
      var index = rand(neighbors.length);
      cell.link(neighbors[index]);
    }
  });
  return grid;
}

function sidewinder (rows, cols) {
  var grid = new Grid(rows, cols);
  grid.eachRow().forEach(function (row) {
    var run = [];
    row.forEach(function (cell) {
      run.push(cell);
      var isAtEasternBoundary = !grid.eastOf(cell),
          isAtNorthernBoundary = !grid.northOf(cell),
          shouldCloseOut = isAtEasternBoundary || (!isAtNorthernBoundary && rand(2) == 0);
      if (shouldCloseOut) {
        var member = run[rand(run.length)];
        if (grid.northOf(member)) member.link(grid.northOf(member));
        run = [];
      } else {
        cell.link(grid.eastOf(cell));
      }
    });
  });
  return grid;
}

function maze(algorithm) {
  switch(algorithm) {
  case 'binaryTree': return binaryTree;
  case 'sidewinder': return sidewinder;
  default:
    throw new 'not supported algorithm';
  }
}

window.onload = function (e) {
  var mz,
      rows = 10, cols = 10;
  mz = maze('binaryTree')(rows, cols);
  mz.draw({canvasId: 'canvas-binary-tree', cellSize: 20});
  // console.log(mz.toString());
  var distances = mz.distances();
  console.log(mz.toString(function (cell) {
    return distances.get(cell);
  }));
  mz = maze('sidewinder')(rows, cols).draw({canvasId: 'canvas-sidewinder', cellSize: 20});
};
