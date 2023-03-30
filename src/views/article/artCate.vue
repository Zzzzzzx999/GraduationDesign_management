<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addCateShowDialogFn">添加分类</el-button>
      </div>
      <!-- 分类数据表格 -->
      <el-table :data="cateList" style="width: 100%" border stripe>
        <!-- type是table-column内置属性，你告诉他用index，意思就是第一个单元格用索引值 -->
           <el-table-column type="index" label="序号" width="100"></el-table-column>
           <el-table-column props="cate_name" label="分类名称"></el-table-column>
           <el-table-column props="cate_alias" label="分类别名"></el-table-column>
           <el-table-column label="操作">
             <el-button type="primary" size="mini">修改</el-button>
             <el-button type="danger" size="mini">删除</el-button>
           </el-table-column>
         </el-table>
    </el-card>
    <!-- 添加文章分类对话框 -->
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
     <el-form-item label="分类名称" prop="cate_name">
       <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
     </el-form-item>
     <el-form-item label="分类别名" prop="cate_alias">
       <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
     </el-form-item>
   </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancelFn">取 消</el-button>
    <el-button type="primary" @click="confirmFn">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import { getUserInfoAPI } from '@/api'
export default {
  name: 'ArtCate',
  data () {
    return {
      cateList: [], // 文章分类数组
      dialogVisible: false,
      // ...其他
      addForm: { // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      addRules: { // 添加表单的验证规则对象
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getArtCateFn()
  },
  methods: {
    // 获取文章分类列表
    async getArtCateFn () {
      const res = await getUserInfoAPI()
      this.cateList = res.data.data
    },
    // 点击让对话框显示
    addCateShowDialogFn () {
      this.dialogVisible = true
    },
    cancelFn () {
      this.dialogVisible = false
    },
    confirmFn () {
      this.dialogVisible = false
    },
    // 对话框-关闭时的回调
    dialogCloseFn() {
      this.$refs.addRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
