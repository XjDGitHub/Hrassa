import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth.js'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
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
    context.commit('removeToken')
    context.commit('removeUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
