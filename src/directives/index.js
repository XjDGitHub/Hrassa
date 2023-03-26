// 这里用来写所有的自定义指令
// Vue.directive('指令名称', {
//     // 会在当前指令作用的dom元素 插入之后执行
//     // options 里面是指令的表达式
//     inserted: function (dom, options) {

//     }
// })

export const imageerror = {
    inserted(dom, options) {
        dom.src = dom.src || options.value
        dom.onerror = function () {
            dom.src = options.value
        }
    },
    componentUpdated(dom, options) {
        dom.src = dom.src || options.value
    }
}