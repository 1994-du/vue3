<script setup>
import { onMounted,ref,reactive, onDeactivated, onUnmounted, onActivated,nextTick ,getCurrentInstance, computed} from "vue";
const {proxy} = getCurrentInstance()
const chatList = ref([])
const chatMsg = ref('')
// console.log('历史聊天',historyMsg);
// 获取服务器时间
const currentTime = function(){
  let xmlHttp = new XMLHttpRequest()
  if(!xmlHttp){
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
  }
  xmlHttp.open("HEAD",location.href,false)
  xmlHttp.send()
  let serverTime = new Date(xmlHttp.getResponseHeader("Date"))
  return serverTime.toLocaleString()
}
let userId = JSON.parse(sessionStorage.getItem('token')).id
onMounted(()=>{
  // 获取历史聊天记录
  // let historyMsg = computed(()=>{
  //   return proxy.$store.state.message
  // })
  // if(historyMsg.value.length>0){
  //   historyMsg.value.forEach(el=>{
  //     chatList.value.push(el)
  //     to_footer()
  //   })
  // }
  
  // proxy.$store.commit('clearMessage')
  // proxy.$socket.on('msg_res',(msg)=>{
  //   // console.log('其他客户端信息',msg);
  //   chatList.value.push(msg)
    
  //   to_footer()
  // })
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
  let userInfo=JSON.parse(sessionStorage.getItem('token'))
  userInfo.msg=chatMsg.value
  userInfo.time=currentTime()
  proxy.$socket.emit('send-message',userInfo)
  chatList.value.push(userInfo)
  proxy.$store.commit('addMessage',{msg:userInfo})
  to_footer()
  chatMsg.value = ''
}
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
@import "@/styles/websocket.scss";
</style>