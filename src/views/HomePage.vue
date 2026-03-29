<template>
	 <van-field
		v-model="message"
		rows="2"
		autosize
		type="textarea"
		maxlength="5000"
		placeholder="请输入留言"
		show-word-limit
	/>
	<van-field
		v-model="message"
		clearable
		left-icon="search"
		placeholder="显示清除图标"
	/>
	<van-radio-group v-model="checked" shape="square">
		<van-radio name="1">单选框 1</van-radio>
		<van-radio name="2">单选框 2</van-radio>
	</van-radio-group>
	<div class="home_wrap" ref="homeWrap">
		<el-card>
			<div style="height: 100px;">
				<span>html</span>
				<p>HTML5新特性：语义化标签、Canvas绘图、本地存储等</p>
			</div>
		</el-card>
		<el-card>
			<div style="height: 300px;">
				<span>css</span>
				<p>CSS3新特性：Flexbox布局、Grid布局、动画过渡效果</p>
				<p>响应式设计：媒体查询、流体布局、弹性盒模型</p>
			</div>
		</el-card>
		<el-card>
			<div style="height: 400px;">
				<span>js</span>
				<p>JavaScript高级特性：闭包、原型链、异步编程</p>
				<p>ES6+新特性：箭头函数、Promise、async/await</p>
				<p>模块化开发：CommonJS、ES Modules</p>
			</div>
		</el-card>
		<el-card>
			<div style="height: 500px;">
				<span>网络</span>
				<p>HTTP协议：请求方法、状态码、缓存机制</p>
				<p>TCP/IP协议：三次握手、四次挥手</p>
				<p>性能优化：CDN、HTTP/2、Websocket</p>
				<p>安全：HTTPS、CORS、XSS防护</p>
			</div>
		</el-card>
		<el-card>
			<div style="height: 300px;">
				<span>工程化</span>
				<p>构建工具：Webpack、Vite、Rollup</p>
				<p>包管理：npm、yarn、pnpm</p>
				<p>代码规范：ESLint、Prettier</p>
			</div>
		</el-card>
		<el-card>
			<div style="height: 100px;">
				<span>性能优化</span>
				<p>页面加载优化：懒加载、预加载</p>
			</div>
		</el-card>
		<el-card>
			<div style="height: 200px;">
				<span>前端框架</span>
				<p>Vue 3：Composition API、响应式系统</p>
				<p>React：Hooks、组件化开发</p>
			</div>
		</el-card>
		<el-card>
			<div style="height: 600px;">
				<span>数据库</span>
				<p>关系型数据库：MySQL、PostgreSQL</p>
				<p>非关系型数据库：MongoDB、Redis</p>
				<p>ORM框架：Sequelize、TypeORM</p>
				<p>数据库设计：范式、索引优化</p>
				<p>事务管理：ACID特性、隔离级别</p>
			</div>
		</el-card>
		<el-card>
			<div style="height: 150px;">
				<span>服务器</span>
				<p>Node.js：Express、Koa、NestJS</p>
			</div>
		</el-card>
		<el-card>
			<div style="height: 450px;">
				<span>安全</span>
				<p>XSS防护：转义输出、CSP策略</p>
				<p>CSRF防护：Token验证、SameSite Cookie</p>
				<p>密码安全：加盐哈希、bcrypt</p>
				<p>身份认证：JWT、OAuth2.0</p>
			</div>
		</el-card>
		<el-card>
			<div style="height: 250px;">
				<span>算法</span>
				<p>排序算法：快速排序、归并排序</p>
				<p>搜索算法：二分查找、哈希表</p>
				<p>数据结构：链表、树、图</p>
			</div>
		</el-card>
		<el-card>
			<div style="height: 550px;">
				<span>架构设计</span>
				<p>微前端：Single-SPA、MicroApp</p>
				<p>微服务：Spring Cloud、Docker、Kubernetes</p>
				<p>服务端渲染：Next.js、Nuxt.js</p>
				<p>静态站点生成：Gatsby、VuePress</p>
			</div>
		</el-card>
		<el-card>
			<div style="height: 350px;">
				<span>设计模式</span>
				<p>创建型模式：单例、工厂、建造者</p>
				<p>结构型模式：代理、装饰器、适配器</p>
				<p>行为型模式：观察者、策略、模板方法</p>
			</div>
		</el-card>
		<el-card>
			<div style="height: 120px;">
				<span>版本控制</span>
				<p>Git：分支管理、合并策略</p>
			</div>
		</el-card>
	</div>
</template>
<script setup>
import { Field, Radio, RadioGroup } from 'vant'
import useCounterStore from '@/store/pinia/counter'
import { storeToRefs } from 'pinia'
import { ref, onMounted, onUnmounted } from 'vue'
// import { dxButton,dxSwitch } from '@1994-du/vue3-ui'
let message = ref('')
const switchValue = ref(false)
const checked = ref('1')

const counter = useCounterStore()
const { count, doubleCount } = storeToRefs(counter)
const incrementCounter = () => {
	counter.increment()
}
const decrementCounter = () => {
	counter.decrement()
}

// JavaScript瀑布流实现
const homeWrap = ref(null)
const cardSpacing = 16 // 卡片间距
const cardWidth = 200 // 卡片宽度

// 创建瀑布流布局
const createWaterfall = () => {
	if (!homeWrap.value) return
	
	const container = homeWrap.value
	const cards = container.querySelectorAll('.vue3-card')
	if (!cards.length) return
	
	// 计算容器宽度和列数
	const containerWidth = container.offsetWidth
	const columns = Math.max(1, Math.floor(containerWidth / (cardWidth + cardSpacing)))
	
	// 初始化列高度数组
	const columnHeights = new Array(columns).fill(0)
	
	// 设置每个卡片的位置
	cards.forEach((card, index) => {
		// 计算卡片应该放置的列（选择当前高度最小的列）
		let minHeightColumn = 0
		let minHeight = columnHeights[0]
		for (let i = 1; i < columns; i++) {
			if (columnHeights[i] < minHeight) {
				minHeight = columnHeights[i]
				minHeightColumn = i
			}
		}
		
		// 设置卡片的绝对定位
		card.style.position = 'absolute'
		card.style.left = `${minHeightColumn * (cardWidth + cardSpacing)}px`
		card.style.top = `${columnHeights[minHeightColumn]}px`
		card.style.width = `${cardWidth}px`
		
		// 更新该列的高度
		columnHeights[minHeightColumn] += card.offsetHeight + cardSpacing
	})
	
	// 设置容器高度为最高列的高度
	container.style.height = `${Math.max(...columnHeights)}px`
}

// 监听窗口大小变化
const handleResize = () => {
	createWaterfall()
}

// 组件挂载后初始化瀑布流
onMounted(() => {
	// 使用setTimeout确保DOM完全渲染
	// setTimeout(() => {
	// 	createWaterfall()
	// }, 100)
	
	// 添加窗口大小变化监听
	// window.addEventListener('resize', handleResize)
})

// 组件卸载时移除监听
onUnmounted(() => {
	// window.removeEventListener('resize', handleResize)
})
</script>
<style lang='scss'>
.home_wrap {
	/* 使用JavaScript实现瀑布流 - 相对定位容器 */
	display: block !important;
	position: relative !important;
	padding: 16px !important;
	width: 100% !important;
	height: auto !important;
	box-sizing: border-box !important;

	// elementplus的命名空间是vue3
	> .vue3-card {
		background-color: transparent !important;
		color: var(--fontColor) !important;
		/* 允许卡片使用自己的高度设置 */
		height: auto !important;
		/* 卡片基础样式 - JavaScript将控制定位 */
		width: 250px !important;
		margin: 0 !important;
		padding: 0 !important;
		display: block !important;
	}

	/* 确保卡片内容区域高度正确 */
	.vue3-card__body {
		height: auto;
		padding: 16px !important;
	}

	/* 响应式设计将由JavaScript控制 */
}
</style>