<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
  <el-header>
    <!-- 左侧的logo -->
    <img id="logo" src="../../assets/images/mrlogo.png" alt="">
    <!-- 右侧的菜单 -->
    <!-- #23262E -->
    <el-menu
      class="el-menu-top"
      mode="horizontal"
      background-color="#23262E" 
      text-color="#fff"
      active-text-color="#409EFF"
      router>
      <el-submenu index="1">
        <template slot="title">
          <!-- 头像 -->
          <img :src="user_pic" alt="" class="avatar">
          <span>个人中心</span>
        </template>
        <el-menu-item index="admin-info"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
        <el-menu-item index="admin-avatar"><i class="el-icon-camera"></i>更换头像</el-menu-item>
        <el-menu-item index="admin-pwd"><i class="el-icon-key"></i>重置密码</el-menu-item>
      </el-submenu>
      <el-menu-item index="2" @click="quitFn" ><i class="el-icon-switch-button"></i>退出</el-menu-item>
    </el-menu>
  </el-header>
  <el-container>
    <!-- 侧边栏区域 -->
    <el-aside width="200px">
      <!-- 侧边栏-用户信息区域 -->
      <div class="user-box">
        <img :src="user_pic" alt="" v-if="user_pic">
        <img src="../../assets/images/logo.png" alt="" v-else>
        <span>欢迎 {{ nickname || username}}</span>
      </div>
      <!-- 侧边栏导航-菜单 -->
      <!--
        el-menu: 导航菜单
        default-active: 当前激活菜单的 index(el-submenu/el-menu-item的index值)，对应菜单就有激活样式
        @open: sub-menu 展开的回调
        @close: sub-menu 关闭的回调
        active-text-color: 激活时的文字颜色，哪项index的值和default-active一致，就会被设置动态文字颜色
        router：设置上（默认值为true）,就会当你点击某行菜单的时候，以index值作为路由切换
        子标签：
        如果有嵌套，先写el-submenu (里面嵌套template#title的设置当前展示内容，子用el-menu-item显示)
        如果无嵌套，直接写el-menu-item
       -->
      <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#23262E"
      text-color="#fff"
      active-text-color="#409EFF"
      router
      >
      <template v-for="item in menus">
        <el-menu-item v-if="!item.children" :index="item.indexPath" :key="item.indexPath">
          <i :class="item.icon"></i>
          <span>{{item.title}}</span>
        </el-menu-item>
        <el-submenu v-else :index="item.indexPath" :key="item.indexPath">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.title}}</span>
          </template>
          <el-menu-item v-for="obj, index in item.children" :index="obj.indexPath" :key="index">
          <i :class="obj.icon"></i>
          <span>{{obj.title}}</span>
        </el-menu-item>
        </el-submenu>
      </template>
      <!-- <ul class="layui-nav layui-nav-tree" lay-shrink="all">
            <li class="layui-nav-item layui-this">
              <a href="/home/dashboard.html" target="fm"><span class="iconfont icon-home"></span>首页</a>
            </li>
            <li class="layui-nav-item">
              <a class="" href="javascript:;"><span class="iconfont icon-16"></span>文章管理</a>
              <dl class="layui-nav-child">
                <dd>
                  <a href="/article/art_cate.html" target="fm"><i class="layui-icon layui-icon-app"></i>文章类别</a>
                </dd>
                <dd>
                  <a href="/article/art_list.html" target="fm"><i class="layui-icon layui-icon-app"></i>文章列表</a>
                </dd>
                <dd>
                  <a href="/article/art_pub.html" target="fm"><i class="layui-icon layui-icon-app"></i>发布文章</a>
                </dd>
              </dl>
            </li>
            <li class="layui-nav-item">
              <a href="javascript:;"><span class="iconfont icon-user"></span>个人中心</a>
              <dl class="layui-nav-child">
                <dd>
                  <a href="/user/user_info.html" target="fm"><i class="layui-icon layui-icon-app"></i>基本资料</a>
                </dd>
                <dd>
                  <a href="/user/user_avatar.html" target="fm"><i class="layui-icon layui-icon-app"></i>更换头像</a>
                </dd>
                <dd>
                  <a href="/user/user_pwd.html" target="fm"><i class="layui-icon layui-icon-app"></i>重置密码</a>
                </dd>
              </dl>
            </li>
          </ul> -->
    </el-menu>
    </el-aside>
    <el-container>
      <!-- 页面主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 底部footer区域 -->
      <el-footer>音乐电台管理系统-1906210239周泽翔</el-footer>
    </el-container>
  </el-container>
</el-container>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
import { getMenusListAPI } from '@/api'
// 经验：在组件标签上绑定的所有事件（包括原生事件的名字click,input等等）
// 都是自定义事件，都需要组件内￥emit来触发才行
// 万一组件内不支持这个原生事件名字
// 解决：@事件名.native = "methods里方法名"
// .native给组件内根标签，绑定这个原生的事件
export default {
  name: 'my-layout',
  data () {
    return {
      menus: [
        {
          indexPath:'home',
          icon:'iconfont icon-home',
          title:'首页',
          // children:{},
        },
        {
          indexPath:'javascript:;',
          icon:'iconfont icon-16',
          title:'文章管理',
          children:[
            {
              indexPath:'art-cate',
              icon:'layui-icon layui-icon-app',
              title:'文章类别',
            },
            {
              indexPath:'/article/art_list.html',
              icon:'layui-icon layui-icon-app',
              title:'文章列表',
            },
            {
              indexPath:'../article/artCate',
              icon:'layui-icon layui-icon-app',
              title:'发布文章',
            },
          ],
        },
        {
          indexPath:'$',
          icon:'iconfont icon-16',
          title:'用户管理',
          children:[
            {
              indexPath:'user-add',
              icon:'layui-icon layui-icon-app',
              title:'用户新增',
            },
            {
              indexPath:'user-list',
              icon:'layui-icon layui-icon-app',
              title:'用户列表',
            },
            {
              indexPath:'../article/artCate',
              icon:'layui-icon layui-icon-app',
              title:'发布文章',
            },
          ],
        },
        {
          indexPath:'#',
          icon:'iconfont icon-user',
          title:'个人中心',
          children:[
            {
              indexPath:'admin-info',
              icon:'layui-icon layui-icon-app',
              title:'基本资料',
            },
            {
              indexPath:'admin-avatar',
              icon:'layui-icon layui-icon-app',
              title:'更换头像',
            },
            {
              indexPath:'admin-pwd',
              icon:'layui-icon layui-icon-app',
              title:'重置密码',
            },
          ],
        },
      ]

    }
  },
  computed: {
    ...mapGetters(['username', 'nickname', 'user_pic'])
  },
  methods: {
    // 退出登录点击事件
    quitFn () {
      // console.log(1)
      this.$confirm('是否退出登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定
        // 清除vuex
        this.$store.commit('updateToken', '')
        // 强制跳转登录页面
        this.$router.push('/login')
      }).catch(() => {
        // 取消

      })
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    // 请求侧边栏数据
    async getMenuListFn () {
      const res = await getMenusListAPI()
      console.log(res)
      this.menus = res.data.data
    }
  },
  created () {
    // 请求-侧边栏数据
    // this.getMenuListFn()
  }

}
</script>

<style lang="less" scoped>
  .main-container {
     height: 100%;
     .el-header,
     .el-aside {
       background-color: #23262e;
     }
     .el-header {
       padding: 0;
       display: flex;
       justify-content: space-between;
     }
     .el-main {
       overflow-y: scroll;
       height: 0;
       background-color: #F2F2F2;
     }
     .el-footer {
       height: 40px!important;
       background-color: #eee;
       font-size: 12px;
       display: flex;
       justify-content: center;
       align-items: center;
     }
   }

   .avatar {
     border-radius: 50%;
     width: 35px;
     height: 35px;
     background-color: #fff;
     margin-right: 10px;
     object-fit: cover;
   }
  //  左侧边栏用户信息区域
  .user-box {
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    user-select: none;
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background-color: #fff;
      margin-right: 15px;
      object-fit: cover;
    }
    span {
      color: white;
      font-size: 12px;
    }
  }
  #logo{
    height: 80px;
    width: 150px;
    margin-left: 50px;
  }

</style>
