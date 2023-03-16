import { getToken, setToken, removeToken } from '@/utils/auth.js'
import { login } from '@/api/user'
const state = {
  token: getToken()
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
  }
};
const actions = {
  async login(context, data) {
    const result = await login(data)
    console.log(result)
    context.commit('setToken', result)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
