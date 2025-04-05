<template>
  <div class="websocket_wrap">
    <h4>WebSocket</h4>
    <div ref="message_box" class="message_box">
      <div class="message_box_item" :class="item.username===username?'active':''" v-for="(item,index) in messageList" :key="index">
        <div v-if="item.username===username" class="message_box_item_username">{{item.username.split('')[0].toUpperCase()}}</div>
        <div v-else class="message_box_item_username_other">{{item.username.split('')[0].toUpperCase()}}</div>
        <div class="message_box_item_message">
          <!-- 显示图片 -->
          <img v-if="item.isImage" :src="item.message" alt="图片">
          <span v-else>{{item.message}}</span>
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
  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
let username = localStorage.getItem('username');
let message_box = ref(null);
const message = ref('');
let messageList = ref([]);
let socket = null;

// 连接服务器
const connectServer = () => {
  socket = new WebSocket('ws://192.168.31.65:1234');
  socket.onopen = () => {
    console.log('WebSocket连接成功');
    const userMessage={
      type:'username',
      payload:username
    }
    socket.send(JSON.stringify(userMessage));
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('收到服务器消息：', data.payload.split(':'));
    if(data.type==='tip'){
      ElMessage({
        message: data.payload,
        type: 'info'
      });
    }else{

      let newMessage;
      if (data.isImage) {
        // 若为图片消息，直接使用完整的 payload
        newMessage = {
          username: data.payload.split(':')[0],
          message: data.payload.split(':').slice(1).join(':'),
          isImage: true
        };
      } else {
        // 若为普通文本消息，按原逻辑处理
        newMessage = {
          username: data.payload.split(':')[0],
          message: data.payload.split(':')[1],
          isImage: false
        };
      }
      messageList.value.push(newMessage);

      nextTick(()=>{
        message_box.value.scrollTop = message_box.value.scrollHeight;
      })
    }
  };
  socket.onclose = () => {
    console.log('WebSocket连接已关闭');
  };
}

const sendMessage = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const chatMessage = {
      type: 'chat',
      payload: message.value
    };
    socket.send(JSON.stringify(chatMessage));
    console.log('发送消息：', message.value);
    message.value = '';
  } else {
    console.error('WebSocket未连接');
  }
}

const fileInput = ref(null);

const openFileSelector = () => {
  fileInput.value.click();
};
// 发送图片
const sendImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      if (socket && socket.readyState === WebSocket.OPEN) {
        const imageMessage = {
          type: 'chat',
          payload: `${username}:${imageData}`,
          isImage: true
        };
        socket.send(JSON.stringify(imageMessage));
        console.log('发送图片');
      } else {
        console.error('WebSocket未连接');
      }
    };
    reader.readAsDataURL(file);
  }
}

const disConnectServer = () => {
  if (socket) {
    socket.close();
    console.log('WebSocket连接已关闭');
  }
}

onMounted(() => {
  connectServer();
});

onUnmounted(() => {
  disConnectServer();
});
</script>
<style lang='scss' scoped>
.websocket_wrap{
  display: flex;
  flex-direction: column;
}

.message_box{
  // flex: 1;
  max-height: 500px;
  overflow-y: auto;
  border: 1px dashed var(--fontColor);
  border-radius: 5px;
  margin-bottom: 10px;
  .message_box_item{
    height: auto; /* 修改高度为自适应 */
    font-size: 12px;
    display: flex;
    align-items: center;
    margin: 20px 0;
    padding: 0 10px;
    .message_box_item_username{
      width: 50px;
      height: 50px;
      border-radius: 5px;
      background-color: var(--background);
      line-height: 40px;
      font-size: 16px;
      padding: 5px;
      position: relative;
      // box-shadow: 0px 2px 5px var(--fontColor);
      filter: drop-shadow(0px 2px 5px var(--fontColor));
      &::after{
        content:'';
        position:absolute;
        left: -10px;
        top: 40%;
        width: 10px;
        height: 10px;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 5px solid transparent;
        border-right: 5px solid var(--background);
        
      }
    }
    .message_box_item_username_other{
      width: 50px;
      height: 50px;
      border-radius: 5px;
      background-color: var(--background);
      line-height: 40px;
      font-size: 16px;
      padding: 5px;
      position: relative;
      // box-shadow: 0px 2px 5px var(--fontColor);
      filter: drop-shadow(0px 2px 5px var(--fontColor));
      &::after{
        content:'';
        position:absolute;
        right: -10px;
        top: 40%;
        width: 10px;
        height: 10px;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 5px solid var(--background);
        border-right: 5px solid transparent;
      }
    }
    .message_box_item_message{
      font-size: 18px;
      margin: 0 10px;
      color: var(--fontColor);
      img {
        max-width: 200px; /* 设置图片最大宽度 */
        max-height: 200px; /* 设置图片最大高度 */
      }
    }
  }
  .active{
    flex-direction: row-reverse;
    justify-content: flex-start;
    // align-items: flex-end;
  }
}

.websocket_ipt{
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .custom-file-input {
    height: 100%;
    margin-right: 10px;
  }
  .el-input{
    height: 100%;
  }
  .el-button{
    height: 100%;
    margin-left: 10px;
  }
}
</style>