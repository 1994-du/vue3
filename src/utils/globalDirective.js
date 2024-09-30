function loop(el) {
    if (el.tagName === 'INPUT') {
        el.focus()
        return el
    } else {
        loop(el.children[0])
    }
}
const directive = (app) => {
    app.directive('focus', {
        mounted(el, binding) {
            loop(el)
        }
    })
}

export default directive