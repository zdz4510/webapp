<template>
  <div id="wapper">
    <h5>产品管理</h5>
    <!-- {{products}} -->
    <div style="margin-bottom:10px">{{ productsIds }}</div>
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
    <el-table :data="products.list" style="width: 100%" size="mini" @selection-change="handleSelectionChange">
      <!-- 这里的多选框已经被上面的代码给绑定过事件，所以不用:value="products.id"的传递参数，但他获得的是整个所选中的全部属性和值，而我们要的是id所组成的数组，就要在多一步将传递的数据改变；*将数组对象转化为数组操作*-->
      <el-table-column type="selection" />
      <el-table-column prop="name" label="name" />
      <el-table-column prop="description" label="description" />
      <el-table-column prop="price" label="price" />
      <el-table-column prop="status" label="status" />
      <el-table-column prop="category.name" label="categoryId" />
      <el-table-column prop="" label="操作">
        <template v-slot:default="scope">
          <!-- 如何传递参数给点击函数 -->
          <el-button size="mini" type="primary" circle @click="toDetailsHandler(scope.row)">详情</el-button>
          <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="updata(scope.row)" />
          <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="deleteByIdhandler(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:10px;margin-bottom:10px;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="products.total"
        :page-size="param.pageSize"
        :current-page="param.page+1"
        @current-change="changepage"
      />
    </div>
    <el-dialog title="产品详细信息" :visible.sync="dialogFormVisible" :before-close="hidemodel" @close="closehandler">
      {{ product }}
      <el-form ref="productsref" :model="product" :rules="rules">
        <el-form-item label="产品名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="product.name" />
        </el-form-item>
        <el-form-item label="产品价钱" :label-width="formLabelWidth" prop="price">
          <el-input v-model="product.price" />
        </el-form-item>
        <!-- <el-form-item label="状态" :label-width="formLabelWidth">
        <el-input v-model="product.status" prop="status"></el-input>
        </el-form-item> -->
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="product.status" placeholder="">
            <el-option :key="1" :value="yes" :label="yes" />
            <el-option :key="2" :value="no" :label="no" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品描述" :label-width="formLabelWidth">
          <el-input v-model="product.description" type="textarea" :rows="2" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="产品id" :label-width="formLabelWidth" prop="categoryId">
          <!-- 下拉框数据没连接 -->
          <el-select v-model="product.categoryId" placeholder="请选择类型">
            <!-- 一定要绑定key值，否则将报错 -->
            <el-option v-for="item in categories" :key="item.id" :value="item.id" :label="item.name" />
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
      yes: '有货',
      no: '无货',
      product: {},
      formLabelWidth: '120px',
      productsIds: [],
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '选择产品id', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '选择状态', trigger: 'blur' }
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
    ...mapState('products', ['dialogFormVisible', 'title', 'products']),
    ...mapState('categorys', ['categories'])
  },
  created() {
    // this.refreshdata()
    this.onSubmit()
    this.reloadDataOrderIds()
  },
  // 映射mutations和actions中的方法；提交变动，调度动作；
  methods: {
    ...mapMutations('products', ['showmodel', 'hidemodel', 'settitle']),
    ...mapActions('products', ['reloadDate', 'saveOrUpdateproduct', 'deleteById', 'deletemoer', 'reloadDatequery']),
    ...mapActions('categorys', ['findAllCategories']),
    // 普通方法
    toDetailsHandler(product) {
      console.log(product)
      // 跳转到详情页面
      // this.$router.push("/customerDetails")
      this.$router.push({
        path: '/products/detail',
        query: { id: product.id }
      })
    },
    add() {
      this.product = {}
      this.settitle('添加顾客信息')
      this.showmodel()
    },
    submitModal() {
      // $refs是ref的rules的所有集合，Productref是指定的，validata是ref中的一个方法，valid是方法调用的结果，它们是配合使用。
      this.$refs.productsref.validate((valid) => {
        if (valid) {
          this.saveOrUpdateproduct(this.product).then((response) => {
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
    updata(product) {
      this.product = product
      this.settitle('修改产品信息')
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
      this.productsIds = val.map((item) => item.id)
    },
    deletemoerhandler() {
      this.deletemoer(this.productsIds).then((response) => {
        this.onSubmit()
        this.$message({ message: response.statusText, type: 'success' })
      })
    },
    // 表单重置为空：model关闭执行
    closehandler() {
      // 使用element-ui中的表单，人家给定的方法。
      this.$refs.productsref.resetFields()
    },
    onSubmit() {
      // console.log(this.param)
      this.reloadDatequery(this.param).then((response) => {
        // this.$message({ message:response.statusText, type: 'success'});
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
