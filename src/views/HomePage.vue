<template>
	<!-- <div style="width:200px;">
		<TextPopover :content="content"/>
	</div>
	<el-button @click="handleEdit">修改</el-button> -->
	<el-form :model="FormData" label-width="120px" style="max-width: 460px">
		<el-row>
			<el-col :span="6">
				<el-form-item label="姓名" prop="name">
					{{ FormData.name }}
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>
 
<script setup>
import { reactive, ref } from 'vue';
// let content = ref('的定情物的市场擦实现爱上饿氛')
// const handleEdit = () => {
//   content.value = 'd是对爱上大时代非但是v为v恶臭味的我d是对爱上大时代非但是v为v恶臭味的我'
// }
const FormData = reactive({
	name: '张三',
})
</script>