<template>
  <div class="app-container-detail">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>新增用户</span>
        </div>
        <div class="dialog-footer-right">
          <el-button type="primary" @click="submitFn">提交</el-button>
          <el-button @click="resetFn">重置</el-button>
        </div>
        <el-form :model="newUserForm" ref="addUserRef" :inline="true" label-width="100px" label-position="top" element-loading-text="系统处理中，请稍等" v-loading.lock="fullscreenLoading">
          <el-row>
            <el-form-item label="头像" required prop="user_pic">
              <div>
                <img v-if="!newUserForm.user_pic" class="the_img border" src="../../assets/images/avatar.jpg" alt="" @click="chooseImg" />
                <img v-else class="the_img border" :src="newUserForm.user_pic" alt="" @click="chooseImg">
                <div class="btn-box">
                  <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange"/>
                </div>
              </div>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="用户名" clearable required prop="username">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.username" :placeholder="placeholderInput" clearable />
            </el-form-item>
            <el-form-item label="密码" clearable required prop="password">
              <el-input show-password onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.password" :placeholder="placeholderInput" clearable />
            </el-form-item>
            <el-form-item label="昵称" clearable required prop="nickname">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.nickname" :placeholder="placeholderInput" clearable />
            </el-form-item>
            <el-form-item label="邮箱" clearable required prop="email">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.email" :placeholder="placeholderInput" clearable />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="成长值" clearable prop="growthValue">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.growthValue" :placeholder="placeholderInput" clearable />
            </el-form-item>
            <el-form-item label="作品" clearable prop="works">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.works" :placeholder="placeholderInput" clearable />
            </el-form-item>
            <el-form-item label="关注" clearable prop="follows">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.follows" :placeholder="placeholderInput" clearable />
            </el-form-item>
            <el-form-item label="粉丝" clearable prop="followeds">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.followeds" :placeholder="placeholderInput" clearable />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="礼物" clearable prop="giftsReceived">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.giftsReceived" :placeholder="placeholderInput" clearable />
            </el-form-item>
            <el-form-item label="个性签名" clearable prop="signature">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')" style="width: 450px"
                v-model="newUserForm.signature" :placeholder="placeholderInput" clearable />
            </el-form-item>
          </el-row>
        </el-form>
      </el-card>
    </div>
</template>

<script>
import { getUserInfoAPI, updateUserInfoAPI } from '@/api/user'

export default {
  name: 'userEdit',
  data () {
    return {
      newUserForm:{
        user_pic:'',
        username:'',
        password:'',
        nickname:'',
        email:'',
        growthValue:'',
        works:'',
        follows:'',
        followeds:'',
        giftsReceived:'',
        signature:'',
      },
      placeholderInput:'',
      fullscreenLoading:true,
      activeName:null,
      userId:null,
    }
  },
  created () {
    // this.getArtCateFn()
  },
  mounted(){
    console.log('query',this.$route.query);
    if (this.$route.query.id) {
      this.userId = this.$route.query.id;
      setTimeout(() => {
        getUserInfoAPI(this.userId).then((res) => {
          this.newUserForm = res.data.profile[0];
          console.log('this.newUserForm',this.newUserForm);
          this.fullscreenLoading = false;
        }).catch(err=>{
          this.fullscreenLoading = false;
          console.log('err',err);
        })
      }, 500);
    }
  },
  methods: {
    // 选择图片 点击事件
    chooseImg () {
      // 目的： 为了让input[type=file]标签，让他再用js代码来触发它的点击事件（导致他默认行为给一个文件选择窗口）
      // 原因： input[type = file] 它是原生标签， 样式不太好改
      // 解决： 移花接木
      this.$refs.iptRef.click()
    },
    // 选择图片确定了
    onFileChange (e) { // e 原生事件对象
      const files = e.target.files // 拿到用户选择的文件数组
      if (files.length === 0) {
        // 证明刚刚文件选择窗口打开了，但是它是一个文件都没选择然后点击了确定关闭选择弹窗
      } else {
        // 证明选择了文件（默认只能选一个，如果选择多个需要给input标签加额外原生属性）
        console.log(files[0])
        const fr = new FileReader()
        fr.readAsDataURL(files[0])// 传入文件对象开始读
        fr.onload = (e) => { // onload等待把文件读成base64字符串后会触发onload事件函数
          // e.target.result的值就是读完的结果
          this.newUserForm.user_pic = e.target.result// 赋值给变量，让他显示在img的src里
        }
      }
    },
    submitFn () {
      this.$refs.addUserRef.validate(async valid => {
        if (valid) {
          let form = {
            id:this.userId,
            user_pic:'',
            username:'',
            password:'',
            nickname:'',
            email:'',
            growthValue:0,
            works:0,
            follows:0,
            followeds:0,
            giftsReceived:0,
            signature:'暂无介绍',
          }
          for (let key in this.newUserForm) {
            if (this.newUserForm.hasOwnProperty(key) && this.newUserForm[key] !== '') {
              // 非空属性
              form[key] = this.newUserForm[key];
            }
          }
          console.log(form)
          const { data: res } = await updateUserInfoAPI(form)
          if (res.status == 1 && res.message == '用户名被占用，请更换其他用户名！') return this.$message.error(res.message)
          if (res.status !== 0) return this.$message.error('新增用户失败！')
          this.$message.success('修改成功！')
          this.$refs.addUserRef.resetFields()
          this.$router.push({path:'user-list'})
        } else {
          // 未通过校验
          return false
        }
      })
    },
    // 重置按钮点击事件
    resetFn() {
      // el-form 提供了一个重置表单（并且还能重置报错提示）
      this.$confirm('确定执行重置操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$refs.addUserRef.resetFields()
        this.$message.success('重置成功')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.the_img{
  height: 100px;
  width: 100px;
}
.border{
  border: 1px solid rgb(102, 102, 200);
  border-radius: 10px;

}
.box-card{
  position: relative;
}
.dialog-footer-right {
  position: absolute;
  right: 80px;
  top: 4.2px;
}
</style>
