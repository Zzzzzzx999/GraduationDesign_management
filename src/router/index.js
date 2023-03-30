import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/'

Vue.use(VueRouter)

const routes = [

  {
    path: '/', // 网页打开第一次默认路由路径就是'/'
    component: () => import('@/views/layout'),
    redirect: '/home', // 会导致路由规则数组再次匹配
    children: [
      // 侧边栏导航，点击会切换路由地址，路由地址靠数据请求回来铺设上去的
      // 所有路由规则要配合它保存一致
      {
        path: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'admin-info',
        component: () => import('@/views/admin/userInfo')
      },
      {
        path: 'admin-avatar',
        component: () => import('@/views/admin/userAvatar')
      },
      {
        path: 'admin-pwd',
        component: () => import('@/views/admin/userPwd')
      },
      {
        path: 'art-cate',
        component: () => import('@/views/article/artCate')
      },
      {
        path: 'user-add',
        component: () => import('@/views/user/newUser')
      },
      {
        path: 'user-list',
        component: () => import('@/views/user/userList')
      }

    ]
  },
  {
    path: '/reg',
    // webpack 提供的import函数来路由懒加载导入组件
    // 路由懒加载，就是页面路由路径切换到/reg,才去加载对应的组件代码
    // 好处：让首页加载文件体积更小，打开更快
    component: () => import('@/views/register')
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  }

]

const router = new VueRouter({
  routes
})

// 无需登录可以访问的路由地址
const whiteList = ['/login', '/reg'] // 白名单
// 全局前置路由守卫
// 浏览器第一次打开项目页面，会触发一次全局前置路由守卫函数
// 有token就证明登录了，无token未登录
// next()如果强制切换路由地址，会再次走路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    if (token && !store.state.userInfo.username) {
      store.dispatch('getUserInfoActions')
    }
    next()
  } else {
    // 未登录
    // 数组。includes(值)，作用：判断值是否在数组里出现过，出现过原地返回true
    if (whiteList.includes(to.path)) {
      // 未登录，可以访问的路由地址，则放行（路由全局前置守卫不会再次触发了，而是匹配路由表，让组件挂载）
      next()
    } else {
    // next()强制切换到登录路径上
      next('/login')
    }
  }
})

export default router

// 退出登录，重新登录，只走相关组件代码（异步dom切换，不会导致所有代码重新执行，APP.vue不走）
// 效果不对：换账号的重新请求用户数据
// 解决：
// 1、可以在登录页面，登录成功后，再发请求去拿到用户信息
// 2、可以在全局前置路由守卫中，写（路由跳转的时候，判断+获取）
