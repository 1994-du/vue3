<template>
	<!-- <div style="width:200px;">
		
	</div>-->
	<el-button @click="handleEdit">修改</el-button>
	<el-form :model="formData" label-width="120px" style="width: 100%;">
		<el-row>
			<el-col :span="6">
				<el-form-item label="姓名" prop="name">
					<TextPopover :content="formData.name"/>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
	<el-dialog
	title="编辑"
	v-model="dialogVisible">
		<el-input v-model="editForm.name" placeholder="请输入内容"></el-input>
		<template #footer>
			<el-button @click="dialogVisible = false">取消</el-button>
			<el-button type="primary" @click="handleEditDialog">确定</el-button>
		</template>
	</el-dialog>
</template>
 
<script setup>
import { reactive, ref } from 'vue';
// let content = ref('的定情物的市场擦实现爱上饿氛')

let formData = reactive({
	name: '张三是个帅气的桃花运爆棚的土豪暴发户',
})
let editForm = reactive({
	name: '',
})
const dialogVisible = ref(false)
const handleEdit = () => {
	dialogVisible.value = true
	editForm = Object.assign({}, formData)
}
const handleEditDialog = () => {
	formData = Object.assign({}, editForm)
	dialogVisible.value = false
}
</script>