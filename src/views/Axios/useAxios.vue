<template>
    <h2>请求方法：get、post、delete、put、patch、options、head</h2>
    <button @click="req">请求</button>
    <button @click="cancleReq">取消所有请求</button>
    <code>
        <pre>import axios from 'axios'</pre>
        <pre>controller = new AbortController();// 1</pre>
        <pre>cancelToken = axios.CancelToken.source();// 2</pre>
        <pre>axios({</pre>
        <pre>   url:'/api/toDelayTest',</pre>
        <pre>   method:'post',</pre>
        <pre>   data,</pre>
        <pre>   signal:controller.signal,// 1</pre>
        <pre>   cancelToken:cancelToken.token// 2</pre>
        <pre>})</pre>
        <pre>// 取消请求</pre>
        <pre>controller.abort();// 1</pre>
        <pre>cancelToken.cancel('取消请求');// 2</pre>
    </code>
    <code>
        <pre>// 获取接口请求上传、下载进度</pre>
        <pre>onUploadProgress:(provessEvt)=>{</pre>
        <pre>   const percentProcess = Math.round((provessEvt.loaded / provessEvt.total) * 100)</pre>
        <pre>   console.log('upload',percentProcess)</pre>
        <pre>},</pre>
        <pre>onDownloadProgress:(provessEvt)=>{</pre>
        <pre>   const percentProcess = Math.round((provessEvt.loaded / provessEvt.total) * 100)</pre>
        <pre>   console.log('download',percentProcess)</pre>
        <pre>}</pre>
    </code>
    
</template>
<script setup>
import { toDelayTest } from '@/api/api'
import axios from 'axios'
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
let controller=null;
let controllers=[];
let cancelToken=null;
let cancelTokens=[];
const cancleReq=()=>{
    controllers.forEach(controller=>{
        if(controller){
            controller.abort();
            controller=null;
        }
    })
    controllers=[];

    cancelTokens.forEach(cancelToken=>{
        if(cancelToken){
            cancelToken.cancel('请求已取消');
        }
    })
    cancelTokens=[];
}
const req=()=>{
    controller = new AbortController()
    controllers.push(controller)
    cancelToken = axios.CancelToken.source()
    cancelTokens.push(cancelToken)
    toDelayTest(null,{
        signal:controller.signal,
        cancelToken:cancelToken.token,
        onUploadProgress:(provessEvt)=>{
            const percentProcess = Math.round((provessEvt.loaded / provessEvt.total) * 100)
            console.log('upload',percentProcess)
        },
        onDownloadProgress:(provessEvt)=>{
            const percentProcess = Math.round((provessEvt.loaded / provessEvt.total) * 100)
            console.log('download',percentProcess)
        }
    }).then(res=>{
        console.log(res)
    }).catch(err=>{
        proxy.$message.error(err.message)
    })
}
</script>
<style lang="scss" scoped>
h2,p{
    text-align: left;
}
.use_axios{
    display: flex;
    flex-direction: column;
}
img {
    width: 100px;
    transition: all 2s;
}  
</style>