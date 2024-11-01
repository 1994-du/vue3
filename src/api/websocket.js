import {io} from "socket.io-client"
import store from '@/store'
import router from "@/router"
let websocketSrc = 'http://localhost:1234'
let socket = io(websocketSrc)
socket.on('connect',()=>{
    // let userInfo=JSON.parse(sessionStorage.getItem('token'))
    // userInfo.msg=chatMsg.value
    // userInfo.time=currentTime()
    // proxy.$socket.emit('send-message',userInfo)
})
socket.on('msg_res',(msg)=>{
  if(router.currentRoute.value.path!=='/websocket'){
    store.commit('addMessage',{msg:msg})
  }
})
socket.on('disconnect',()=>{
  socket.disconnect()
  socket.close()
})
export default socket