class Watcher {
  constructor(vm, expr, callback) {
    this.vm = vm
    this.expr = expr
    this.callback = callback
    // 先获取老值
    this.get()
  }
  getVal(vm, expr) {
    expr = expr.split('.')
    return expr.reduce((prev, next) => {
      return prev[next]
    },vm.$data)
  }
  get() {
    Dep.target = this
    const value = this.getVal(this.vm, this.expr)
    Dep.target = null
    return value
  }
  update() {
    const oldValue = this.value
    const newValue = this.getVal(this.vm, this.expr)
    if (oldValue != newValue) {
      this.callback(newValue)
    }
  }
}