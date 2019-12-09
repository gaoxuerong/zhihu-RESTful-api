module.exports = {
  set body(val) {
    console.log(this)
    // this.res.statusCode = 200
    this._body = val
  },
  get body() {
    return this._body
  }
}