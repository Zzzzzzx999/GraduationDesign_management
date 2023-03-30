<template>
  <!-- 注册页面的整体盒子 -->
 <div class="reg-container">
  <!-- 注册的盒子 -->
  <div class="reg-box">
    <!-- 标题的盒子 -->
    <div class="title-box"></div>
      <!-- 注册的表单区域 -->
  <el-form ref="loginRef" :model="loginForm" :rules="rulesObj">
  <el-form-item prop="username">
    <el-input  placeholder="请输入用户名" v-model="loginForm.username"></el-input>
  </el-form-item>
  <el-form-item prop="password">
    <el-input type="password" placeholder="请输入密码" v-model="loginForm.password"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button class="btn-reg" type="primary" @click="loginFn">登录</el-button>
    <el-link type="info" @click="$router.push('./reg')">去注册</el-link>
  </el-form-item>
</el-form>

  </div>

 </div>
</template>

<script>
// 前端绑定数据对象“属性名”，可以直接给要调用的功能接口的“参数名” 一致
// 好处：我们可以直接把前端对象（带着同名的属性和前端的值）发给后台
import { loginAPI } from '@/api'
import { mapMutations } from 'vuex'
export default {

  name: 'my-login',
  data () {
    return {
      loginForm: { // 表单数据对象
        username: '', // 用户名
        password: '' // 密码
      },
      rulesObj: {
        // 表单规则验证对象
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须是1-10的大小写字母数字',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15的非空字符',
            trigger: 'blur'
          }
        ]

      }
    }
  },
  methods: {
    ...mapMutations(['updateToken']),
    loginFn () {
      this.$refs.loginRef.validate(async valid => {
        if (valid) {
          // console.log(this.loginForm)
          // 就是为了拿到后台真正的数据赋予给res
          // this.loginForm = JSON.stringify(this.loginForm)
          const { data: res } = await loginAPI(this.loginForm)
          // 根据后台返回的登录提示信息，做判断给用户提示
          // 直接用后台返回的提示message值
          if (res.status === 0) {
            // 成功
            this.$message.success(res.message)
            this.updateToken(res.token)
            this.$router.push('/')
          } else {
            this.$message.error(res.message)
          }
          console.log(res)
        } else {
          return false
        }
      })
    }
  }

}
</script>

<style lang="less" scoped>
  .reg-container {
    background: url('../../assets/images/login_bg.jpg') center;
    background-size: cover;
    height: 100%;
    .reg-box {
      width: 400px;
      height: 335px;
      background-color: #fff;
      border-radius: 3px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding: 0 30px;
      box-sizing: border-box;
      .title-box {
        height: 60px;
        background: url('../../assets/images/login_title.png') center no-repeat;
      }
      .btn-reg {
        width: 100%;
      }
    }
  }

</style>
