<template>
    <div class="use-axios-container">
        <div class="button-group">
            <button class="btn btn-primary" @click="sendRequest">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                发送请求
            </button>
            <button class="btn btn-danger" @click="cancleReq">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 6l12 12M18 6L6 18"/>
                </svg>
                取消所有请求
            </button>
        </div>
        
        <!-- 响应结果展示 -->
        <div v-if="responseData" class="response-box">
            <h3 class="response-title">响应结果</h3>
            <pre class="response-content">{{ JSON.stringify(responseData, null, 2) }}</pre>
        </div>
        
        <CodeEditor class="pb-[10px]" code="import { getUsers } from '@/api/api'
// 使用封装好的接口
getUsers({ page: 1, pageSize: 10 }).then(res => {
    console.log('请求成功', res)
}).catch(err => {
    console.log('请求失败', err)
})"
        />
        
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
        
        <CodeEditor class="pb-[10px]" code="// 获取接口请求上次、下载进度
onUploadProgress:(progressEvt)=>{
    const percentProcess = Math.round((progressEvt.loaded / progressEvt.total) * 100)
    console.log('upload',percentProcess)
},
onDownloadProgress:(progressEvt)=>{
    const percentProcess = Math.round((progressEvt.loaded / progressEvt.total) * 100)
    console.log('download',percentProcess)
}"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getUsers } from '@/api/api'

let controllers: any[] = [];
let cancelTokens: any[] = [];
const responseData = ref<any>(null);

const cancleReq = () => {
    controllers.forEach(controller => {
        if (controller) {
            controller.abort();
            controller = null;
        }
    })
    controllers = [];

    cancelTokens.forEach(cancelToken => {
        if (cancelToken) {
            cancelToken.cancel('请求已取消');
        }
    })
    cancelTokens = [];
}

const sendRequest = () => { 
    getUsers({ page: 1, pageSize: 10 }).then(res => {
        console.log('请求成功', res);
        responseData.value = res;
    }).catch(err => {
        console.log('请求失败', err);
    })
}
</script>

<style lang="scss" scoped>
.use-axios-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
}

.button-group {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateY(0);
    }

    &.btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;

        &:hover {
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
    }

    &.btn-danger {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;

        &:hover {
            box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
        }
    }
}

.response-box {
    background: rgba(15, 15, 35, 0.8);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 20px;
    backdrop-filter: blur(10px);
}

.response-title {
    font-size: 16px;
    color: var(--primary);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.response-content {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    padding: 16px;
    color: #e0e0e0;
    font-size: 13px;
    line-height: 1.6;
    overflow-x: auto;
    max-height: 300px;
    overflow-y: auto;
}

h2, p {
    text-align: left;
}

img {
    width: 100px;
    transition: all 2s;
}  
</style>