<script setup>
import io from "socket.io-client"
import { onMounted,ref,reactive } from "vue";
const avatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
const chatList = ref([])
const chatMsg = ref('')
const userList = [{name:'用户1',id:0,avatar}]
const userInfo = reactive({user:userList[0]})
let socket;
onMounted(()=>{
    socket = io('http://localhost:3001');
    socket.on('connect',()=>{
        console.log(socket.id,'监听客户端连接成功-connect');
    })
    socket.on('fresh-message',(data)=>{
        chatList.value=data
    })
})
const selectUser=(user)=>{
    userInfo.user = user
}
const sendMsg = ()=>{
    socket.emit('send-message',userInfo.user,chatMsg.value)
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
          :class="{'right-message': chat.user.id === userInfo.user.id}"
          :key="index"
        >
          <div class="user">
            <el-avatar v-if="chat.user.id !== userInfo.user.id" class="avatar" :src="chat.user.avatar" ></el-avatar>
            <div class="info">
              <div class="name">{{chat.user.name}}</div>
              <div class="time">{{chat.createTime}}</div>
            </div>
            <el-avatar v-if="chat.user.id === userInfo.user.id" class="avatar" :src="chat.user.avatar" ></el-avatar>
          </div>
          <div class="message"><div class="block">{{chat.message}}</div></div>
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
    <div style="margin-top: 10px;">当前用户：
      <el-select v-model="userInfo.user" value-key="id" @change="selectUser" placeholder="Select">
        <el-option
          v-for="item in userList"
          :key="item.id"
          :label="item.name"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<style lang="less" scoped>
</style>