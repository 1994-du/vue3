<template>
  <div class="websocket_wrap">
    <h4>WebSocket</h4>
    <div ref="message_box" class="message_box">
      <div class="message_box_item" :class="item.username===username?'active':''" v-for="(item,index) in messageList" :key="index">
        <div v-if="item.username===username" class="message_box_item_username">{{item.username.split('')[0].toUpperCase()}}</div>
        <div v-else class="message_box_item_username_other">{{item.username.split('')[0].toUpperCase()}}</div>
        <div class="message_box_item_message">{{item.message}}</div>
      </div>
    </div>
    <div class="websocket_ipt">
      <el-input v-model="message" placeholder="发送消息" @keydown.enter="sendMessage"></el-input>
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
    console.log('收到服务器消息：', data);
    if(data.type==='tip'){
      ElMessage({
        message: data.payload,
        type: 'info'
      });
    }else{
      messageList.value.push({
        username:data.payload.split(':')[0],
        message:data.payload.split(':')[1]
      });
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
    height: 40px;
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
  .el-input{
    height: 100%;
  }
  .el-button{
    height: 100%;
    margin-left: 10px;
  }
}
</style>