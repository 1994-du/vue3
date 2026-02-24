<template>
    <dx-button @click="sendRequest">请求</dx-button>
    <dx-button @click="cancleReq">取消所有请求</dx-button>
<CodeEditor class="pb-[10px]" code="import axios from 'axios'
const controller = new AbortController();// 1
const cancelToken = axios.CancelToken.source();// 2
axios({
    url:'/api/toDelayTest',
    method:'post',
    data:{
        name:'张三',
        age:18
    },
    signal:controller.signal,// 1
    cancelToken:cancelToken.token// 2
}).then((res)=>{
    console.log('请求成功',res);
}).catch((err)=>{
    console.log('请求失败',err);
})
// 取消请求
controller.abort();// 1
cancelToken.cancel('取消请求');// 2"
/>
<CodeEditor code="// 获取接口请求上次、下载进度
onUploadProgress:(provessEvt)=>{
    const percentProcess = Math.round((provessEvt.loaded / provessEvt.total) * 100)
    console.log('upload',percentProcess)
},
onDownloadProgress:(provessEvt)=>{
    const percentProcess = Math.round((provessEvt.loaded / provessEvt.total) * 100)
    console.log('download',percentProcess)
}"
/>
</template>
<script setup lang="ts">
import axios from 'axios'

let controllers: any[] = [];
let cancelTokens: any[] = [];
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
const sendRequest=()=>{ 
    axios.post('/getway/mock/user/info').then((res)=>{
        console.log('请求成功',res);
    }).catch((err)=>{
        console.log('请求失败',err);
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