class Distance {
  constructor (root) {
    this.root = root
    this.cells = {}
    this.cells[root] = 0
  }

  get (cell) {
    return this.cells[cell]
  }

  set (cell, distance) {
    this.cells[cell] = distance
  }
}

module.exports = Distance
