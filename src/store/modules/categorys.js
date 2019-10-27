import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  // 保证main.js中的modules模块命名不会起冲突；调用不会出错；
  namespaced: true,
  state: {
    title: '添加栏目信息',
    categories1: {
      list: []
    },
    categories: {},
    dialogFormVisible: false
  },
  getters: {},
  mutations: {
    refreshdata(state, categories) {
      state.categories1 = categories
    },
    refreshCategories(state, categories) {
      state.categories = categories
    },
    showmodel(state) {
      state.dialogFormVisible = true
    },
    hidemodel(state) {
      state.dialogFormVisible = false
    },
    settitle(state, title) {
      state.title = title
    }
  },
  actions: {
    async findAllCategories(context) {
      // 1. ajax查询
      const response = await request.get('/category/findAll')
      // 2. 将查询结果更新到state中
      context.commit('refreshCategories', response.data)
    },
    // 异步操作同步化；
    async reloadDatequery({ commit }, param) {
      const response = await post('/category/query', param)
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
    async saveOrUpdatecategory({ commit, dispatch }, param) {
      // 要传递一个参数给他；
      const response = post('/category/saveOrUpdate', param)
      // 关闭model
      commit('hidemodel')
      // 返回response作为提示弹框的接收信息；
      return response
    },
    async deleteById({ dispatch }, param) {
      // 手动编写传递参数的格式：?id= +id
      const response = await request.get('/category/deleteById?id=' + param)
      return response
    },
    async deletemoer({ dispatch }, ids) {
      const response = await post_array('/category/batchDelete', { ids })
      return response
    }
  }
}
