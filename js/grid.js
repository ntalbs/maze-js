var Cell = require('./cell')
var Distance = require('./distance')
var rand = require('./rand')

class Grid {
  constructor (rows, cols) {
    this.grid = []
    for (var r = 0; r < rows; r++) {
      this.grid.push([])
      for (var c = 0; c < cols; c++) {
        this.grid[r].push(new Cell(r, c))
      }
    }
  }

  eachRow () {
    var rows = []
    for (var r = 0, rlen = this.grid.length; r < rlen; r++) {
      rows.push(this.grid[r])
    }
    return rows
  }

  eachCell () {
    var cells = []
    for (var r = 0, rlen = this.grid.length; r < rlen; r++) {
      for (var c = 0, clen = this.grid[r].length; c < clen; c++) {
        cells.push(this.grid[r][c])
      }
    }
    return cells
  }

  northOf (cell) {
    var r = cell.getRow() - 1
    if (r < 0) {
      return null
    }
    return this.grid[r][cell.getCol()]
  }

  eastOf (cell) {
    var r = cell.getRow()
    var c = cell.getCol() + 1
    if (c >= this.grid[r].length) {
      return null
    }
    return this.grid[r][c]
  }

  southOf (cell) {
    var r = cell.getRow() + 1
    if (r >= this.grid.length) {
      return null
    }
    return this.grid[r][cell.getCol()]
  }

  westOf (cell) {
    var c = cell.getCol() - 1
    if (c < 0) {
      return null
    }
    return this.grid[cell.getRow()][c]
  }

  neighborsOf (cell) {
    var neighbors = []
    var north = this.northOf(cell)
    var east = this.eastOf(cell)
    var south = this.southOf(cell)
    var west = this.westOf(cell)

    if (north) neighbors.push(north)
    if (east) neighbors.push(east)
    if (south) neighbors.push(south)
    if (west) neighbors.push(west)
    return neighbors
  }

  randomCell () {
    var r = rand(this.grid.length)
    var c = rand(this.grid[0].length)
    return this.grid[r][c]
  }

  distances (r, c) {
    var root = this.grid[r || 0][c || 0]
    var distances = new Distance(root)
    var frontier = [root]
    while (frontier.length !== 0) {
      var newFrontier = []
      frontier.forEach(function (cell) {
        cell.links.forEach(function (linked) {
          if (typeof distances.get(linked) === 'number') return
          distances.set(linked, distances.get(cell) + 1)
          newFrontier.push(linked)
        })
      })
      frontier = newFrontier
    }
    return distances
  }

  toString (contentOf) {
    function body (cell) {
      if (!contentOf) return '   '
      var content = contentOf(cell)
      if (typeof content !== 'number') return '   '
      else if (content < 10) return '  ' + content
      else if (content < 100) return ' ' + content
      return content
    }
    var output = ''
    var cols = this.grid[0].length

    output += '+'
    for (var i = 0; i < cols; i++) {
      output += '---+'
    }
    output += '\n'

    for (var r = 0, rlen = this.grid.length; r < rlen; r++) {
      var row = this.grid[r]
      var top = '|'
      var bottom = '+'
      for (var c = 0, clen = row.length; c < clen; c++) {
        var cell = row[c]
        var eastBoundary = cell.isLinked(this.eastOf(cell)) ? ' ' : '|'
        var southBoundary = cell.isLinked(this.southOf(cell)) ? '   ' : '---'
        var corner = '+'
        top += body(cell) + eastBoundary
        bottom += southBoundary + corner
      }
      output += top + '\n'
      output += bottom + '\n'
    }
    return output
  }

  draw (param) {
    if (!param.canvas || param.canvas.tagName !== 'CANVAS') {
      throw 'requires canvas'
    }
    var self = this
    var canvas = param.canvas
    var colorize = param.colorize
    var labelDistance = param.labelDistance
    var cellSize = param.cellSize || 25
    var g = canvas.getContext('2d')
    var drawLine = (x1, y1, x2, y2, color) => {
      g.strokeStyle = color || 'black'
      g.beginPath()
      g.moveTo(x1, y1)
      g.lineTo(x2, y2)
      g.lineWidth = 1
      g.stroke()
    }

    canvas.width = cellSize * this.grid[0].length + 1
    canvas.height = cellSize * this.grid.length + 1

    g.translate(0.5, 0.5)
    g.font = (cellSize * 0.5) + 'px "Arial"'
    g.textAlign = 'center'

    if (colorize || labelDistance) {
      var distances = this.distances()
    }

    this.eachCell().forEach(function (cell) {
      var x1 = cell.col * cellSize
      var y1 = cell.row * cellSize
      var x2 = (cell.col + 1) * cellSize
      var y2 = (cell.row + 1) * cellSize

      if (colorize) {
        var distance = distances.get(cell)
        g.fillStyle = 'rgba(128,0,255,' + (distance * 0.004) + ')'
        g.fillRect(x1, y1, cellSize, cellSize)
        g.fillStyle = 'black'
      }
      if (labelDistance) {
        distance = distances.get(cell)
        g.fillText(distance, (x1 + x2) / 2, (y1 + y2) / 2 + (y2 - y1) / 6)
      }
      if (!self.northOf(cell)) drawLine(x1, y1, x2, y1)
      if (!self.westOf(cell)) drawLine(x1, y1, x1, y2)
      if (!cell.isLinked(self.eastOf(cell))) drawLine(x2, y1, x2, y2)
      if (!cell.isLinked(self.southOf(cell))) drawLine(x1, y2, x2, y2)
    })
  }
}

module.exports = Grid
