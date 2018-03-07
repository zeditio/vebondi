import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  position: {
    lat: -31.4206274,
    lng: -64.1908597
  },
  markers: [],
  showPageLoader: false
}

const mutations = {
  setMapPosition (state, payload) {
    console.log('setMapPosition' + payload.position.lat + payload.position.lng)
    state.position = payload.position
  },
  addMarker (state, payload) {
    state.markers.push(payload.marker)
  },
  hidePageLoader (state, payload) {
    console.log('hidePageLoader')
    state.showPageLoader = false
  },
  showPageLoader (state, payload) {
    console.log('showPageLoader')
    state.showPageLoader = true
  }
}
export default new Vuex.Store({
  state,
  mutations
})
