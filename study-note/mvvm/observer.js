class Observer {
  constructor(data) {
    this.observe(data)
  }
  observe(data) {
    if (!data || typeof data !== 'object'){
      return
    }
    // 把数据一一劫持
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key])
      this.observe(data[key]) // 深度递归劫持
    })
  }
  // 定义响应式
  defineReactive(obj, key, value) {
    const that = this
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set(newValue) {
        if (newValue!=value) {
          that.observe(newValue) // set后也劫持
          value = newValue
          dep.notify()
        }
      }
    })
  }
}
class Dep {
  constructor() {
    this.subs = []
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}