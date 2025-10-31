<template>
  <div class="websocket_wrap">
    <h4>WebSocket</h4>
    <div ref="message_box" class="message_box">
      <div class="message_box_item" :class="item.username !== username ? 'active' : ''" v-for="(item, index) in messageList" :key="index">
        <!-- 显示时间 -->
        <div class="message_box_item_time">{{ item.time }}</div>
        <div class="message_box_item_content">
          <div v-if="item.username === username" class="message_box_item_username">
            <img :src="`${baseUrl}${item.avatar}`" alt="">
          </div>
          <div v-else class="message_box_item_username_other">
            <img :src="`${baseUrl}${item.avatar}`" alt="">
          </div>
          <div class="message_box_item_message">
            <!-- 显示图片 -->
            <img v-if="item.isImage" :src="`${baseUrl}${item.image}`" alt="图片" @click="openImagePreview(item.message)">
            <div v-else class="message_rows" :class="item.username === username ? 'me' : 'other'">{{ item.message }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="websocket_ipt">
      <el-input v-model="message" placeholder="发送消息" @keydown.enter="sendMessage"></el-input>
      <div class="custom-file-input">
        <input type="file" ref="fileInput" @change="sendImage" accept="image/*" style="display: none;">
        <el-button type="primary" @click="openFileSelector">选择图片</el-button>
      </div>
      <el-button type="primary" @click="sendMessage">发送消息</el-button>
    </div>
    <!-- 全屏预览容器 -->
    <div v-if="isImagePreviewVisible" class="image-preview" @click.stop="closeImagePreview">
      <img :src="previewImageSrc" alt="预览图片" @click.stop>
      <div class="close-button" @click.stop="closeImagePreview">×</div>
    </div>
  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { uploadFile } from '../api/api';
let username = localStorage.getItem('username');
let message_box = ref(null);
const message = ref('');
let messageList = ref([]);
let socket = null;
const isImagePreviewVisible = ref(false);
const previewImageSrc = ref('');

let baseUrl = import.meta.env.VITE_PROXY.slice(0,-1)

// 获取当前时间，包含年月日时分秒
const getCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 连接服务器
const connectServer = () => {
  socket = new WebSocket(import.meta.env.VITE_WS);
  socket.onopen = () => {
    console.log('WebSocket连接成功');
    const userMessage = {
      type: 'username',
      payload: {
        username: username,
        userId: localStorage.getItem('userid'),
        time: getCurrentTime() // 添加时间属性
      }
    };
    socket.send(JSON.stringify(userMessage));
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('收到服务器消息：', data);
    if (data.type === 'userJoined') {
      ElMessage({
        message: data.payload.message,
        type: 'info'
      });
    } else if(data.type === 'chat'){
      let newMessage;
      if (data.payload.isImage&&(data.payload.isImage === true||data.payload.isImage === 'true')) {
        // 若为图片消息，直接使用完整的 payload
        newMessage = {
          avatar: data.payload.avatar,
          username: data.payload.username,
          image: data.payload.image,
          message: data.payload.image,
          isImage: true,
          time: data.payload.time // 从 payload 中获取时间属性
        };
      } else {
        // 若为普通文本消息，按原逻辑处理
        newMessage = {
          avatar: data.payload.avatar,
          username: data.payload.username,
          message: data.payload.message,
          isImage: false,
          time: data.payload.time // 从 payload 中获取时间属性
        };
      }
      messageList.value.push(newMessage);
      nextTick(() => {
        console.log(message_box.value.scrollHeight);
        console.log(message_box.value.scrollTop);
        
        message_box.value.scrollTop = message_box.value.scrollHeight;
      });
    }
  };
  socket.onclose = (event) => {
    console.log('WebSocket连接已关闭', event);
  };
};

const sendMessage = () => {
  if (socket && socket.readyState === WebSocket.OPEN&&message.value) {
    const chatMessage = {
      type: 'chat',
      payload: {
        isImage: false,
        userId: localStorage.getItem('userid'),
        username: username,
        message: message.value,
        time: getCurrentTime() // 添加时间属性
      },
    };
    socket.send(JSON.stringify(chatMessage));
    console.log('发送消息：', message.value);
    message.value = '';
  } else {
    console.error('WebSocket未连接');
  }
};

const fileInput = ref(null);

const openFileSelector = () => {
  fileInput.value.click();
};

// 发送图片
const sendImage = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      // 创建FormData对象上传图片
      const formData = new FormData();
      formData.append('file', file);
      const response = await uploadFile(formData);
      
      // 检查上传是否成功
      if (response.status === 'success') {
        // 获取返回的图片地址
        // 假设接口返回的数据格式是 { data: { url: '图片地址' } } 或直接返回图片地址
        const imageUrl = response.fileUrl;
        
        // 通过WebSocket发送图片消息，使用服务器返回的图片地址
        if (socket && socket.readyState === WebSocket.OPEN) {
          const imageMessage = {
            type: 'chat',
            payload: {
              isImage: true,
              userId: localStorage.getItem('userid'),
              username: username,
              image: imageUrl, // 使用服务器返回的图片地址
              time: getCurrentTime() // 添加时间属性
            }
          };
          socket.send(JSON.stringify(imageMessage));
        } else {
          ElMessage({ message: 'WebSocket未连接', type: 'error' });
        }
      } else {
        ElMessage({ message: '图片上传失败', type: 'error' });
      }
    } catch (error) {
      console.error('上传图片失败:', error);
      ElMessage({ message: '图片上传失败，请重试', type: 'error' });
    }
  }
  // 清空文件输入，允许重复选择相同的文件
  event.target.value = '';
};

const disConnectServer = () => {
  if (socket) {
    socket.close();
    console.log('WebSocket连接已关闭');
  }
};

// 打开图片预览
const openImagePreview = (src) => {
  previewImageSrc.value = `${baseUrl}${src}`;
  isImagePreviewVisible.value = true;
};

// 关闭图片预览
const closeImagePreview = () => {
  isImagePreviewVisible.value = false;
};

onMounted(() => {
  connectServer();
});

onUnmounted(() => {
  disConnectServer();
});
</script>
<style lang='scss' scoped>
.websocket_wrap {
  display: flex;
  flex-direction: column;
}

.message_box {
  height: clamp(300px, 300px, 500px);
  overflow-y: auto;
  border: 1px dashed var(--fontColor);
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: #f3f3f3;
  .message_box_item {
    display: flex;
    flex-direction: column;
    align-items: end;
    margin: 20px 10px 20px 10px;
    .message_box_item_time{
      margin-bottom: 10px;
      color: #aaa;
    }
    .message_box_item_content{
      display: flex;
      align-items: flex-start;
      flex-direction: row-reverse;
      .message_box_item_username {
        width: 50px;
        height: 50px;
        border-radius: 5px;
        background-color: var(--background);
        line-height: 40px;
        font-size: 16px;
        padding: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        filter: drop-shadow(0px 2px 5px var(--fontColor));
        img{
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
      }
      .message_box_item_username_other {
        width: 50px;
        height: 50px;
        border-radius: 5px;
        background-color: var(--background);
        line-height: 40px;
        font-size: 16px;
        padding: 5px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        filter: drop-shadow(0px 2px 5px var(--fontColor));
        img{
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
      }
      .message_box_item_message {
        font-size: 18px;
        margin: 0 10px;
        color: var(--fontColor);
        img {
          max-width: 200px; /* 设置图片最大宽度 */
          max-height: 200px; /* 设置图片最大高度 */
          cursor: pointer; // 添加鼠标指针样式
          border-radius: 5px;
          border: 1px solid #aaa;
        }
        .message_rows{
          font-size: 14px;
          max-width: 600px; /* 设置图片最大宽度 */
          text-wrap: break-word;
          text-align: left;
          padding: 10px 15px;
          border-radius: 5px;
          position: relative;
          
        }
        .other{
          background: rgb(255, 255, 255);
          &::after {
            content: '';
            position: absolute;
            left: -10px;
            top: 12px;
            width: 10px;
            height: 10px;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-left: 5px solid transparent;
            border-right: 5px solid rgb(255, 255, 255);
          }
        }
        .me{
          background-color: rgb(53, 247, 53);
          &::after {
            content: '';
            position: absolute;
            right: -10px;
            top: 12px;
            width: 10px;
            height: 10px;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-left: 5px solid rgb(53, 247, 53);
            border-right: 5px solid transparent;
          }
        }
      }
    }    
  }
  .active {
    justify-content: flex-start;
    align-items: start;
    .message_box_item_content{
      flex-direction: row;
    }
  }
}

.websocket_ipt {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  .custom-file-input {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .el-input {
    height: 100%;
  }
  .el-button {
    height: 100%;
    margin-left: 10px;
  }
}

// 全屏预览样式
.image-preview {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  img {
    max-width: 90%;
    max-height: 90%;
  }

  .close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    color: white;
    font-size: 30px;
    cursor: pointer;
  }
}
</style>