import { constantRoutes, asyncRoutes } from '@/router/index'
const state = {
    routes: constantRoutes
}
const mutations = {
    setRoutes(state, newRoutes) {
        // 下面这么写不对 不是语法不对 是业务不对
        // state.routes = [...state.routes, ...newRoutes]
        // 有一种情况  张三 登录 获取了动态路由 追加到路由上  李四登录 4个动态路由
        // 应该是每次更新 都应该在静态路由的基础上进行追加
        state.routes = [...constantRoutes, ...newRoutes]
    }
}
const actions = {
    // 筛选权限路由
    // 第二个参数为当前用户的所拥有的菜单权限
    // menus: ["settings","permissions"]
    // asyncRoutes是所有的动态路由
    // asyncRoutes  [{path: 'setting',name: 'setting'},{}]
    filterRoutes(context, menus) {
        const routes = []
        // key就是标识
        // asyncRoutes 找 有没有对象中的name属性等于 key的 如果找不到就没权限 如果找到了 要筛选出来
        menus.forEach(key => {
            routes.push(...asyncRoutes.filter(item => item.name === key))
        })
        context.commit('setRoutes', routes)
        return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
