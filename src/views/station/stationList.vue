<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>电台列表</span>
        <!-- <el-button type="primary" size="mini" @click="addCateShowDialogFn">添加电台</el-button> -->
        <!-- <el-button icon="el-icon-document-add" @click="handleAdd" class="ems-button">新建</el-button> -->
      </div>
      <div class="dialog-footer-right">
        <el-button icon="el-icon-document-add" size="mini" type="primary" @click="addStation">添加</el-button>
        <el-button icon="el-icon-edit" size="mini" type="primary" :disabled="buttonEdit" @click="handleUpdate('edit')">编辑</el-button>
        <el-button icon="el-icon-document" size="mini" type="info" :disabled="buttonDetail" @click="handleUpdate('detail')">详情</el-button>
        <el-button icon="el-icon-delete" size="mini" type="danger" :disabled="buttonDel" @click="handleDelete">删除</el-button>
      </div>
      <!-- 分类数据表格 -->
      <el-table :data="stationList" style="width: 100%" border stripe @selection-change="handleSelectionChange" element-loading-text="系统处理中，请稍等"  v-loading.lock="fullscreenLoading">
        <!-- type是table-column内置属性，你告诉他用index，意思就是第一个单元格用索引值 -->
           <el-table-column fixed type="selection" align="center" min-width="100"/>
           <!-- <el-table-column fixed type="index" label="序号" align="center" min-width="100"/> -->
           <el-table-column fixed prop="id" label="id" align="center" min-width="70"/>
           <el-table-column fixed label="主题背景" align="center" prop="cover_image" min-width="100" >
            <template slot-scope="scope">
              <el-image v-if="scope.row.cover_image"
                style="width: 50px; height: 50px" :src="scope.row.cover_image" fit="true"></el-image>
            </template>
          </el-table-column>
           <el-table-column prop="title" label="电台标题" align="center" min-width="150"/>
           <el-table-column prop="content" label="电台内容" align="center" min-width="150"/>
           <el-table-column prop="cateName" label="电台类型" align="center" min-width="100"/>
           <el-table-column prop="author" label="发布者" align="center" min-width="70"/>
           <el-table-column prop="pub_date" label="发布日期" align="center" min-width="70"/>
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
import { getStationListAPI,deleteStationAPI } from '@/api/radioStation'
export default {
  name: 'stationList',
  data () {
    return {
      stationList: [], // 电台列表数组
      selection:[], // 当前选择电台
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
      this.getStationListAPI()
    }, 800);
  },
  methods: {
    // 获取电台分类列表
    async getStationListAPI () {
      const res = await getStationListAPI()
      /* let params = {
        offset: (this.currentPage - 1) * this.pageSize,
        limit: this.pageSize
      } */
      this.stationList = res.data.data
      let pageFirst = ((this.currentPage-1)*this.pageSize)
      let pageLast = ((this.currentPage)*this.pageSize)
      this.stationList = this.stationList.slice(pageFirst, pageLast);
      this.total = res.data.data.length;
      this.fullscreenLoading = false
      console.log(this.stationList);
    },
    addStation() {
      this.$router.push({path:'station-add'})
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
        path: `station-${stous}`,
        query: {
          id: clientId,
        },
      });
    },
    /** 删除按钮操作 */
    handleDelete() {
      console.log('this.selection.length',this.selection.length);
      this.$confirm("确定删除所选电台？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        if (this.selection.length > 1) {
          var a = 0
          for (let key in this.selection) {
            deleteStationAPI(this.selection[key].id).then( res =>{
              if (res.data.status == 0){
                a = a + 1
              }
            })
          }
          setTimeout(() => {
            if (a == this.selection.length) {
              // 删除电台成功
              this.$message.success('删除电台成功!')
            }else{
              this.$message.error('删除电台失败!')
            }
          }, 100);
        }else{
          deleteStationAPI(this.selection[0].id).then( res =>{
            if (res.data.status !== 0) return this.$message.error(res.data.message)
            // 删除电台成功
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
      this.getStationListAPI();
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
