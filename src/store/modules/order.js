import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  namespaced: true,
  state: {
    orders: [],
    order_unpay: [],
    order_unsend: [],
    order_unReceive: [],
    order_unConfirm: [],
    order_finish: [],
    visible: false,
    title: '添加订单信息',
    loading: false,
    waiters: []

  },
  getters: {

  },
  mutations: {
    showModal(state) {
      state.visible = true
    },
    closeModal(state) {
      state.visible = false
    },
    refreshOrders(state, orders) {
      state.orders = orders
    },
    unPayOrder(state, order_unpay) {
      const a = order_unpay.filter((item) => {
        return item.status = '待支付'
      })
      state.order_unpay = a
    },
    unSendOrder(state, order_unsend) {
      const a = order_unsend.filter((item) => {
        return item.status === '待派单'
      })
      state.order_unsend = a
    },
    unReceiveOrder(state, order_unReceive) {
      const a = order_unReceive.filter((item) => {
        return item.status === '待接单'
      })
      state.order_unReceive = a
    },
    unConfirmOrder(state, order_unConfirm) {
      const a = order_unConfirm.filter((item) => {
        return item.status === '未服务'
      })
      state.order_unConfirm = a
    },
    finishOrder(state, order_finish) {
      const a = order_finish.filter((item) => {
        return item.status === '未服务'
      })
      state.order_finish = a
    },
    // 更新模态框标题
    setTitle(state, title) {
      state.title = title
    },
    // 加载条
    beginLoading(state) {
      state.loading = true
    },
    endLoading(state) {
      state.loading = false
    },
    findWaiter(state, waiters) {
      state.waiters = waiters
    }
  },
  actions: {
    // 所有订单
    async findAllOrders(context) {
      // 1.ajax查询
      context.commit('beginLoading')
      const response = await request.get('/order/findAll')
      // 将查询到的结果更新到state中
      context.commit('refreshOrders', response.data)
      setTimeout(() => {
        context.commit('endLoading')
      }, 500)
    },
    // 未支付
    async unPayOrders(context) {
      const response = await request.get('/order/findAll')
      context.commit('unPayOrder', response.data)
    },
    // 待派单
    async unSendOrders(context) {
      const response = await request.get('/order/findAll')
      context.commit('unSendOrder', response.data)
    },
    // 待接单
    async unReceiveOrders(context) {
      const response = await request.get('/order/findAll')
      context.commit('unReceiveOrder', response.data)
    },
    // 未服务
    async unConfirmOrders(context) {
      const response = await request.get('/order/findAll')
      context.commit('unConfirmOrder', response.data)
    },
    // 已完成
    async finishOrders(context) {
      const response = await request.get('/order/findAll')
      context.commit('finishOrder', response.data)
    },
    // 派单
    async sendOrdersHandler(context, params) {
      const response = await request.get('/order/sendOrder?waiterId=' + params.waiterId + '&orderId=' + params.id)
      context.dispatch('unSendOrders')
      context.commit('closeModal')
      return response
    }

  }
}
