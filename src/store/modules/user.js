import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth.js'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
const state = {
  token: getToken(),
  userInfo: {}
};
const mutations = {
  // 这只是设置vuex的方法，后面如果调用可以将token的值赋给vuex的token，
  setToken(state, token) {
    state.token = token,
      // 同步给缓存
      setToken(token)
  },
  removeToken() {
    state.token = null,
      removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
};
const actions = {
  async login(context, data) {
    const result = await login(data)
    console.log(result)
    context.commit('setToken', result)
    setTimeStamp()

  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo })
    return result //伏笔
  },
  logout(context) {
    resetRouter()
    context.commit('removeToken')
    context.commit('removeUserInfo')
    // 还有一步  vuex中的数据是不是还在
    // 要清空permission模块下的state数据
    // vuex中 user子模块  permission子模块
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 父模块 调用 子模块的action
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
