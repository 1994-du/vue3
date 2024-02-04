<script setup>
import { ref, getCurrentInstance,onActivated } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { toUpload ,toQueryHistoryAvatar} from "@/api/api";
const { proxy } = getCurrentInstance()
let imageUrl = ref('')
let historyImgs = ref([])
let upload = ref(null)
const handleUploadChange = (e) => {
	let file = e.target.files[0];
	let formData = new FormData()
	formData.append('file', file)
	formData.append('id', JSON.parse(sessionStorage.getItem('token')).id)
	toUpload(formData).then(res => {
		if (res.status == 'success') {
			imageUrl.value = res.url;
			let token = JSON.parse(sessionStorage.getItem('token'))
			token.avatar = res.url;
			sessionStorage.setItem('token',JSON.stringify(token))
			getHistory()
		}
	})
}
const openUpload = function () {
	upload.value.click()
}
const getHistory=function(){
	toQueryHistoryAvatar({
		id:JSON.parse(sessionStorage.getItem('token')).id
	}).then(res=>{
		historyImgs.value=res.list;
	})
}
onActivated(()=>{
	imageUrl.value = JSON.parse(sessionStorage.getItem('token')).avatar;
	getHistory()
	
})
</script>
<template>
	<div ref="testref"></div>
	<el-form>
		<el-form-item label="用户名">
			<el-input placeholder="用户名"></el-input>
		</el-form-item>
		<el-form-item label="等级">
			<el-select>
				<el-option value="1">1</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="头像">
			<div style="display: flex;flex-direction: column;">
				<div class="upload_box" @click="openUpload">
					<input ref="upload" type="file" style="display: none;" @change="handleUploadChange">
					<img v-if="imageUrl" :src="imageUrl" class="avatar" />
					<el-icon v-else class="avatar-uploader-icon">
						<Plus />
					</el-icon>
				</div>
				<div class="history_list">
					<div v-for="(item,index) in historyImgs">
						<img :src="item.avatar" alt="">
					</div>
				</div>
			</div>
		</el-form-item>
		
	</el-form>
</template>
<style scoped>
.upload_box {
	width: 178px;
	height: 178px;
	border: 1px dashed #dcdfe6;
	border-radius: 6px;
	cursor: pointer;
}

.upload_box:hover {
	border-color: #409eff;
}

.avatar {
	width: 100%;
	height: 100%;
}
</style>

<style scoped lang="scss">
.el-form{
	margin: 10px;
	.el-form-item{
		display: flex;
		align-items: center;
		:deep .el-form-item__label{
			width: 80px;
			flex-shrink: 0;
		}
		.el-input{
			width: 200px;
		}
	}
}
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
.history_list{
	display: flex;
	img{
		width: 50px;
	}
}
</style>