import datastore from '../datastore'
const db = datastore.devices

const state = {
  records: [],
  count: 0,
  searchCount: 0
}

const getters = {}

const actions = {
  countDevices: ({ commit }) => {
    return new Promise((resolve, reject) => {
      db.count({}, (err, count) => {
        if (err) {
          reject(err)
        } else {
          commit('SET_DEVICES_COUNT', count)
          resolve()
        }
      })
    })
  },

  findDevices: ({ commit }, qs) => {
    return new Promise((resolve, reject) => {
      db.find(qs.query).sort(qs.sort).skip(qs.skip).limit(qs.limit).exec((err, docs) => {
        if (err) {
          reject(err)
        } else {
          commit('SET_DEVICES', { records: docs, searchCount: docs.length })
          resolve()
        }
      })
    })
  },

  saveDevice: ({ commit, dispatch }, doc) => {
    let id = doc._id
    if (id) {
      return new Promise((resolve, reject) => {
        db.update({_id: id}, doc, {}, (err, num) => {
          if (err) {
            commit('SET_MESSAGE', { message: err, type: 'error' })
            reject(err)
          } else {
            commit('SET_MESSAGE', { message: '成功更新设备：' + doc.name, type: 'success' })
            resolve()
          }
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        db.insert(doc, (err, newDoc) => {
          if (err) {
            commit('SET_MESSAGE', { message: err, type: 'error' })
            reject(err)
          } else {
            commit('SET_MESSAGE', { message: '成功新增设备' + doc.name, type: 'success' })
            resolve()
          }
        })
      })
    }
  },

  deleteDevice: ({ commit, dispatch }, id) => {
    return new Promise((resolve, reject) => {
      db.remove({_id: id}, {}, (err, num) => {
        if (err) {
          commit('SET_MESSAGE', { message: err, type: 'error' })
          reject(err)
        } else {
          commit('SET_MESSAGE', { message: '所选设备已删除', type: 'success' })
          resolve()
        }
      })
    })
  }
}

const mutations = {
  SET_DEVICES: (state, payload) => {
    state.records = payload.records
    state.searchCount = payload.searchCount ? Number(payload.searchCount) : 0
  },
  SET_DEVICES_COUNT: (state, count) => {
    state.count = count
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
