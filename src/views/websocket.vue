<script setup>
import {io} from "socket.io-client"
import { onMounted,ref,reactive, onDeactivated, onUnmounted, onActivated } from "vue";
const chatList = ref([])
const chatMsg = ref('')
let socket=ref(null)
const currentTime = function(){
  let xmlHttp = new XMLHttpRequest()
  if(!xmlHttp){
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
  }
  xmlHttp.open("HEAD",location.href,false)
  xmlHttp.send()
  let serverTime = new Date(xmlHttp.getResponseHeader("Date"))
  let time = serverTime.toLocaleDateString()
  console.log('servertime',serverTime,serverTime.toLocaleString());
  console.log('time',time);
  return serverTime.toLocaleString()
}
onMounted(()=>{
    socket = io('http://192.168.31.65:1234');
    socket.on('connect',()=>{
        console.log(socket.id,'监听客户端连接成功-connect');
    })


    

    socket.on('message',msg=>{
      chatList.value.push(msg)
      console.log('服务器发送信息',msg);
    })
    socket.on('msg_res',(msg)=>{
      console.log('其他客户端信息',msg);
      chatList.value.push(msg)
    })
    socket.on('disconnect',()=>{
      socket.disconnect()
      socket.close()
    })
})
onActivated(()=>{
  console.log('actived');
})
// 发送消息
const sendMsg = ()=>{
  let userInfo=JSON.parse(localStorage.getItem('token'))
  userInfo.msg=chatMsg.value
  userInfo.time=currentTime()
  socket.emit('send-message',userInfo)
  chatMsg.value = ''
}
onUnmounted(()=>{
  console.log('onUnmounted');
  socket.close()
  socket=null
})
onDeactivated(()=>{
  console.log('onDeactivated');
})
</script>
<template>
<div class="container">
    <div class="chat-content">
      <!-- <img :src="avatar2" alt=""> -->
      <template v-if="chatList && chatList.length">
        <div
          v-for="(chat, index) in chatList"
          class="message-box"
          :key="index"
        >
          <div class="user">
            <el-avatar class="avatar" :src="chat.avatar" ></el-avatar>
            <div class="info">
              <div class="name">{{chat.name}}</div>
              <div class="time">{{ chat.time }}</div>
            </div>
            <!-- <el-avatar v-if="chat.id === userInfo.id" class="avatar" :src="chat.avatar" ></el-avatar> -->
          </div>
          <div class="message"><div class="block">{{chat.msg}}</div></div>
        </div>
      </template>
      <div v-else class="empty">
        没有消息
      </div>
    </div>
    <div class="chat-bottom">
      <el-input v-model="chatMsg" class="chat-input" placeholder="请输入内容" />
      <el-button class="chat-btn" type="primary" @click="sendMsg">发送</el-button>
    </div>
  </div>
</template>
<style lang="less" scoped>
</style>