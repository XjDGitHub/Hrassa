import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/sys/login', // 因为所有的接口都要跨域 表示所有的接口要带 /api
        method: 'post',
        data
    })
}

export function getUserInfo() {
    return request({
        url: '/sys/profile',
        method: 'post',
        // 此时需要token 但我们在请求拦截器中注入
    })

}
// 根据用户id获取头像
export function getUserDetailById(id) {
    return request({
        url: `/sys/user/${id}`
    })
}

export function logout() {

}
