<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>电台分类</span>
      </div>
      <div class="dialog-footer-right">
        <el-button icon="el-icon-document-add" type="primary" size="mini" @click="addCateShowDialogFn">添加</el-button>
        <el-button icon="el-icon-edit" type="primary" size="mini" :disabled="buttonEdit" @click="editCateShowDialogFn">修改</el-button>
        <el-button icon="el-icon-delete" type="danger" size="mini" :disabled="buttonDel" @click="deleteCate">删除</el-button>
      </div>
      <!-- 分类数据表格 -->
      <el-table :data="cateList" style="width: 100%" border stripe @selection-change="handleSelectionChange" element-loading-text="系统处理中，请稍等"  v-loading.lock="fullscreenLoading">>
        <!-- type是table-column内置属性，你告诉他用index，意思就是第一个单元格用索引值 -->
           <el-table-column fixed type="selection" align="center" min-width="100"/>
           <el-table-column prop="Id" label="id" width="150" align="center"></el-table-column>
           <el-table-column prop="name" label="分类名称" align="center"></el-table-column>
           <el-table-column prop="alias" label="分类别名" align="center"></el-table-column>
         </el-table>
      <el-pagination v-show="total > 0" :total="total" :current-page.sync="currentPage"
        :page-size="pageSize" @current-change="handlePageChange"/>
    </el-card>
    <!-- 添加电台分类对话框 -->
    <!-- el-dialog 对话框组件 -->
    <!--
      title:左上角标题
      visible:控制对话框是否显示（左侧vue变量为true显示，为false就隐藏）
      扩展知识点：.sync是vue3版本新增
      .sync类似v-model 可以给子组件实现“双向数据绑定”
      复习：v-model如何给子组件实现双向数据绑定（父vue变量要传给子组件，子组件传出的值也要自动绑定到父vue变量）
      v-model本质：给所在标签绑定：:value="vue变量" @input="val => value = val"
      <标签：：value= "vue变量" @input="val=>vue变量=val"></标签>
      vue2里面一个标签上v-model只能用一次 vue3里可以用多次

     -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      @close="dialogCloseFn"
      >
      <!-- 添加的表单 -->
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model.trim="addForm.name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="alias">
          <el-input v-model.trim="addForm.alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogEditVisible"
      width="30%"
      @close="dialogEditCloseFn"
      >
      <!-- 添加的表单 -->
      <el-form :model="addEditForm" :rules="addRules" ref="addEditRef" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model.trim="addEditForm.name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="alias">
          <el-input v-model.trim="addEditForm.alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEditFn">取 消</el-button>
        <el-button type="primary" @click="confirmEditFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getStationCates,addStationCates,deleteCateById,updateCateById} from '@/api/radioStation'
export default {
  name: 'StationCate',
  data () {
    return {
      cateList: [], // 电台分类数组
      dialogVisible: false,
      dialogEditVisible: false,
      // ...其他
      addForm: { // 添加表单的数据对象
        name: '',
        alias: ''
      },
      addEditForm: { // 添加表单的数据对象
        name: '',
        alias: ''
      },
      addRules: { // 添加表单的验证规则对象
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      },
      selection:[], // 当前选择类别
      buttonEdit:true,
      buttonDetail:true,
      buttonDel:true,
      fullscreenLoading:true,
      total:0,
      pageSize:8,
      currentPage:1,
    }
  },
  created () {
    setTimeout(() => {
      this.getStationCateFn()
    }, 800);
  },
  methods: {
    // 获取电台分类列表
    async getStationCateFn () {
      const res = await getStationCates()
      this.cateList = res.data.data
      let pageFirst = ((this.currentPage-1)*this.pageSize)
      let pageLast = ((this.currentPage)*this.pageSize)
      this.cateList = this.cateList.slice(pageFirst, pageLast);
      this.total = res.data.data.length;
      this.fullscreenLoading = false
    },
    // 点击让对话框显示
    addCateShowDialogFn () {
      this.dialogVisible = true
    },
    editCateShowDialogFn () {
      this.dialogEditVisible = true
      if (this.addEditForm.name == '' && this.addEditForm.alias == '') {
        this.addEditForm.name = this.selection[0].name
        this.addEditForm.alias = this.selection[0].alias
      }
    },
    cancelFn () {
      this.dialogVisible = false
    },
    cancelEditFn () {
      this.dialogEditVisible = false
    },
    confirmFn () {
      addStationCates(this.addForm).then(res=>{
        console.log('res',res);
        if (res.data.status == 1) {
          this.$message.error(res.data.message)
        }else{
          this.dialogVisible = false
          this.$message.success('新增成功！')
          this.$refs.addRef.resetFields()
          this.$router.go(0)
        }
      })
    },
    confirmEditFn () {
      let params = {
        id:this.selection[0].Id,
        name: this.addEditForm.name,
        alias: this.addEditForm.alias
      }
      updateCateById(params).then(res=>{
        console.log('res',res);
        if (res.data.status == 1) {
          this.$message.error(res.data.message)
        }else{
          this.dialogVisible = false
          this.$message.success('修改成功！')
          // this.$refs.addEditRef.resetFields()
          this.$router.go(0)
        }
      })
    },
    // 对话框-关闭时的回调
    dialogCloseFn() {
      this.$refs.addRef.resetFields()
    },
    dialogEditCloseFn() {
      this.$refs.addEditRef.resetFields()
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
    handlePageChange(newPage) {
      // 获取新的数据并更新页面
      this.currentPage = newPage;
      this.getStationCateFn()
    },
    deleteCate(){
      console.log('this.selection.length',this.selection.length);
      this.$confirm("确定删除所选类别？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        if (this.selection.length > 1) {
          var a = 0
          for (let key in this.selection) {
            deleteCateById(this.selection[key].id).then( res =>{
              if (res.data.status == 0){
                a = a + 1
              }
            })
          }
          setTimeout(() => {
            if (a == this.selection.length) {
              // 删除类别成功
              this.$message.success('删除类别成功!')
            }else{
              this.$message.error('删除类别失败!')
            }
          }, 100);
        }else{
          console.log('this.selection[0].id',this.selection[0].Id);
          deleteCateById(this.selection[0].Id).then( res =>{
            if (res.data.status !== 0) return this.$message.error(res.data.message)
            // 删除类别成功
            this.$message.success(res.data.message)
          })
        }
      })
      .then(() => {
        console.log('@@@');
        this.$router.go(0)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box-card{
  position: relative;
}
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dialog-footer-right {
  position: absolute;
  right: 30px;
  top: 18px;
}
</style>
