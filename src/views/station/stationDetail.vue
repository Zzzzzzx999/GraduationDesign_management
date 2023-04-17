<template>
  <div class="app-container-detail"  element-loading-text="系统处理中，请稍等"  v-loading.lock="fullscreenLoading">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>电台详情</span>
        </div>
        <div class="dialog-footer-right">
          <!-- <el-button type="primary" @click="submitFn">提交</el-button>
          <el-button @click="resetFn">重置</el-button> -->
          <el-button type="primary" @click="backList">返回</el-button>
        </div>
        <el-form :model="newStationForm" ref="addStationRef" :inline="true" label-width="100px" label-position="top">
          <el-row>
            <el-form-item label="主题背景" required prop="cover_image">
              <div>
                <img v-if="!newStationForm.cover_image" class="the_img border" src="../../assets/images/avatar.jpg" alt="" />
                <img v-else class="the_img border" :src="newStationForm.cover_image" alt="">
                <div class="btn-box">
                  <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange"/>
                </div>
              </div>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="电台ID" clearable required prop="id">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')" disabled
                v-model="newStationForm.id" :placeholder="placeholderInput" clearable />
            </el-form-item>
            <el-form-item label="电台标题" clearable required prop="title">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')" disabled
                v-model="newStationForm.title" :placeholder="placeholderInput" clearable />
            </el-form-item>
            <el-form-item label="电台内容" clearable required prop="content">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')" disabled
                v-model="newStationForm.content" :placeholder="placeholderInput" clearable />
            </el-form-item>
            <el-form-item label="电台类型" clearable required prop="cateName">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')" disabled
                v-model="newStationForm.cateName" :placeholder="placeholderInput" clearable />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="发布日期" clearable props="pub_date">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')" disabled
                v-model="newStationForm.pub_date" :placeholder="placeholderInput" clearable />
              <!-- <el-date-picker
                v-model="newStationForm.pub_date"
                type="date"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd"
                @change="handleHistoryData"
                disabled>
              </el-date-picker> -->
            </el-form-item>
            <!-- <el-form-item label="发布者" prop="author">
              <el-input onkeyup="value=value.replace(/^\s+|\s+$/g,'')"  disabled
                v-model="newStationForm.author" :placeholder="placeholderInput"/>
            </el-form-item> -->
            <el-form-item label="发布者" prop="author">
              <el-input v-model="newStationForm.author" disabled></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </el-card>
    </div>
</template>

<script>
import { reguserStationAPI,getStationInfoAPI } from '@/api/radioStation'
export default {
  name: 'newUser',
  data () {
    return {
      newStationForm:{
        cover_image:'',
        title:'',
        content:'',
        pub_date:'',
        id:'',
        cateName:'',
        author:this.$store.state.userInfo.name,
      },
      placeholderInput:'',
      fullscreenLoading:false,
      activeName:null,
    }
  },
  created () {
    this.getCurrentTime()
  },
  mounted(){
    console.log('query',this.$route.query);
    if (this.$route.query.id) {
      this.userid = this.$route.query.id;
      setTimeout(() => {
        getStationInfoAPI(this.userid).then((res) => {
          this.newStationForm = res.data.profile[0];
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
      const files = e.target.files // 拿到电台选择的文件数组
      if (files.length === 0) {
        // 证明刚刚文件选择窗口打开了，但是它是一个文件都没选择然后点击了确定关闭选择弹窗
      } else {
        // 证明选择了文件（默认只能选一个，如果选择多个需要给input标签加额外原生属性）
        console.log(files[0])
        const fr = new FileReader()
        fr.readAsDataURL(files[0])// 传入文件对象开始读
        fr.onload = (e) => { // onload等待把文件读成base64字符串后会触发onload事件函数
          // e.target.result的值就是读完的结果
          this.newStationForm.cover_image = e.target.result// 赋值给变量，让他显示在img的src里
        }
      }
    },
    submitFn () {
      this.$refs.addStationRef.validate(async valid => {
        if (valid) {
          const { data: res } = await reguserStationAPI(this.newStationForm)
          if (res.status == 1 && res.message == '电台名被占用，请更换其他电台名！') return this.$message.error(res.message)
          if (res.status !== 0) return this.$message.error('新增电台失败！')
          this.$message.success('新增成功！')
          this.$refs.addStationRef.resetFields()
          this.$router.push({path:'station-list'})
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
        this.$refs.addStationRef.resetFields()
        this.$message.success('重置成功')
      })
    },
    // 获取日期
    handleHistoryData(val) {
      console.log(val)
      this.newStationForm.pub_date = val
    },
    // 获取当前日期
    getCurrentTime() {
      let currentTime = new Date(), year = currentTime.getFullYear(),
      month = currentTime.getMonth() + 1 < 10 ? '0' + (currentTime.getMonth() + 1) : currentTime.getMonth() + 1,
      day = currentTime.getDate() < 10 ? '0' + currentTime.getDate() : currentTime.getDate()
      this.newStationForm.pub_date = year + '-' + month + '-' + day
    },
    backList(){
      this.$router.push({path:'station-list'})
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
