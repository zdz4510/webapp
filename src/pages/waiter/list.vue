<template>
  <div id="wapper">
    <h5>员工管理</h5>
    <!-- {{products}} -->
    <div style="margin-bottom:10px">{{ waiterIds }}</div>
    <el-row>
      <el-col :span="20">
        <el-form :inline="true">
          <el-form-item label="姓名">
            <el-input v-model="param.realname" placeholder="关键字查询" clearable />
          </el-form-item>
          <el-form-item><div>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </div></el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <!-- <el-button @click="add">添加</el-button> -->
        <!-- <el-button type="danger" @click="deletemoerhandler">批量删除</el-button> -->
      </el-col>
    </el-row>
    <el-table :data="waiters.list" style="width: 100%" size="mini" @selection-change="handleSelectionChange">
      <!-- 这里的多选框已经被上面的代码给绑定过事件，所以不用:value="products.id"的传递参数，但他获得的是整个所选中的全部属性和值，而我们要的是id所组成的数组，就要在多一步将传递的数据改变；*将数组对象转化为数组操作*-->
      <el-table-column type="selection" />
      <el-table-column prop="telephone" label="telephone" />
      <el-table-column prop="password" label="password" />
      <el-table-column prop="realname" label="realname" />
      <el-table-column prop="gender" label="gender" />
      <el-table-column prop="status" label="status" />
      <!-- <el-table-column prop="addressId" label="addressId">
    </el-table-column> -->
      <el-table-column prop="" label="操作">
        <template v-slot:default="scope">
          <!-- 如何传递参数给点击函数 -->
          <el-button size="mini" type="primary" circle @click="updata(scope.row)">审核</el-button>
          <!-- <el-button size="mini" @click="updata(scope.row)" type="primary" icon="el-icon-edit" circle></el-button> -->
          <!-- <el-button size="mini" type="danger" @click="deleteByIdhandler(scope.row.id)" icon="el-icon-delete" circle></el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:10px;margin-bottom:10px;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="waiters.total"
        :page-size="param.pageSize"
        :current-page="param.page+1"
        @current-change="changepage"
      />
    </div>
    <el-dialog title="详细信息" :visible.sync="dialogFormVisible" :before-close="hidemodel" @close="closehandler">
      {{ waiter }}
      <el-form ref="waitersref" :model="waiter" :rules="rules">
        <el-form-item label="员工名称" :label-width="formLabelWidth" prop="realname">
          <el-input v-model="waiter.realname" />
        </el-form-item>
        <el-form-item label="员工电话" :label-width="formLabelWidth" prop="telephone">
          <el-input v-model="waiter.telephone" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="waiter.password" prop="password" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <template>
            <el-radio v-model="waiter.gender" label="男">男</el-radio>
            <el-radio v-model="waiter.gender" label="女">女</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="waiter.status" placeholder="">
            <el-option :key="1" :value="yes" :label="yes" />
            <el-option :key="2" :value="no" :label="no" />
            <el-option :key="3" :value="or" :label="or" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hidemodel">取 消</el-button>
        <el-button type="primary" @click="submitModal">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      yes: '已审核',
      no: '未审核',
      or: '未通过',
      waiter: {},
      formLabelWidth: '120px',
      waiterIds: [],
      rules: {
        realname: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '选择产品id', trigger: 'blur' }
        ]
        // status:[
        //     { required: true, message: '选择产品id', trigger: 'blur' }
        // ]
      },
      param: {
        page: 0,
        pageSize: 8
      }
    }
  },
  // 映射State和getters中的值；
  computed: {
    ...mapState('waiter', ['dialogFormVisible', 'title', 'waiters'])
  },
  created() {
    this.onSubmit()
  },
  // 映射mutations和actions中的方法；提交变动，调度动作；
  methods: {
    ...mapMutations('waiter', ['showmodel', 'hidemodel', 'settitle']),
    ...mapActions('waiter', ['saveOrUpdatewaiter', 'reloadDatequery']),
    add() {
      this.waiter = {}
      this.settitle('添加顾客信息')
      this.showmodel()
    },
    submitModal() {
      // $refs是ref的rules的所有集合，Productref是指定的，validata是ref中的一个方法，valid是方法调用的结果，它们是配合使用。
      this.$refs.waitersref.validate((valid) => {
        if (valid) {
          this.saveOrUpdatewaiter(this.waiter).then((response) => {
            // 数据刷新
            this.onSubmit()
            this.$message({ message: response.statusText, type: 'success' })
          }).catch((error) => {
            this.$message.error('错误信息：' + error)
          })
        } else {
          return false
        }
      })
    },
    updata(waiter) {
      this.waiter = waiter
      this.settitle('审核员工信息')
      this.showmodel()
    },
    handleSelectionChange(val) {
      // map属性：map()方法可以创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果
      this.waiterIds = val.map((item) => item.id)
    },
    // 表单重置为空：model关闭执行
    closehandler() {
      // 使用element-ui中的表单，人家给定的方法。
      this.$refs.waitersref.resetFields()
    },
    onSubmit() {
      this.reloadDatequery(this.param).then((response) => {
      })
    },
    changepage(page) {
      this.param.page = page - 1
      this.onSubmit()
    }
  }
}
</script>

<style scoped>

</style>
