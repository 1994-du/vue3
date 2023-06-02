import { io } from "socket.io-client";
const socket = io('http://192.168.31.65:3001',{
    query:{},
    transports:['websocket','polling'],
    timeout:5000
})
export default socket