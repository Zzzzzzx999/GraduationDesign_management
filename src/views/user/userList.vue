<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>用户列表</span>
        <!-- <el-button type="primary" size="mini" @click="addCateShowDialogFn">添加用户</el-button> -->
        <!-- <el-button icon="el-icon-document-add" @click="handleAdd" class="ems-button">新建</el-button> -->
      </div>
      <div class="dialog-footer-right">
        <el-button icon="el-icon-document-add" size="mini" type="primary" @click="addUser">添加</el-button>
        <el-button icon="el-icon-edit" size="mini" type="primary" :disabled="buttonEdit" @click="handleUpdate('edit')">编辑</el-button>
        <el-button icon="el-icon-document" size="mini" type="info" :disabled="buttonDetail" @click="handleUpdate('detail')">详情</el-button>
        <el-button icon="el-icon-delete" size="mini" type="danger" :disabled="buttonDel" @click="handleDelete">删除</el-button>
      </div>
      <!-- 分类数据表格 -->
      <el-table :data="userList" style="width: 100%" border stripe @selection-change="handleSelectionChange" element-loading-text="系统处理中，请稍等"  v-loading.lock="fullscreenLoading">
        <!-- type是table-column内置属性，你告诉他用index，意思就是第一个单元格用索引值 -->
           <el-table-column fixed type="selection" align="center" min-width="100"/>
           <!-- <el-table-column fixed type="index" label="序号" align="center" min-width="100"/> -->
           <el-table-column fixed prop="id" label="id" align="center" min-width="70"/>
           <!-- <el-table-column prop="user_pic" label="头像" align="center" min-width="100"/> -->
           <el-table-column fixed label="图片" align="center" prop="user_pic" min-width="100" >
            <template slot-scope="scope">
              <el-image v-if="scope.row.user_pic"
                style="width: 50px; height: 50px" :src="scope.row.user_pic" fit="true"></el-image>
            </template>
          </el-table-column>
           <el-table-column prop="username" label="用户名" align="center" min-width="150"/>
           <el-table-column prop="nickname" label="昵称" align="center" min-width="150"/>
           <el-table-column prop="email" label="邮箱" align="center" min-width="100"/>
           <el-table-column prop="growthValue" label="成长值" align="center" min-width="70"/>
           <el-table-column prop="works" label="作品" align="center" min-width="70"/>
           <el-table-column prop="follows" label="关注" align="center" min-width="70"/>
           <el-table-column prop="followeds" label="粉丝" align="center" min-width="70"/>
           <el-table-column prop="giftsReceived" label="礼物" align="center" min-width="70"/>
           <el-table-column prop="signature" label="个性签名" align="center" min-width="250"/>
           <!-- <el-table-column label="操作">
             <el-button type="primary" size="mini">修改</el-button>
             <el-button type="danger" size="mini">删除</el-button>
           </el-table-column> -->
         </el-table>
         <el-pagination v-show="total > 0" :total="total" :current-page.sync="currentPage"
           :page-size="pageSize" @current-change="handlePageChange"/>
    </el-card>
  </div>
</template>

<script>
import { getUserListAPI } from '@/api'
import { deleteUserAPI } from '@/api/user'
export default {
  name: 'userList',
  data () {
    return {
      userList: [], // 用户列表数组
      selection:[], // 当前选择用户
      buttonEdit:true,
      buttonDetail:true,
      buttonDel:true,
      fullscreenLoading:true,
      total:0,
      pageSize:5,
      currentPage:1,
    }
  },
  created () {
    setTimeout(() => {
      this.getUserListAPI()
    }, 800);
  },
  methods: {
    // 获取用户分类列表
    async getUserListAPI () {
      const res = await getUserListAPI()
      /* let params = {
        offset: (this.currentPage - 1) * this.pageSize,
        limit: this.pageSize
      } */
      this.userList = res.data.data
      let pageFirst = ((this.currentPage-1)*this.pageSize)
      let pageLast = ((this.currentPage)*this.pageSize)
      this.userList = this.userList.slice(pageFirst, pageLast);
      this.total = res.data.data.length;
      this.fullscreenLoading = false
      console.log(this.userList);
    },
    addUser() {
      this.$router.push({path:'user-add'})
    },
    handleSelectionChange(selection){
      console.log('section',selection)
      this.selection = selection
      if (selection.length == 0) {
        this.buttonEdit = true
        this.buttonDetail = true
        this.buttonDel = true
      }
      else if (selection.length > 0) {
        this.buttonDel = false
        if (selection.length == 1) {
          this.buttonEdit = false
          this.buttonDetail = false
        }else{
          this.buttonEdit = true
          this.buttonDetail = true
        }
      }else{
        this.buttonDel = true
      }
    },
    handleUpdate(stous){
      let clientId = this.selection[0].id
      this.$router.push({
        path: `user-${stous}`,
        query: {
          id: clientId,
        },
      });
    },
    /** 删除按钮操作 */
    handleDelete() {
      // let clientId = this.selection[0].id
      // console.log(clientId);
      console.log('this.selection.length',this.selection.length);
      this.$confirm("确定删除所选用户？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        if (this.selection.length > 1) {
          var a = 0
          for (let key in this.selection) {
            deleteUserAPI(this.selection[key].id).then( res =>{
              if (res.data.status == 0){
                a = a + 1
              }
            })
          }
          setTimeout(() => {
            if (a == this.selection.length) {
              // 删除用户成功
              this.$message.success('删除用户成功!')
            }else{
              this.$message.error('删除用户失败!')
            }
          }, 100);
        }else{
          deleteUserAPI(this.selection[0].id).then( res =>{
            if (res.data.status !== 0) return this.$message.error(res.data.message)
            // 删除用户成功
            this.$message.success(res.data.message)
          })
        }
      })
      .then(() => {
        console.log('@@@');
        this.$router.go(0)
      })
    },
    handlePageChange(newPage) {
      // 获取新的数据并更新页面
      this.currentPage = newPage;
      this.getUserListAPI();
      // this.userList = 
    },
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box-card{
  position: relative;
}
.dialog-footer-right {
  position: absolute;
  right: 30px;
  top: 18px;
}
</style>
