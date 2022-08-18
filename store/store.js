import Vue from 'vue'
import Vuex from 'vuex'
import moduleCart from './cart'
import moduleUser from './user'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		'm_cart': moduleCart,
		'm_user': moduleUser,
	}
})

export default store
