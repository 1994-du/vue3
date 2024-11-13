<template>
    <el-upload
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      multiple
    >
      <el-button>点击上传</el-button>
    </el-upload>
  </template>
  
  <script>
  export default {
    data() {
      return {
        fileList: [],  // 用于展示的文件列表
      };
    },
    methods: {
      // 在上传之前进行处理，阻止默认的上传行为
      beforeUpload(file) {
        // 返回 false 阻止默认的上传行为
        return false;  // 阻止文件上传，手动控制上传
      },
  
      // 监听文件变化，在此处发起请求并处理文件
      handleChange(file, fileList) {
        console.log('文件变化:', file, fileList);
        
        // 如果文件状态是 ready，我们还没开始上传
        if (file.status === 'ready') {
          // 模拟请求进行上传
          this.uploadFile(file);
        } else if (file.status === 'success') {
          // 上传成功后将文件手动添加到 fileList
          this.fileList.push(file);
        } else if (file.status === 'fail') {
          // 上传失败时，执行失败的处理逻辑
          console.log('上传失败:', file);
        }
      },
  
      // 模拟上传请求
      uploadFile(file) {
        // 假设这是一个模拟的上传请求（使用 setTimeout 模拟延迟）
        const simulatedRequest = new Promise((resolve, reject) => {
          setTimeout(() => {
            // 模拟请求成功
            const success = true; // 你可以更改为 `false` 来模拟失败
  
            if (success) {
              resolve('上传成功');
            } else {
              reject('上传失败');
            }
          }, 2000); // 模拟延迟 2 秒
        });
  
        // 使用 Promise 来处理请求结果
        simulatedRequest
          .then(response => {
            console.log(response);
            // 上传成功后，手动更新 file 的状态为 success
            // this.$set(file, 'status', 'success');
            // 将文件添加到 fileList
            this.fileList.push(file);
          })
          .catch(error => {
            console.log(error);
            // 上传失败时，手动更新 file 的状态为 fail
            // this.$set(file, 'status', 'fail');
          });
      },
    },
  };
  </script>
  