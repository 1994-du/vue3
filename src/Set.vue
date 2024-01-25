<script setup>
import { ref, getCurrentInstance,onActivated } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { toUpload ,toQueryHistoryAvatar} from "@/api/api";
const { proxy } = getCurrentInstance()
let imageUrl = ref('')
let historyImgs = ref([])
const handleUploadChange = (e) => {
	let file = e.target.files[0]
	//图片转Blob类型
	// let imgBlob = URL.createObjectURL(file)
	// toUpload({
	// 	id:JSON.parse(sessionStorage.getItem('token')).id,
	// 	file:imgBlob
	// }).then(res => {
	// 	if (res.status == 'success') {
	// 		imageUrl.value = res.url;
	// 		let token = JSON.parse(sessionStorage.getItem('token'))
	// 		token.avatar = res.url;
	// 		sessionStorage.setItem('token',JSON.stringify(token))
	// 	}
	// })
	// 图片转base64--sql暂时存不了（妈的 不会）
	// let reader = new FileReader();
	// reader.readAsDataURL(file);
	// reader.onload = function(e){
	// 	console.log(reader.result);
	// 	toUpload({
	// 		id:JSON.parse(sessionStorage.getItem('token')).id,
	// 		file:reader.result
	// 	}).then(res => {
	// 		if (res.status == 'success') {
	// 			imageUrl.value = res.url;
	// 			let token = JSON.parse(sessionStorage.getItem('token'))
	// 			token.avatar = res.url;
	// 			sessionStorage.setItem('token',JSON.stringify(token))
	// 		}
	// 	})
	// }

	// 使用formData传参
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
	let ipt = document.getElementsByTagName('input')[0]
	ipt.click()
}
const getHistory=function(){
	toQueryHistoryAvatar({
		id:JSON.parse(sessionStorage.getItem('token')).id
	}).then(res=>{
		console.log('rs',res);
		historyImgs.value=res.list;
	})
}
onActivated(()=>{
	imageUrl.value = JSON.parse(sessionStorage.getItem('token')).avatar;
	getHistory()
})
</script>
<template>
	<el-form>
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
		::v-deep .el-form-item__label{
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