import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  pos: {
    lat: -31.4206274,
    lng: -64.1908597
  }
}

const mutations = {
  setMapPosition (state, payload) {
    console.log('setMapPosition' + payload.pos.lat + payload.pos.lng)
    state.pos = payload.pos
  }
}
export default new Vuex.Store({
  state,
  mutations
})
