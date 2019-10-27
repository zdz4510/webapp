<template>
  <div id="wapper">
    <h5>栏目管理</h5>
    <!-- {{categorys}} -->
    <div style="margin-bottom:10px">{{ categoryIds }}</div>
    <el-row>
      <el-col :span="14">
        <el-button @click="add">添加</el-button>
        <el-button type="danger" @click="deletemoerhandler">批量删除</el-button>
      </el-col>
      <el-col :span="10">
        <el-form :inline="true">
          <el-form-item label="请输入关键字">
            <el-input v-model="param.name" placeholder="关键字查询" clearable />
          </el-form-item>
          <el-form-item><div>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </div></el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table :data="categories1.list" style="width: 100%" size="mini" @selection-change="handleSelectionChange">
      <!-- 这里的多选框已经被上面的代码给绑定过事件，所以不用:value="categorys.id"的传递参数，但他获得的是整个所选中的全部属性和值，而我们要的是id所组成的数组，就要在多一步将传递的数据改变；*将数组对象转化为数组操作*-->
      <el-table-column type="selection" />
      <el-table-column prop="name" label="name" />
      <el-table-column prop="num" label="num" />
      <el-table-column label="icon">
        <template #default="record">
          <img :src="record.row.icon" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="parentId" label="parentId" />
      <el-table-column label="操作">
        <template v-slot:default="scope">
          <!-- 如何传递参数给点击函数 -->
          <el-button size="mini" @click="updata(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="deleteByIdhandler(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:10px;margin-bottom:10px;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="categories.total"
        :page-size="param.pageSize"
        :current-page="param.page+1"
        @current-change="changepage"
      />
    </div>
    <el-dialog title="栏目详细信息" :visible.sync="dialogFormVisible" :before-close="hidemodel" @close="closehandler">
      {{ category }}
      <el-form ref="categoriesref" :model="category" :rules="rules">
        <el-form-item label="栏目名称：" :label-width="formLabelWidth" prop="name">
          <el-input v-model="category.name" />
        </el-form-item>
        <el-form-item label="栏目数量：" :label-width="formLabelWidth" prop="num">
          <el-input v-model="category.num" />
        </el-form-item>
        <el-form-item label="栏目图标：" :label-width="formLabelWidth">
          <el-input v-model="category.icon" />
        </el-form-item>
        <el-form-item label="栏目上级id" :label-width="formLabelWidth" prop="parentId">
          <el-select v-model="category.parentId" placeholder="">
            <!-- 一定要绑定key值，否则将报错 -->
            <el-option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</el-option>
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
      category: {},
      formLabelWidth: '120px',
      categoryIds: [],
      rules: {
        name: [
          { required: true, message: '请输入栏目名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '选择上级产品id', trigger: 'blur' }
        ]
      },
      param: {
        page: 0,
        pageSize: 8
      }
    }
  },
  // 映射State和getters中的值；
  computed: {
    ...mapState('categorys', ['dialogFormVisible', 'title', 'categories1', 'categories'])
    // ...mapState('categorys',['categories'])
  },
  created() {
    // this.refreshdata()
    this.onSubmit()
    this.reloadDataOrderIds()
  },
  // 映射mutations和actions中的方法；提交变动，调度动作；
  methods: {
    ...mapMutations('categorys', ['showmodel', 'hidemodel', 'settitle']),
    ...mapActions('categorys', ['reloadDate', 'saveOrUpdatecategory', 'deleteById', 'deletemoer', 'reloadDatequery', 'findAllCategories']),
    // ...mapActions('categorys',['findAllCategories']),
    add() {
      this.category = {}
      this.settitle('添加栏目信息')
      this.showmodel()
    },

    submitModal() {
      // $refs是ref的rules的所有集合，Productref是指定的，validata是ref中的一个方法，valid是方法调用的结果，它们是配合使用。
      this.$refs.categoriesref.validate((valid) => {
        if (valid) {
          this.saveOrUpdatecategory(this.category).then((response) => {
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
    updata(category) {
      this.category = category
      this.settitle('修改栏目信息')
      this.showmodel()
    },
    deleteByIdhandler(id) {
      this.deleteById(id).then((response) => {
        this.onSubmit()
        this.$message({ message: response.statusText, type: 'success' })
      })
    },
    handleSelectionChange(val) {
      // map属性：map()方法可以创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果
      this.categoriesIds = val.map((item) => item.id)
    },
    deletemoerhandler() {
      this.deletemoer(this.categoriesIds).then((response) => {
        this.onSubmit()
        this.$message({ message: response.statusText, type: 'success' })
      })
    },
    // 表单重置为空：model关闭执行
    closehandler() {
      // 使用element-ui中的表单，人家给定的方法。
      this.$refs.categoriesref.resetFields()
    },
    onSubmit() {
      // console.log(this.param)
      this.reloadDatequery(this.param).then((response) => {
      })
    },
    changepage(page) {
      this.param.page = page - 1
      this.onSubmit()
    },
    reloadDataOrderIds() {
      this.findAllCategories()
    }
  }
}
</script>

<style scoped>

</style>
