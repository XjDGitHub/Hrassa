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
router.beforeEach(async (to, from, next) => {
    nProgress.start()
    if (store.getters.token) {
        if (to.path === '/login') {
            next('/')
        } else {
            if (!store.getters.userId) {
                const { roles } = await store.dispatch('user/getUserInfo') //两个含义，利用vuex获取用户数据 ，获取的数据被返回，拿到roles即用户动态路由权限
                // 筛选用户的可用路由
                // actions中函数 默认是Promise对象 调用这个对象 想要获取返回的值话 必须 加 await或者是then
                // actions是做异步操作的
                const routes = await store.dispatch('permission/filterRoutes', roles.menus)
                // routes就是筛选得到的动态路由
                // 动态路由 添加到 路由表中 默认的路由表 只有静态路由 没有动态路由
                router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
                next(to.path)// 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
                // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了


            }
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