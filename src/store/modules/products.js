import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  // 保证main.js中的modules模块命名不会起冲突；调用不会出错；
  namespaced: true,
  state: {
    title: '添加产品信息',
    product: [],
    products: {
      list: []
    },
    dialogFormVisible: false
  },
  getters: {},
  mutations: {
    refreshdata(state, products) {
      state.products = products
    },
    showmodel(state) {
      state.dialogFormVisible = true
    },
    hidemodel(state) {
      state.dialogFormVisible = false
    },
    settitle(state, title) {
      state.title = title
    },
    refreshproduct(state, product) {
      state.product = product
    }
  },
  actions: {
    // 异步操作同步化；
    async reloadDatequery({ commit }, param) {
      const response = await post('/product/queryProductCascadeCategory', param)
      // 刷新数据；
      commit('refreshdata', response.data)
      return response
    },
    // async reloadDate(context,param){
    //     let response = await post('/product/query',param)
    //     // let response = await get('/product/findAll');
    //     // 提交突变
    //     context.commit('refreshdata',response.data);
    // },
    async saveOrUpdateproduct({ commit, dispatch }, param) {
      // 要传递一个参数给他；
      const response = post('/product/saveOrUpdate', param)
      // 关闭model
      commit('hidemodel')
      // 返回response作为提示弹框的接收信息；
      return response
    },
    async deleteById({ dispatch }, param) {
      // 手动编写传递参数的格式：?id= +id
      const response = await request.get('/product/deleteById?id=' + param)
      return response
    },
    async deletemoer({ dispatch }, ids) {
      const response = await post_array('/product/batchDelete', { ids })
      return response
    },
    async findAddressByproductsId({ commit }, id) {
      const response = await request.get('/product/findById?id=' + id)
      const arr = []
      for (const i in response.data) {
        arr.push({ [i]: response.data[i] })
      }
      commit('refreshproduct', arr)
    }
  }
}
