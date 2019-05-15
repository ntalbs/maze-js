import Grid from './grid'
import rand from './rand'

function sample (arr) {
  return arr[rand(arr.length)]
}

function binaryTree (rows, cols) {
  let grid = new Grid(rows, cols)
  grid.eachCell().forEach(function (cell) {
    let neighbors = []

    let north = grid.northOf(cell)
    if (north) neighbors.push(north)

    let east = grid.eastOf(cell)
    if (east) neighbors.push(east)

    if (neighbors.length > 0) {
      let index = rand(neighbors.length)
      cell.link(neighbors[index])
    }
  })
  return grid
}

function sidewinder (rows, cols) {
  let grid = new Grid(rows, cols)
  grid.eachRow().forEach(function (row) {
    let run = []
    row.forEach(function (cell) {
      run.push(cell)
      let isAtEasternBoundary = !grid.eastOf(cell)
      let isAtNorthernBoundary = !grid.northOf(cell)
      let shouldCloseOut = isAtEasternBoundary || (!isAtNorthernBoundary && rand(2) === 0)
      if (shouldCloseOut) {
        let member = run[rand(run.length)]
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
  let grid = new Grid(rows, cols)
  let unvisited = rows * cols - 1
  let current = grid.randomCell()

  while (unvisited > 0) {
    let neighbor = sample(grid.neighborsOf(current))
    if (neighbor.links.length === 0) {
      current.link(neighbor)
      unvisited -= 1
    }
    current = neighbor
  }
  return grid
}

function pick (arr) {
  let r = rand(arr.length)
  return arr[r]
}

function wilsons (rows, cols) {
  let grid = new Grid(rows, cols)
  let unvisited = grid.eachCell()
  let first = pick(unvisited)
  unvisited = unvisited.filter(function (c) {
    return c !== first
  })

  while (unvisited.length !== 0) {
    let cell = pick(unvisited)
    let path = [cell]
    while (unvisited.includes(cell)) {
      cell = pick(grid.neighborsOf(cell))
      let position = path.indexOf(cell)
      if (position >= 0) {
        path = path.filter(function (c, i) { return i <= position })
      } else {
        path.push(cell)
      }
    }
    for (let i = 0; i < path.length - 1; i++) {
      path[i].link(path[i + 1])
      unvisited = unvisited.filter(function (c) {
        return path[i] !== c
      })
    }
  }
  return grid
}

function recursiveBacktracker (rows, cols) {
  let grid = new Grid(rows, cols)
  let stack = []
  let startAt = grid.randomCell()
  stack.push(startAt)
  while (stack.length !== 0) {
    let current = stack[stack.length - 1]
    let neighbors = grid.neighborsOf(current).filter(function (c) {
      return c.links.length === 0
    })
    if (neighbors.length === 0) {
      stack.pop()
    } else {
      let neighbor = pick(neighbors)
      current.link(neighbor)
      stack.push(neighbor)
    }
  }
  return grid
}

function huntAndKill (rows, cols) {
  let grid = new Grid(rows, cols)
  let current = grid.randomCell()
  while (current) {
    let unvisitedNeighbors = grid.neighborsOf(current).filter(function (c) {
      return c.links.length === 0
    })
    let neighbor
    if (unvisitedNeighbors.length !== 0) {
      neighbor = pick(unvisitedNeighbors)
      current.link(neighbor)
      current = neighbor
    } else {
      current = null
      let cells = grid.eachCell()
      for (let i = 0; i < cells.length; i++) {
        let visitedNeighbors = grid.neighborsOf(cells[i]).filter(function (c) {
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

function createMazeTile (title, id) {
  let tile = document.createElement('div')
  tile.className = 'maze-box'

  let markup = [
    `<h2>${title}</h2>`,
    `<canvas id="${id}"></canvas>`
  ].join('')

  tile.innerHTML = markup
  return tile
}

window.onload = function (e) {
  let rows = 20
  let cols = 20
  let container = document.getElementsByClassName('container')[0]
  let algorithms = [
    {h: 'Binary Tree', f: binaryTree},
    {h: 'Sidewinder', f: sidewinder},
    {h: 'Aldous-Broder', f: aldousBroder},
    {h: 'Wilsons', f: wilsons},
    {h: 'Recursive Backtracker', f: recursiveBacktracker},
    {h: 'Hunt and Kill', f: huntAndKill}
  ]

  algorithms.forEach(algorithm => {
    let h = algorithm.h
    let id = algorithm.f.name
    let tile = createMazeTile(h, id)
    container.append(tile)

    let mz = algorithm.f(rows, cols)
    mz.draw({
      colorize: true,
      labelDistance: false,
      cellSize: 15,
      canvas: document.getElementById(id)
    })
  })
}
