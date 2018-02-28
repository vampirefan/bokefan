import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  state: {
    message: ''
  },
  mutations: {
    SET_MESSAGE (state, payload) {
      state.message = payload
    }
  },
  getters: {
    sidebar: state => state.app.sidebar,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    roles: state => state.user.roles
  }
  // strict: process.env.NODE_ENV !== 'production'
})
