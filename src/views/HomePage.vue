<template>
	<h4>Home</h4>
	<el-button>浏览器渲染原理</el-button>
	{{ count }}--{{ doubleCount }}
	<el-button @click="incrementCounter">增加</el-button>
	<el-button @click="decrementCounter">减少</el-button>
	<SvgIcon name="zhibo" />
	<picture>
		<!-- <source srcset="@/assets/1.webp" type="image/webp"></source> -->
		<source srcset="@/assets/1.jpg" type="image/jpeg"></source>
		<img src="@/assets/1.jpg" type="image/jpeg" alt="">
	</picture>
</template>
<script setup>
import useCounterStore from '@/store/pinia/counter'
import { storeToRefs } from 'pinia'
const counter = useCounterStore()
const { count, doubleCount } = storeToRefs(counter)
const incrementCounter = () => {
	counter.increment()
}
const decrementCounter = () => {
	counter.decrement()
}
</script>
<style lang='scss' scoped></style>