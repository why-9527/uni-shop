export default {
	namespaced: true,
	state: () => ({
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),
	mutations: {
		addToCart(state, goods) {
			// 根据提交的商品的Id，查询购物车中是否存在这件商品
			// 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
			const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)

			if (!findResult) {
				// 如果购物车中没有这件商品，则直接 push
				state.cart.push(goods)
			} else {
				// 如果购物车中有这件商品，则只更新数量即可
				findResult.goods_count++
			}
			this.commit('m_cart/saveToStorage')
		},
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		// 更新购物车中商品的勾选状态
		updateGoodsState(state, goods) {
			// 根据 goods_id 查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

			// 有对应的商品信息对象
			if (findResult) {
				// 更新对应商品的勾选状态
				findResult.goods_state = goods.goods_state
				// 持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},
		// 更新购物车中商品的数量
		updateGoodsCount(state, goods) {
			// 根据 goods_id 查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

			if (findResult) {
				// 更新对应商品的数量
				findResult.goods_count = goods.goods_count
				// 持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},
		// 根据 Id 从购物车中删除对应的商品信息
		removeGoodsById(state, goods_id) {
			// 调用数组的 filter 方法进行过滤
			state.cart = state.cart.filter(x => x.goods_id !== goods_id)
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		},
		updateAllGoodsState(state, newState) {
			// 循环更新购物车中每件商品的勾选状态
			state.cart.forEach(x => x.goods_state = newState)
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		}
	},
	getters: {
		total(state) {
			let c = 0
			// 循环统计商品的数量，累加到变量 c 中
			state.cart.forEach(goods => c += goods.goods_count)
			return c
		},
		checkedCount(state) {
			// 先使用 filter 方法，从购物车中过滤器已勾选的商品
			// 再使用 reduce 方法，将已勾选的商品总数量进行累加
			// reduce() 的返回值就是已勾选的商品的总数量
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
		},
		checkedGoodsAmount(state) {
			// 先使用 filter 方法，从购物车中过滤器已勾选的商品
			// 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
			// reduce() 的返回值就是已勾选的商品的总价
			// 最后调用 toFixed(2) 方法，保留两位小数
			return state.cart.filter(x => x.goods_state)
				.reduce((total, item) => total += item.goods_count * item.goods_price, 0)
				.toFixed(2)
		}
	}
}
