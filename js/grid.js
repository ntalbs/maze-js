import Cell from './cell'
import Distance from './distance'
import rand from './rand'

export default class Grid {
  constructor (rows, cols) {
    this.grid = []
    for (let r = 0; r < rows; r++) {
      this.grid.push([])
      for (let c = 0; c < cols; c++) {
        this.grid[r].push(new Cell(r, c))
      }
    }
  }

  eachRow () {
    let rows = []
    for (let r = 0, rlen = this.grid.length; r < rlen; r++) {
      rows.push(this.grid[r])
    }
    return rows
  }

  eachCell () {
    let cells = []
    for (let r = 0, rlen = this.grid.length; r < rlen; r++) {
      for (let c = 0, clen = this.grid[r].length; c < clen; c++) {
        cells.push(this.grid[r][c])
      }
    }
    return cells
  }

  northOf (cell) {
    let r = cell.getRow() - 1
    if (r < 0) {
      return null
    }
    return this.grid[r][cell.getCol()]
  }

  eastOf (cell) {
    let r = cell.getRow()
    let c = cell.getCol() + 1
    if (c >= this.grid[r].length) {
      return null
    }
    return this.grid[r][c]
  }

  southOf (cell) {
    let r = cell.getRow() + 1
    if (r >= this.grid.length) {
      return null
    }
    return this.grid[r][cell.getCol()]
  }

  westOf (cell) {
    let c = cell.getCol() - 1
    if (c < 0) {
      return null
    }
    return this.grid[cell.getRow()][c]
  }

  neighborsOf (cell) {
    let neighbors = []
    let north = this.northOf(cell)
    let east = this.eastOf(cell)
    let south = this.southOf(cell)
    let west = this.westOf(cell)

    if (north) neighbors.push(north)
    if (east) neighbors.push(east)
    if (south) neighbors.push(south)
    if (west) neighbors.push(west)
    return neighbors
  }

  randomCell () {
    let r = rand(this.grid.length)
    let c = rand(this.grid[0].length)
    return this.grid[r][c]
  }

  distances (r, c) {
    let root = this.grid[r || 0][c || 0]
    let distances = new Distance(root)
    let frontier = [root]
    while (frontier.length !== 0) {
      let newFrontier = []
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
      let content = contentOf(cell)
      if (typeof content !== 'number') return '   '
      else if (content < 10) return '  ' + content
      else if (content < 100) return ' ' + content
      return content
    }
    let output = ''
    let cols = this.grid[0].length

    output += '+'
    for (let i = 0; i < cols; i++) {
      output += '---+'
    }
    output += '\n'

    for (let r = 0, rlen = this.grid.length; r < rlen; r++) {
      let row = this.grid[r]
      let top = '|'
      let bottom = '+'
      for (let c = 0, clen = row.length; c < clen; c++) {
        let cell = row[c]
        let eastBoundary = cell.isLinked(this.eastOf(cell)) ? ' ' : '|'
        let southBoundary = cell.isLinked(this.southOf(cell)) ? '   ' : '---'
        let corner = '+'
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
      throw new Error('requires canvas')
    }
    let self = this
    let canvas = param.canvas
    let colorize = param.colorize
    let labelDistance = param.labelDistance
    let cellSize = param.cellSize || 25
    let g = canvas.getContext('2d')
    let drawLine = (x1, y1, x2, y2, color) => {
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

    let distances
    if (colorize || labelDistance) {
      distances = this.distances()
    }

    this.eachCell().forEach(function (cell) {
      let x1 = cell.col * cellSize
      let y1 = cell.row * cellSize
      let x2 = (cell.col + 1) * cellSize
      let y2 = (cell.row + 1) * cellSize
      let distance

      if (colorize) {
        distance = distances.get(cell)
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
