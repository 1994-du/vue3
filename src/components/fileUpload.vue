<script setup>
import Axios from "@/api";
import { getCurrentInstance, ref, watchEffect } from "vue"
import { Plus } from '@element-plus/icons-vue';
const {proxy} = getCurrentInstance()
let upload = ref()
let props = defineProps(['url'])
let emit = defineEmits(['success'])
let imageUrl = ref('')
watchEffect(()=>{
    imageUrl = ref(props.url)
})

let baseUrl;
if(process.env.NODE_ENV=='development'){
    baseUrl='/api'
}else{
    baseUrl=''
}
const openUpload = function(){
    let ipt = upload.value;
    ipt.click()
}
const handleUploadChange = function(e){
    let file = e.target.files[0];
	let formData = new FormData()
	formData.append('file', file)
	formData.append('id', JSON.parse(sessionStorage.getItem('token')).id)
	Axios({
        url:`${baseUrl}/toupload`,
        method:'POST',
        data:formData
        // data:{
        //     file:file,
        //     id:JSON.parse(sessionStorage.getItem('token')).id
        // },
        // headers:{
        //     'Content-Type':'multipart/form-data;charset=UTF-8'
        // }
    }).then(res=>{
        if (res.status == 'success') {
			imageUrl.value = res.url;
			emit('success',res)
		}
    })
}
</script>
<template>
    <div class="upload_box" @click="openUpload">
        <input ref="upload" accept=".jpeg,.png,.jpg" type="file" style="display: none;" @change="handleUploadChange">
		<img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
            <Plus />
        </el-icon>
    </div>
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
.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>