var Cell = require('./cell');
var Grid = require('./grid');

function rand(limit) {
  return Math.floor(Math.random() * limit);
}

function binaryTree(rows, cols) {
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

console.log('start...');
console.log(binaryTree(10,10).toString());
console.log('end...');
