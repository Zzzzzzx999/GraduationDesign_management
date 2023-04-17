import request from '@/utils/request'
// 获取电台分类列表数据
export const getStationCates = () => {
  return request({
    url: '/my/stationCate/cates',
    method: 'GET',
  })
}
// 新增电台分类
export const addStationCates = (params) => {
  return request({
    url: '/my/stationCate/addcates',
    method: 'POST',
    data:{
      name:params.name,
      alias:params.alias,
    }
  })
}
// 删除电台分类
export const deleteCateById = (id) => {
  return request({
    url: '/my/stationCate/deletecate',
    method: 'GET',
    params:{
      id
    }
  })
}
// 更新电台分类
export const updateCateById = (params) => {
  return request({
    url: '/my/stationCate/updatecate',
    method: 'POST',
    data:{
      id:params.id,
      name:params.name,
      alias:params.alias,
    }
  })
}


// 新增电台
export const reguserStationAPI = (params) => {
  return request({
    url: '/my/station/addStation',
    method: 'POST',
    data:{
      cover_image:params.cover_image,
      title:params.title,
      content:params.content,
      pub_date:params.pub_date,
      id:params.id,
      cateName:params.cateName,
      author:params.author,
    }
  })
}
// 修改电台
export const updateStationAPI = (params) => {
  return request({
    url: '/my/station/updatestation',
    method: 'POST',
    data:{
      cover_image:params.cover_image,
      title:params.title,
      content:params.content,
      pub_date:params.pub_date,
      id:params.id,
      cateName:params.cateName,
      author:params.author,
    }
  })
}
// 删除电台
export const deleteStationAPI = (id) => {
  return request({
    url: '/my/station/deletestation',
    method: 'GET',
    params:{
      id
    }
  })
}
// 获取电台分类列表数据
export const getStationListAPI = () => {
  return request({
    url: '/my/station/getStations',
    method: 'GET',
  })
}
// 查询电台详细信息
export const getStationInfoAPI = (id) => {
  return request({
    url: '/my/station/userinfo',
    method: 'GET',
    params:{
      id
    }
  })
}

