import { getUserInfoAPI } from '@/api'
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '', // 保存token字符串
    userInfo: {}// 保存用户信息（id,username,nickname,email,user_pic）
  },
  getters: {
    // username (state) {
    //   return state.userInfo.username
    // }
    // username: (state) => {
    //   return state.userInfo.useranme
    // }
    username: state => state.userInfo.name, // 用户名
    nickname: state => state.userInfo.name, // 用户昵称
    user_pic: state => state.userInfo.admin_pic// 用户头像
    /* username: state => state.userInfo.username, // 用户名
    nickname: state => state.userInfo.nickname, // 用户昵称
    user_pic: state => state.userInfo.user_pic// 用户头像 */

  },
  mutations: {
    // 保存token
    updateToken (state, val) {
      state.token = val
    },
    // 保存用户信息
    updateUserInfo (state, val) {
      // 保护密码安全防止外泄
      val.password = '******'
      state.userInfo = val
    }
  },
  actions: {
    // 请求用户信息
    async getUserInfoActions (store) {
      const res = await getUserInfoAPI()
      // console.log(res)
      store.commit('updateUserInfo', res.data.profile[0])
    }
  },
  modules: {
  },
  plugins: [
    createPersistedState()// 注入持久化插件
  ]
})

// vuex默认保存到内存中，所以刷新所有的值会回归初始化（无法做到持久存储）
// 借助 vuex-persistedstate@3.2.1 这个包能让vuex实现持久化存储
