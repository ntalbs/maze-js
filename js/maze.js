var Cell = require('./cell');
var Grid = require('./grid');

function rand(limit) {
  return Math.floor(Math.random() * limit);
}

function maze(algorithm) {
  switch(algorithm) {
  case 'binaryTree' :
    return function (rows, cols) {
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
    };
  default:
    throw new 'not supported algorithm';
  }
}

var mz = maze('binaryTree')(10,10);

console.log(mz.toString());

window.onload = function (e) {
  mz.draw('canvas1', 30);
};
