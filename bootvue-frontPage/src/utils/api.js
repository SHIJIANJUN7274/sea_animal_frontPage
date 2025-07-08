// 用来处理用户注册 和 登录的请求 封装
// 导入封装好的 axios 的请求实例对象
import request from './request'
/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @returns {Promise}
 */
export function login(data) {
    return request({
        url: '/auth/login',
        method: 'post',
        data//请求体 包含了用户登录的信息（例如用户名和密码）
    })
}
/**
 * 用户注册
 * @param {Object} data - 注册信息
 * @returns {Promise}
 */
export function register(data) {
    return request({
        url: '/auth/register',
        method: 'post',
        data
    })
}
