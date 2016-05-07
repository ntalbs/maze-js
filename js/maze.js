var Cell = require('./cell'),
    Grid = require('./grid'),
    rand = require('./rand');

function sample(arr) {
  return arr[rand(arr.length)];
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

function aldousBroder (rows, cols) {
  var grid = new Grid(rows, cols),
      unvisited = rows * cols - 1,
      current = grid.randomCell();

  while (unvisited > 0) {
    var neighbor = sample(grid.neighborsOf(current));
    if (neighbor.links.length === 0) {
      current.link(neighbor);
      unvisited -= 1;
    }
    current = neighbor;
  }
  return grid;
}


window.onload = function (e) {
  var mz,
      rows = 10, cols = 10;
  mz = binaryTree(rows, cols);
  var distances = mz.distances();
  mz.draw({
    canvasId: 'canvas-binary-tree',
    cellSize: 20,
    contentOf: function (cell) {return distances.get(cell);}
  });

  // console.log(mz.toString(function (cell) {
  //   return distances.get(cell);
  // }));

  mz = sidewinder(rows, cols);
  distances = mz.distances();
  mz.draw({
    canvasId: 'canvas-sidewinder',
    cellSize: 20,
    contentOf: function (cell) {return distances.get(cell);}
  });

  mz = aldousBroder(rows, cols);
  distances = mz.distances();
  mz.draw({
    canvasId: 'canvas-aldous-broder',
    cellSize: 20,
    contentOf: function (cell) {return distances.get(cell);}
  });
};
