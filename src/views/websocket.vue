<script setup>
import {io} from "socket.io-client"
import { onMounted,ref,reactive, onDeactivated, onUnmounted, onActivated,nextTick } from "vue";
const chatList = ref([])
const chatMsg = ref('')
let socket=ref(null)
// 获取服务器时间
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
let userId = JSON.parse(localStorage.getItem('token')).id
onMounted(()=>{
    socket = io('http://localhost:1234');
    socket.on('connect',()=>{
        console.log(socket.id,'监听客户端连接成功-connect');
    })
    socket.on('message',msg=>{
      console.log('服务器发送信息',msg);
      chatList.value.push(msg)
      to_footer()
      
    })
    socket.on('msg_res',(msg)=>{
      console.log('其他客户端信息',msg);
      chatList.value.push(msg)
      to_footer()
    })
    socket.on('disconnect',()=>{
      socket.disconnect()
      socket.close()
    })
})
 /*滚动条到底部*/
const to_footer = function() {
  nextTick(()=>{
    var div = document.getElementsByClassName('chat-content')[0];
    div.scrollTop = div.scrollHeight;
  })
    
}
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
</script>
<template>
<div class="container">
    <div class="chat-content">
      <template v-if="chatList && chatList.length">
        <div
          v-for="(chat, index) in chatList"
          class="message-box"
          :key="index"
        >
          <div class="user" :class="chat.id===userId?'isSelf':''">
            <el-avatar class="avatar" :src="chat.avatar" shape="square"></el-avatar>
            <div class="info">
              <div class="name">{{chat.name}}</div>
              <div class="message"><div class="block">{{chat.msg}}</div></div>
              <!-- <div class="time">{{ chat.time }}</div> -->
            </div>
            <!-- <el-avatar v-if="chat.id === userInfo.id" class="avatar" :src="chat.avatar" ></el-avatar> -->
          </div>
          
        </div>
      </template>
      <template v-else>
        <div class="empty">
          没有消息
        </div>
      </template>
    </div>
    <div class="chat-bottom">
      <el-input v-model="chatMsg" class="chat-input" placeholder="请输入内容" @keydown.enter="sendMsg"/>
      <el-button class="chat-btn" type="primary" @click="sendMsg">发送</el-button>
    </div>
  </div>
</template>
<style lang="less" scoped>
@import "@/styles/websocket.less";
</style>