<template>
  <div class="customerDetails">
    <div>
      <el-button type="text" @click="backHandler">返回</el-button>
    </div>
    <div>
      <el-tabs v-model="activeName">
        <!-- 地址信息 -->
        <el-tab-pane label="地址信息" name="first">
          <el-row>
            <el-button type="primary" @click="toAddHandler">添加</el-button>
          </el-row>
          <el-table ref="multipleTable" size="small" :data="address" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" />
            <el-table-column prop="id" label="编号" />
            <el-table-column prop="province" label="省份" />
            <el-table-column prop="city" label="城市" />
            <el-table-column prop="area" label="地区" />
            <el-table-column prop="telephone" label="电话" />
            <el-table-column prop="customerId" label="顾客编号" />
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
              </template>
            </el-table-column>
          </el-table>
          <!--模态框 -->
          <el-dialog title="添加地址信息" :visible.sync="visible" width="50%" :before-close="closeModal">
            <el-form ref="ruleForm" :inline="true" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm-inline">
              <el-form-item label="省份" prop="province">
                <el-input v-model="ruleForm.province" />
              </el-form-item>
              <el-form-item label="城市" prop="city">
                <el-input v-model="ruleForm.city" autocomplete="off" />
              </el-form-item>
              <el-form-item label="地区" prop="area">
                <el-input v-model="ruleForm.area" />
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-input v-model="ruleForm.address" />
              </el-form-item>
              <el-form-item label="电话" prop="telephone">
                <el-input v-model.number="ruleForm.telephone" />
              </el-form-item>
              <!-- <el-form-item label="顾客" prop="customerId">
                                <el-input v-model="ruleForm.customerId"></el-input>
                            </el-form-item> -->
              <el-form-item label="顾客" prop="customerId">
                <el-select v-model="ruleForm.customerId" placeholder="请选择顾客">
                  <el-option v-for="customer in customers" :key="customer.id" :label="customer.realname" :value="customer.id" />
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="closeModal">取 消</el-button>
              <el-button type="primary" @click="submitHandle">确 定</el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
        <!-- /地址信息 -->
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      activeName: 'first',
      ruleForm: {
      },
      rules: {
        province: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('address', ['address', 'visible', 'customers'])
  },
  created() {
    this.refreshPage()
    this.customerSelect()
  },
  methods: {
    ...mapMutations('address', ['showModal', 'closeModal']),
    ...mapActions('address', ['findByCustomerId', 'saveOrUpdateAddress', 'customerSelect', 'deleteAddressById']),
    // 普通方法
    // 返回
    backHandler() {
      // this.$router.push("/customer")
      this.$router.go(-1)
    },
    // 刷新页面
    refreshPage() {
      // 获取customerid
      const id = this.$route.query.id
      this.findByCustomerId(id)
    },
    // 添加按钮打开模态框
    toAddHandler() {
      this.ruleForm = {}
      this.showModal()
    },
    // 模态框表单提交
    submitHandle() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const promise = this.saveOrUpdateAddress(this.ruleForm)
          // promise为action函数的返回值,异步函数的返回值为prom ise的then中回调函数的参数
          promise.then(() => {
            this.findByCustomerId(this.ruleForm.customerId)
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
    updateHandler(address) {
      this.ruleForm = address
      this.showModal()
    },
    // 删除
    deleteHandler(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAddressById(id)
          .then(() => {
            this.refreshPage()
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
    }
  }

}
</script>

