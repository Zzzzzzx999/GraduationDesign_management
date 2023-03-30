/* eslint-disable */ 
// 基于axios封装网络请求的函数
import store from '@/store'
import axios from 'axios'
import Qs from "qs"
// axios.create()创建一个带配置项的自定义axios函数
// myAxios 请求的时候，地址baseURL + url,然后去请求后台
const myAxios = axios.create({
  // baseURL: 'http://big-event-vue-api-t.itheima.net',
  baseURL: 'http://127.0.0.1:3000',
  transformRequest: [data => Qs.stringify(data, { indices: true })]
})

// 定义请求拦截器
myAxios.interceptors.request.use(function (config) {
  // 在请求前会触发一次
  // 它返回给axios内源码，config配置对象（要请求后台的参数都在这个对象上）
  // config配置对象（要请求后台的参数都在这个对象上）
  // 在请求前会触发一次 这个return交给axios源码内 根据配置项发起请求
  // 在发起时，统一携带请求头Authorization和token值
  // 判断，登录页面和注册页面，vuex里无token,而且登录接口和注册接口也不需要携带token(其他页面需要)
  /* config.data = Qs.stringify(config.data)
  config.headers = {
    'Content-Type' : 'application/x-www-form-urlencoded'
  } */
  if (store.state.token) {
    config.headers.Authorization = store.state.token
  }
  return config
}, function (error) {
  // 请求发起前的代码，如果有异常报错，会直接进入这里
  // 返回一个拒绝状态的promise对象（axios留在原地的promise对象状态就为失败结果为error变量值）
  // 此函数类似一个catch函数里面return
  // 口诀：return 非promise对象值，会作为成功的结果 返回给下一个promise对象（axios留在原地）
  // 口诀：return promise对象 这个promise对象状态（状态为失败）它是promise 的类方法reject()
  return Promise.reject(error)
  // 等同于
  // return new Promise((resolve, reject) => {
  //   reject(error)
  // })
}
)

// 定义响应拦截器
myAxios.interceptors.response.use(function (response) {
  // 响应状态码为 2xx 时触发成功的回调，形参中的response 是“成功的结果”
  return response
}, function (error) {
  // 响应状态码不是 2xx 时触发失败的回调，形参中的 error 是“失败的结果”
  /* if (error.response.code === 401) {
    // 本次响应是token过期了
    // 清除vuex里的一切，然后换回到登录页面（被动退出登录状态）
    store.commit('updateToken', '')
    store.commit('updateUserInfo', {})
  } */
  return Promise.reject(error)
}
)
// 导出axios自定义函数
export default myAxios
