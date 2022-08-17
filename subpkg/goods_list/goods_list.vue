<template>

	<view class="goods-list">
		<view v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)">
			<!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
			<my-goods :goods="item"></my-goods>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj: {
					// 查询关键词
					query: '',
					// 商品分类Id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10
				},
				// 商品列表的数据
				goodsList: [],
				// 总数量，用来实现分页
				total: 0,
				// 是否正在请求数据
				isloading: false,
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		onLoad(options) {
			// 将页面参数转存到 this.queryObj 对象中
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			// 调用获取商品列表数据的方法
			this.getGoodsList()
		},
		methods: {
			// 获取商品列表数据的方法
			async getGoodsList(cb) {
				// 打开节流阀
				this.isloading = true
				// 发起请求
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)

				// 关闭节流阀
				this.isloading = false

				cb && cb()

				if (res.meta.status !== 200) return uni.$showMsg()

				// 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
			},
			gotoDetail(item) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			}
		},
		// 触底的事件
		onReachBottom() {
			// 判断是否还有下一页数据
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')

			if (this.isloading) return

			// 让页码值自增 +1
			this.queryObj.pagenum += 1
			// 重新获取列表数据
			this.getGoodsList()
		},
		onPullDownRefresh() {
			// 1. 重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodsList = []

			// 2. 重新发起请求
			this.getGoodsList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">
	.goods-item {
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;

		.goods-item-left {
			margin-right: 5px;

			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goods-item-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
			}

			.goods-price {
				font-size: 16px;
				color: #c00000;
			}
		}
	}
</style>
