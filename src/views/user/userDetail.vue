<template>
  <div class="app-container-detail">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>新增用户</span>
        </div>
        <div class="dialog-footer-right">
          <el-button type="primary"  @click="backTo">返回</el-button>
        </div>
        <el-form :model="newUserForm" ref="addUserRef" :inline="true" label-width="100px" label-position="top" element-loading-text="系统处理中，请稍等" v-loading.lock="fullscreenLoading">
          <el-row>
            <el-form-item label="头像" required prop="user_pic">
              <div>
                <img v-if="!newUserForm.user_pic" class="the_img border" src="../../assets/images/avatar.jpg" alt=""/>
                <img v-else class="the_img border" :src="newUserForm.user_pic" alt="">
                <div class="btn-box">
                  <input type="file" accept="image/*" style="display: none" ref="iptRef"/>
                </div>
              </div>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="用户名" clearable required prop="username">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.username" :placeholder="placeholderInput" clearable :disabled="disabled"/>
            </el-form-item>
            <el-form-item label="密码" clearable required prop="password">
              <el-input show-password onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.password" :placeholder="placeholderInput" clearable :disabled="disabled"/>
            </el-form-item>
            <el-form-item label="昵称" clearable required prop="nickname">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.nickname" :placeholder="placeholderInput" clearable :disabled="disabled"/>
            </el-form-item>
            <el-form-item label="邮箱" clearable required prop="email">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.email" :placeholder="placeholderInput" clearable :disabled="disabled"/>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="成长值" clearable prop="growthValue">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.growthValue" :placeholder="placeholderInput" clearable :disabled="disabled"/>
            </el-form-item>
            <el-form-item label="作品" clearable prop="works">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.works" :placeholder="placeholderInput" clearable :disabled="disabled"/>
            </el-form-item>
            <el-form-item label="关注" clearable prop="follows">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.follows" :placeholder="placeholderInput" clearable :disabled="disabled"/>
            </el-form-item>
            <el-form-item label="粉丝" clearable prop="followeds">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.followeds" :placeholder="placeholderInput" clearable :disabled="disabled"/>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="礼物" clearable prop="giftsReceived">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"
                v-model="newUserForm.giftsReceived" :placeholder="placeholderInput" clearable :disabled="disabled"/>
            </el-form-item>
            <el-form-item label="个性签名" clearable prop="signature">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')" style="width: 450px"
                v-model="newUserForm.signature" :placeholder="placeholderInput" clearable :disabled="disabled"/>
            </el-form-item>
          </el-row>
        </el-form>
      </el-card>
    </div>
</template>

<script>
import { getUserInfoAPI } from '@/api/user'

export default {
  name: 'userDetail',
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
      disabled:true,
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
          this.fullscreenLoading = false;
        }).catch(err=>{
          this.fullscreenLoading = false;
          console.log('err',err);
        })
      }, 500);
    }
  },
  methods: {
    // 返回按钮点击事件
    backTo(){
      this.$router.push({path:"user-list"})
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
