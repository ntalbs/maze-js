class Cell {
  constructor (r, c) {
    this.row = r
    this.col = c
    this.links = []
  }

  getRow () {
    return this.row
  }

  getCol () {
    return this.col
  }

  link (cell, bidi) {
    this.links.push(cell)
    if (typeof bidi === 'undefined' || !!bidi) cell.link(this, false)
  }

  unlink (cell, bidi) {
    var i = this.links.indexOf(cell)
    if (i >= 0) {
      this.links.splice(i, 1)
    }
    if (typeof bidi === 'undefined' || !!bidi) cell.unlink(this, false)
  }

  isLinked (cell) {
    return this.links.indexOf(cell) >= 0
  }

  toString () {
    return 'c(' + this.row + ',' + this.col + ')'
  }
}

module.exports = Cell
