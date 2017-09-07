const Grid = require('./grid')
const rand = require('./rand')

function sample (arr) {
  return arr[rand(arr.length)]
}

function binaryTree (rows, cols) {
  var grid = new Grid(rows, cols)
  grid.eachCell().forEach(function (cell) {
    var neighbors = []

    var north = grid.northOf(cell)
    if (north) neighbors.push(north)

    var east = grid.eastOf(cell)
    if (east) neighbors.push(east)

    if (neighbors.length > 0) {
      var index = rand(neighbors.length)
      cell.link(neighbors[index])
    }
  })
  return grid
}

function sidewinder (rows, cols) {
  var grid = new Grid(rows, cols)
  grid.eachRow().forEach(function (row) {
    var run = []
    row.forEach(function (cell) {
      run.push(cell)
      var isAtEasternBoundary = !grid.eastOf(cell)
      var isAtNorthernBoundary = !grid.northOf(cell)
      var shouldCloseOut = isAtEasternBoundary || (!isAtNorthernBoundary && rand(2) === 0)
      if (shouldCloseOut) {
        var member = run[rand(run.length)]
        if (grid.northOf(member)) member.link(grid.northOf(member))
        run = []
      } else {
        cell.link(grid.eastOf(cell))
      }
    })
  })
  return grid
}

function aldousBroder (rows, cols) {
  var grid = new Grid(rows, cols)
  var unvisited = rows * cols - 1
  var current = grid.randomCell()

  while (unvisited > 0) {
    var neighbor = sample(grid.neighborsOf(current))
    if (neighbor.links.length === 0) {
      current.link(neighbor)
      unvisited -= 1
    }
    current = neighbor
  }
  return grid
}

function pick (arr) {
  var r = rand(arr.length)
  return arr[r]
}

function wilsons (rows, cols) {
  var grid = new Grid(rows, cols)
  var unvisited = grid.eachCell()
  var first = pick(unvisited)
  unvisited = unvisited.filter(function (c) {
    return c !== first
  })

  while (unvisited.length !== 0) {
    var cell = pick(unvisited)
    var path = [cell]
    while (unvisited.includes(cell)) {
      cell = pick(grid.neighborsOf(cell))
      var position = path.indexOf(cell)
      if (position >= 0) {
        path = path.filter(function (c, i) { return i <= position })
      } else {
        path.push(cell)
      }
    }
    for (var i = 0; i < path.length - 1; i++) {
      path[i].link(path[i + 1])
      unvisited = unvisited.filter(function (c) {
        return path[i] !== c
      })
    }
  }
  return grid
}

function recursiveBacktracker (rows, cols) {
  var grid = new Grid(rows, cols)
  var stack = []
  var startAt = grid.randomCell()
  stack.push(startAt)
  while (stack.length !== 0) {
    var current = stack[stack.length - 1]
    var neighbors = grid.neighborsOf(current).filter(function (c) {
      return c.links.length === 0
    })
    if (neighbors.length === 0) {
      stack.pop()
    } else {
      var neighbor = pick(neighbors)
      current.link(neighbor)
      stack.push(neighbor)
    }
  }
  return grid
}

function huntAndKill (rows, cols) {
  var grid = new Grid(rows, cols)
  var current = grid.randomCell()
  while (current) {
    var unvisitedNeighbors = grid.neighborsOf(current).filter(function (c) {
      return c.links.length === 0
    })
    if (unvisitedNeighbors.length !== 0) {
      var neighbor = pick(unvisitedNeighbors)
      current.link(neighbor)
      current = neighbor
    } else {
      current = null
      var cells = grid.eachCell()
      for (var i = 0; i < cells.length; i++) {
        var visitedNeighbors = grid.neighborsOf(cells[i]).filter(function (c) {
          return c.links.length !== 0
        })
        if (cells[i].links.length === 0 && visitedNeighbors.length !== 0) {
          current = cells[i]
          neighbor = pick(visitedNeighbors)
          current.link(neighbor)
          break
        }
      }
    }
  }
  return grid
}

window.onload = function (e) {
  var rows = 20
  var cols = 20
  var algorithms = [binaryTree, sidewinder, aldousBroder, wilsons, recursiveBacktracker, huntAndKill]

  algorithms.forEach(function (algorithm) {
    var name = algorithm.name
    var mz = algorithm(rows, cols)
    mz.draw({
      colorize: true,
      // labelDistance: true,
      cellSize: 15,
      canvas: document.getElementById(name)
    })
  })
}
