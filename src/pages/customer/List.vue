<template>
  <div class="customer">
    <!-- 按钮 -->
    <el-row>
      <el-col :span="20">
        <el-form :inline="true">
          <el-form-item label="姓名">
            <el-input v-model="params.realname" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchHandle">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="toAddHandler">添加</el-button>
        <el-button type="danger" @click="batchDeleteHandler">批量删除</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <div>
      <el-table ref="multipleTable" v-loading="loading" size="small" :data="customers.list" tooltip-effect="dark" style="width: 100%" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <el-table-column prop="id" label="编号" />
        <el-table-column prop="realname" label="姓名" />
        <el-table-column prop="telephone" label="电话" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="photo" label="照片" />
        <el-table-column label="操作">
          <template #default="record">
            <!-- 修改按钮 -->
            <a href="" style="margin-right:10px;color:#409eff" @click.prevent="updateHandler(record.row)">
              <i class="el-icon-edit" />
            </a>
            <!-- 删除 -->
            <a href="" style="margin-right:10px;color:#F56C6C" @click.prevent="deleteHandler(record.row.id)">
              <i class="el-icon-delete" />
            </a>
            <!-- 详情 -->
            <el-button size="small" type="text" @click="detailsHandler(record.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next"
      :page-size="params.pageSize"
      :current-page="params.page+1"
      :total="customers.total"
      @current-change="pageChangeHandle"
    />
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" width="50%" :before-close="closeModal" @close="dialogCloseHandler">
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="ruleForm.realname" minlength="2" maxlength="8" show-word-limit />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号" prop="telephone">
          <el-input v-model.number="ruleForm.telephone" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal">取 消</el-button>
        <el-button type="primary" @click="submitHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var checkTelephone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      setTimeout(() => {
        // if (!Number.isInteger(value)) {
        //     callback(new Error('请输入数字值'));
        // } else {
        // 正则表达式验证手机号
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (!myreg.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
        // }
      }, 200)
    }
    return {
      ids: [],
      params: {
        page: 0,
        pageSize: 5
      },
      ruleForm: {
        realname: '',
        password: '',
        telephone: ''
      },
      rules: {
        realname: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, required: true, trigger: 'blur' }
        ],
        telephone: [
          { validator: checkTelephone, required: true, trigger: 'blur' }
        ]
      }

    }
  },
  computed: {
    // 映射 store->vue
    // customers:function(customer){
    //     return this.$store.state.customers;
    // },
    ...mapState('customer', ['customers', 'visible', 'title', 'loading'])
  },
  created() {
    this.queryFindCustomers(this.params)
  },
  methods: {
    // 分发动作,提交突变
    // showModal(){
    //    return this.$store.commit("showmodal");
    // }
    // 打开关闭模态框
    ...mapMutations('customer', ['showModal', 'closeModal', 'setTitle']),
    // 重载数据
    ...mapActions('customer', ['queryFindCustomers', 'saveOrUpdateCustomer', 'deleteCustomerById', 'batchDeleteCustomers']),

    // 普通方法
    // 分页按钮
    pageChangeHandle(page) {
      this.params.page = page - 1
      this.queryFindCustomers(this.params)
    },

    // 添加按钮打开模态框
    toAddHandler() {
      this.ruleForm = {}
      this.showModal()
    },
    dialogCloseHandler() {
      this.$refs.ruleForm.resetFields()
    },
    // 模态框表单提交
    submitHandle() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const promise = this.saveOrUpdateCustomer(this.ruleForm)
          // promise为action函数的返回值,异步函数的返回值为prom ise的then中回调函数的参数
          promise.then(() => {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改
    updateHandler(customer) {
      this.ruleForm = customer
      this.setTitle('修改顾客信息')
      this.showModal()
    },
    // 删除
    deleteHandler(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteCustomerById(id)
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 批量删除
    batchDeleteHandler() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.batchDeleteCustomers(this.ids)
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取表格id
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id)
    },
    // 详情页面
    detailsHandler(customer) {
      // this.$router.push('/customerDetails')
      this.$router.push({
        path: '/customer/details',
        query: { id: customer.id }
      })
    },
    // 查询按钮
    searchHandle() {
      this.queryFindCustomers(this.params)
    }

  }
}
</script>

