// 封装的是具体的接口请求方法
// 注意：每个方法只负责请求一个url地址
// 引入自定义axios函数
import request from '@/utils/request'
// 导出接口方法，为了在逻辑页面引入后调用
// registerAPI(this.form)
// registerAPI({
//   username: '',
//   password: '',
//   repassword: ''
// })
// 形参obj的值
// obj = {username: 值, password: '', repassword: ''}
// 左侧想要对象解构赋值（语法）
// {username:username变量名 , password: 变量名, repassword:变量名} = {username: 值, password: '', repassword: ''}
// 函数形参的obj就改成对象解构接收传入的数据对象
// {username：username， password: password, repassword: repassword}
// key是传入的对象key匹配，value是变量名(同名)
// ES6规定，key和value变量同名的时候，可以简写（key既为key也是value变量名）
// 注册函数处理方法
export const registerAPI = ({ username, password, repassword }) => {
  // 原地是一个Promise对象(内部包含原生ajax请求)
  // return 这个Promise对象到逻辑页面，去那边对Promise对象提取结果
  return request({
    url: '/api/reg',
    method: 'POST',
    // axios传参params,data
    // params的对象参数名和值，axios源码会把参数和值，拼接在url?后面给后台（query查询字符串）
    // data的对象参数名和值，axios源码会把参数和值，拼接在请求体里（body参数）
    data: {
      username,
      password,
      repassword
    }
  })
}
// 登录函数处理方法
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POSt',
    data: {
      username,
      password
    }
  })
}
// 获取用户信息函数处理方法
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo'
    // method不写默认就是'get'方式请求
    // 传参给后台：params(查询字符串query),data(请求体body),headers(请求头)

  })
}
// 获取侧边栏的数据
export const getMenusListAPI = () => {
  return request({
    url: '/my/menus'

  })
}
// 更新用户信息
export const updateUserInfoAPI = ({ id, username, nickname, email, user_pic }) => {
  return request({
    url: '/my/userinfo',
    methods: 'PUT',
    data: {
      id,
      username,
      nickname,
      email,
      user_pic
    }
  })
}
// 更新用户头像
export const updateUserAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar // 头像base64字符串
    }
  })
}
// 更新用户密码
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}

// 获取文章分类
export const getArtCateListAPI = () => {
  return request({
    url: '/my/cate/list'
  })
}
