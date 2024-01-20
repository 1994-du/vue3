<script setup>
import { ref ,getCurrentInstance} from 'vue';
import { Plus } from '@element-plus/icons-vue';
const {proxy} = getCurrentInstance()
const imageUrl = ref('')
const handleUploadChange = (e)=>{
  let file = e.target.files[0]
  console.log(file,JSON.parse(sessionStorage.getItem('token')).id);
  let formData = new FormData()
  formData.append('file',file)
  formData.append('id',JSON.parse(sessionStorage.getItem('token')).id)
  console.log(formData.getAll('file'));
  proxy.$axios({
    url:'/api/upload',
    method:'POST',
    data:formData
  }).then(res=>{
    if(res.status='success'){
      imageUrl.value = res.url;
    }
  })
}
const openUpload = function(){
  let ipt = document.getElementsByTagName('input')[0]
  ipt.click()
}

</script>
<template>
<div>
  <input ref="upload" type="file" style="display: none;" @change="handleUploadChange">
  <el-icon class="avatar-uploader-icon" @click="openUpload"><Plus /></el-icon>
  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <!-- <el-upload
        ref="upload"
        class="avatar-uploader"
        :auto-upload="false"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :on-change="handleUploadChange"
        >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload> -->
</div>
</template>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
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
</style>