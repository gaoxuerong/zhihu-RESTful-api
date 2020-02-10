class Compile {
  constructor(el,vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm
    if (this.el) {
      // 如果能获取到元素才编译
      // 1.先把真实的DOM移入到内存中
      const fragment = this.node2fragment(this.el);
      // 2.编译：提取想要的元素节点v-model和文本节点 {{}}
      this.compile(fragment)
      // 3.把编译好的fragment 放到页面里
      this.el.appendChild(fragment)
    }
  }
  // 专门写一些辅助方法
  isElementNode(node) {
    return node.nodeType === 1
  }
  isDirective(name) {
    return name.includes('v-')
  }
  // 核心方法
  node2fragment(el) {
    let fragment = document.createDocumentFragment()
    let firstChild
    while (firstChild = el.firstChild) {
      fragment.appendChild(firstChild)
    }
    return fragment
  }
  compile(fragment) {
    let childNodes = fragment.childNodes;
    Array.from(childNodes).forEach(node => {
      if (this.isElementNode(node)) {
        // 这里需要编译元素
        this.compileElement(node)
        // 递归
        this.compile(node)
      } else {
        // 这里需要编译文本
        this.compileText(node)
      }
    })
  }
  compileElement(node) {
    // 带v-modal
    const attrs = node.attributes
    Array.from(attrs).forEach( attr => {
      const attrName = attr.name
      if (this.isDirective(attrName)) {
        const expr = attr.value
        const [ , type] = attrName.split('-')
        CompileUtil[type](node, this.vm, expr)
      }
    })
  }
  compileText(node) {
    // 带{{}}
    const text = node.textContent //取文本内容
    const reg = /\{\{([^}]+)\}\}/g
    if (reg.test(text)) {
      CompileUtil['text'](node, this.vm, text)
    }
  }
}
CompileUtil = {
  // vm.$data.message.a.b.c.d.e.f.g的值
  getVal(vm, expr) {
    expr = expr.split('.')
    return expr.reduce((prev, next) => {
      return prev[next]
    },vm.$data)
  },
  getTextVal(vm, expr) {
    return expr.replace(/\{\{([^}]+)\}\}/g, (...args) => {
      return this.getVal(vm, args[1])
    })
  },
  text(node, vm, expr) { // 文本处理
    const updateFn = this.updater['textUpdater']
    const value = this.getTextVal(vm, expr)
    expr.replace(/\{\{([^}]+)\}\}/g, (...args) => {
      new Watcher(vm, args[1], (newValue) => {
        updateFn && updateFn(node, this.getTextVal(vm,expr))
      })
    })
    updateFn && updateFn(node, value)
  },
  setVal(vm, expr, value) {
    expr = expr.split('.')
    return expr.reduce((prev, next, currentIndex) => {
      if (currentIndex === expr.length - 1) {
        return prev[next] = value
      }
      return prev[next]
    },vm.$data)
  },
  model(node, vm, expr) { //输入框事件
    const updateFn = this.updater['modelUpdater']
    // 这里应该加监控，当数据变化了，应该调用watcher的callback
    new Watcher(vm, expr, (newValue) => {
      updateFn && updateFn(node, this.getVal(vm, expr))
    })
    node.addEventListener('input', e => {
      const newValue = e.target.value
      this.setVal(vm, expr, newValue)
    })
    updateFn && updateFn(node, this.getVal(vm, expr))
  },
  updater: {
    textUpdater(node, value) {
      node.textContent = value
    },
    modelUpdater(node, value) {
      node.value = value
    }
  }
}