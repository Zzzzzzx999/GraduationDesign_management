import request from '@/utils/request'
// 注册函数处理方法
export const reguserAPI = (params) => {
  return request({
    url: '/api/reguserManage',
    method: 'POST',
    data: {
      username:params.username,
      password:params.password,
      user_pic:params.user_pic,
      nickname:params.nickname,
      email:params.email,
      growthValue:params.growthValue,
      works:params.works,
      follows:params.follows,
      followeds:params.followeds,
      giftsReceived:params.giftsReceived,
      signature:params.signature,
    }
  })
}
// 查询用户详细信息
export const getUserInfoAPI = (id) => {
  return request({
    url: '/my/userinfo',
    method: 'GET',
    params:{
      id
    }
  })
}
// 删除用户
export const deleteUserAPI = (id) => {
  return request({
    url: '/api/delete',
    method: 'GET',
    params:{
      id
    }
  })
}
// 更新用户详细信息
export const updateUserInfoAPI = (params) => {
  return request({
    url: '/my/userinfo',
    method: 'POST',
    data:{
      id: params.id,
      username:params.username,
      password:params.password,
      user_pic:params.user_pic,
      nickname:params.nickname,
      email:params.email,
      growthValue:params.growthValue,
      works:params.works,
      follows:params.follows,
      followeds:params.followeds,
      giftsReceived:params.giftsReceived,
      signature:params.signature,
    }
  })
}