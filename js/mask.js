var rand = require('./rand');

function Mask(r, c) {
  this.row = r;
  this.col = c;

  this.bits = new Array(r);
  for (var i=0; i<this.row; i++) {
    this.bits[i] = new Array(c);
    for (var j=0; j<this.col; j++) {
      this.bits[i][j] = true;
    }
  }
}

Mask.prototype.get = function (r, c) {
  if (0<=r && r<=this.row && 0<=c && c<=this.col)
    return this.bits[r][c];
  else
    return false;
};

Mask.prototype.set = function (r, c, val) {
  this.bits[r][c] = val;
};

Mask.prototype.count = function () {
  var cnt = 0;
  for (var i=0; i<this.row; i++) {
    for (var j=0; j<this.col; j++) {
      if (this.bits[i][j]) cnt++;
    }
  }
  return cnt;
};

Mask.prototype.randomLocation = function () {
  while(true) {
    var r = rand(this.row),
        c = rand(this.col);
    if (this.bits[r][c]) return {row: r, col: c};
  }
};