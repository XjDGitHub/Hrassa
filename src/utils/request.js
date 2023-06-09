// import { config } from '@vue/test-utils'
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from './auth'
const TimeOut = 3600
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000
})
// 请求拦截器
service.interceptors.request.use(config => {
    if (store.getters.token) {
        if (IsCheckTimeOut()) {
            store.dispatch('user/logout')
            router.push('/login')
            return Promise.reject(new Error('Token过期'))
        }
        config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config //必须返回，处理过后必须返回
}, error => {
    return Promise.reject(error)
})
// 响应拦截器
// 响应拦截器
service.interceptors.response.use(response => {
    // axios默认加了一层data
    const { success, message, data } = response.data
    //   要根据success的成功与否决定下面的操作
    if (success) {
        return data
    } else {
        // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
        Message.error(message) // 提示错误消息
        return Promise.reject(new Error(message))
    }
}, error => {
    // error 信息 里面 response的对象
    if (error.response && error.response.data && error.response.data.code === 10002) {
        // 当等于10002的时候 表示 后端告诉我token超时了
        store.dispatch('user/logout') // 登出action 删除token
        router.push('/login')
    } else {
        Message.error(error.message) // 提示错误信息
    }
    return Promise.reject(error)
})
function IsCheckTimeOut() {
    const now = Date.now()
    const timeStamp = getTimeStamp()
    return (now - timeStamp) / 1000 > TimeOut
}
export default service
