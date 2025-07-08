// 主要是配置 axios 实例对象以及请求和响应的拦截器
// 主要用于统一处理api请求和处理错误。
// 导入axios库函数 以及 消息提示组件
import axios from 'axios'
import { ElMessage } from 'element-plus'
// 创建axios实例// 创建一个axios对象 配置请求的基本参数
const service = axios.create({
    baseURL: '/api',//基础的url 前缀 后端接口的前缀
    timeout: 10000 //设置超时的请求时间为10秒
})
// 请求拦截器//请求拦截器的配置 配置一个请求的拦截器 在每个请求发送之前 进行拦截的处理
service.interceptors.request.use(
    config => {
        //在每次请求发送之前可以做一些配置 例如token 或者 修改请求头等信息
        return config
    },
    error => {
        // 请求错误的时候要做的处理
        console.error(error)//打印错误信息    
        return Promise.reject(error)//返回 Promise 错误信息 
    }
)
// 响应拦截器
// 响应的拦截器 处理响应回来的具体的数据
service.interceptors.response.use(
    //获取响应回来的数据
    response => {
        const res = response.data
        //判断状态码是否是 200
        // 如果返回的状态码不是200，说明接口请求失败
        if (res.code !== 200) {
            ElMessage.error(res.message || '系统异常')
            return Promise.reject(new Error(res.message || '系统异常'))
        } else {
            return res
        } 
    },
    error => {
        console.error('请求出错：', error)
        ElMessage.error('网络异常，请稍后重试')
        return Promise.reject(error)
    }
)
// 暴露出去 导出配置好的 axios 实例对象 
export default service