// 这里是编写路由守卫的地方
import router from "./router";
import store from "./store"; //引入store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
import nProgress from "nprogress";

const whiteList = ['/login', '/404']
// 前置守卫
// to从哪里来 from 到哪里去
// next() 放过
// next(false)跳转中止
// next(地址) 跳转到某个地址
router.beforeEach((to, from, next) => {
    nProgress.start()
    if (store.getters.token) {
        if (to.path === '/login') {
            next('/')
        } else {
            next()
        }
    } else {
        if (whiteList.indexOf(to.path) > -1) {
            next()
        } else {
            next('/login')
        }
    }
    nProgress.done()
})
// 后置守卫
router.afterEach(() => {
    nProgress.done()
})