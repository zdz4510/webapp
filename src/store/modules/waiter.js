import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  // 保证main.js中的modules模块命名不会起冲突；调用不会出错；
  namespaced: true,
  state: {
    title: '添加员工信息',
    waiters: {
      list: []
    },
    dialogFormVisible: false
  },
  getters: {},
  mutations: {
    refreshdata(state, waiters) {
      state.waiters = waiters
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
    // 异步操作同步化；
    async reloadDatequery({ commit }, param) {
      const response = await post('/waiter/query', param)
      // 刷新数据；
      commit('refreshdata', response.data)
      return response
    },
    async saveOrUpdatewaiter({ commit }, param) {
      // 要传递一个参数给他；
      const response = post('/waiter/saveOrUpdate', param)
      // 关闭model
      commit('hidemodel')
      // 返回response作为提示弹框的接收信息；
      return response
    }
  }
}
