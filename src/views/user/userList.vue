<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>用户列表</span>
        <el-button type="primary" size="mini" @click="addCateShowDialogFn">添加用户</el-button>
        <!-- <el-button icon="el-icon-document-add" @click="handleAdd" class="ems-button">新建</el-button> -->
        <el-button icon="el-icon-edit" :disabled="buttonEdit" @click="handleUpdate(ids,'edit')" class="ems-button">编辑</el-button>
        <el-button icon="el-icon-document" :disabled="buttonDetail" @click="handleUpdate(ids,'detail')" class="ems-button">详情</el-button>
        <el-button icon="el-icon-delete" :disabled="buttonDel" @click="handleDelete" class="ems-button">删除</el-button>
      </div>
      <!-- 分类数据表格 -->
      <el-table :data="userList" style="width: 100%" border stripe>
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
import { getUserListAPI } from '@/api'
export default {
  name: 'ArtCate',
  data () {
    return {
      userList: [], // 文章分类数组
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
      },
      buttonEdit:false,
      buttonDetail:false,
      buttonDel:false,
    }
  },
  created () {
    this.getUserListAPI()
  },
  methods: {
    // 获取文章分类列表
    async getUserListAPI () {
      const res = await getUserListAPI()
      this.userList = res.data.data
      console.log(this.userList);
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
    dialogCloseFn () {
      this.$refs.addRef.resetFields()
    },
    handleUpdate(row, stous) {
        console.log(row[0],stous);
        if (stous == "edit") {
            const clientIds = row[0] || this.ids[0];
            this.$router.push({
              path: "/development/market/marketedit",
              query: {
                code: clientIds,
                operationType: "2",
              },
            });
        } else if (stous == "detail") {
          const clientIds = row[0] || this.ids[0];
          console.log(clientIds);
          this.$router.push({
            path: "/development/market/marketdetail",
            query: {
              code: clientIds,
              operationType: "3",
            },
          });
        } else if (stous == "change") {
          const clientIds = row[0] || this.ids[0];
          this.$router.push({
            path: "/development/market/marketchange",
            query: {
              code: clientIds,
              operationType: "4",
            },
          });
        }
    },
    /** 删除按钮操作 */
      handleDelete(row) {
        const clientIds = row[0] || this.ids;
        console.log(clientIds);
        this.$confirm("确定删除所选行？", "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(function() {
            // return delMarket(clientIds);
          })
          .then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          })
          // .then(() => (this.open = false));
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
</style>
