<template>
  <div class="app-container-detail"  element-loading-text="系统处理中，请稍等"  v-loading.lock="fullscreenLoading">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>新增用户</span>
        </div>
        <!-- <div class="dialog-footer-right">
          <el-button type="primary" @click="submitFn">提交</el-button>
          <el-button @click="resetFn">重置</el-button>
        </div> -->
        <el-form :model="newUserForm" ref="addUserRef" :inline="true" label-width="100px" label-position="top">
          <el-row>
            <el-form-item label="头像" required>
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
            <el-col>
              <el-form-item label="用户名" clearable required>
                <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                  v-model="newUserForm.username" :placeholder="placeholderInput" clearable />
              </el-form-item>
              <el-form-item label="密码" clearable required>
                <el-input show-password onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                  v-model="newUserForm.password" :placeholder="placeholderInput" clearable />
              </el-form-item>
              <el-form-item label="昵称" clearable required>
                <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                  v-model="newUserForm.nickname" :placeholder="placeholderInput" clearable />
              </el-form-item>
              <el-form-item label="邮箱" clearable required>
                <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                  v-model="newUserForm.email" :placeholder="placeholderInput" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="成长值" clearable>
                <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                  v-model="newUserForm.growthValue" :placeholder="placeholderInput" clearable />
              </el-form-item>
              <el-form-item label="作品" clearable>
                <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                  v-model="newUserForm.works" :placeholder="placeholderInput" clearable />
              </el-form-item>
              <el-form-item label="关注" clearable>
                <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                  v-model="newUserForm.follows" :placeholder="placeholderInput" clearable />
              </el-form-item>
              <el-form-item label="粉丝" clearable>
                <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                  v-model="newUserForm.followed" :placeholder="placeholderInput" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="礼物" clearable>
                <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                  v-model="newUserForm.giftsReceived" :placeholder="placeholderInput" clearable />
              </el-form-item>
              <el-form-item label="个性签名" clearable>
                <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                  v-model="newUserForm.signature" :placeholder="placeholderInput" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col>
              <el-form-item>
                <el-button type="primary" @click="submitFn">提交修改</el-button>
                <el-button @click="resetFn">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row> -->
        </el-form>
      </el-card>
    </div>
</template>

<script>
import { getUserInfoAPI } from '@/api'
export default {
  name: 'ArtCate',
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
        followed:'',
        giftsReceived:'',
        signature:'',
      },
      placeholderInput:'',
      fullscreenLoading:false,
      activeName:null,
    }
  },
  created () {
    // this.getArtCateFn()
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
          this.uploadFn()
        }
      }
    },
    // 上传图片
    async uploadFn () {
      // console.log(this.$store.state.userInfo.id)
      /* const { data: res } = await updateUserAvatarAPI(this.newUserForm.user_pic, this.$store.state.userInfo.id)
      if (res.status !== 0) return this.$message.error(res.message)
      // 更新头像成功
      this.$message.success(res.message)
      // 立刻让vuex里actions(获取用户信息的actions)再请求一次后台更新Vuex里的值
      this.$store.dispatch('getUserInfoActions') */
    },
    submitFn () {
      this.$refs.addUserRef.validate(async valid => {
        if (valid) {
          // console.log(this.userForm)
          // // 因为后端更新用户基本资料接口，需要带id过去，userForm对象里本身没有
          // // 所有缺少id,就给他添加一个
          // this.userForm.id = this.$store.state.userInfo.id
          // const { data: res } = await updateUserInfoAPI(this.userForm)
          // if (res.status !== 0) return this.$message.error('更新用户信息失败！')
          // // 更新用户信息成功，刷新 Vuex 中的数据
          // this.$message.success('更新成功！')
          // // 更新让vuex获取下最新的用户数据
          // this.$store.dispatch('getUserInfoActions')
        } else {
          // 未通过校验
          return false
        }
      })
    },
    // 重置按钮点击事件
    resetFn() {
      // el-form 提供了一个重置表单（并且还能重置报错提示）
      console.log('@',this.$refs);
      this.$refs.addUserRef.resetFields()
      console.log('@1',this.newUserForm);
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
