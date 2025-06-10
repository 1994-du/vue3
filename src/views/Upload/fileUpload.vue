<template>
  <el-upload
    class="upload-demo"
    multiple
    :on-change="handleChange"
    :on-success="handleSuccess"
    :on-error="handleError"
    :before-upload="beforeUpload"
    :file-list="fileList"
    :http-request="customUpload">
    <el-button type="primary">附件上传2</el-button>
  </el-upload>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { fragmentUpload } from '@/api/api.js';
import { ElMessage } from 'element-plus';
const fileList = ref([]);

const beforeUpload = (file) => {
  const isAllowedType = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isAllowedType) {
    ElMessage.error('仅支持 PDF、JPG 和 PNG 文件');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('文件大小不能超过 5MB');
    return false;
  }

  return true; // 校验通过
};
const customUpload = async (options) => {
  const { file, onSuccess, onError } = options;

  try {
    let res = await fragmentUpload({ file }); // 你的上传逻辑
    console.log('res',res);
    if(res){
        // 手动添加到列表
      fileList.value = [
        ...fileList.value,
        {
          name: file.name,
          status: 'success',
          uid: Date.now() + file.name,
          raw: file,
        }
      ];

      onSuccess?.(); // 必须调用以通知上传成功
    } else {
      onError?.(new Error('上传失败'));
    }

    
  } catch (err) {
    ElMessage.error(`${file.name} 上传失败`);
    onError?.(err);
  }
};

const handleChange = (file, fileList) => {
  console.log('文件改变', file, fileList);
};

const handleSuccess = (response, file, fileList) => {
  console.log('上传成功', response, file, fileList);
};

const handleError = (error, file, fileList) => {
  console.log('上传失败', error, file, fileList);
};
</script>

<style lang="less" scoped>
</style>