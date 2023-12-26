<script setup>
import { ref ,getCurrentInstance} from 'vue';
import { Plus } from '@element-plus/icons-vue';
const {proxy} = getCurrentInstance()

const handleUploadChange = (e)=>{
  let file = e.target.files[0]
  console.log(file);
  let formData = new FormData()
  formData.append('file',file)
  proxy.$axios({
    url:'/api/upload',
    method:'POST',
    data:formData
  }).then(res=>{
    console.log('res',res);
  })
}
</script>
<template>
<div>
  <input type="file" @change="handleUploadChange">
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