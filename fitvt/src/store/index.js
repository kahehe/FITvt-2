import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    UID:null,
    username:null,
  },
  mutations: {
    setUID(state,token){
      state.UID = token;
    },
    removeUID(state){
      state.UID=null;
    },
    setuname(state,token){
      state.username = token;
    }
  },
  actions: {
  }
})
