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

interface GetUsersResponse {
    data: any
    code?: number
    message?: string
}

let controllers: any[] = [];
let cancelTokens: any[] = [];
const responseData = ref<any>(null);

const cancleReq = () => {
    controllers.forEach(controller => {
        if (controller) {
            controller.abort();
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
    getUsers({ page: 1, pageSize: 10 }).then((res: any) => {
        responseData.value = res;
    }).catch((err: unknown) => {
    })
}
</script>

<style lang="scss" scoped>
/* 这里原来是「紫粉渐变 + hover 上浮 2px + 彩色投影」的一套按钮，外加一块为暗色
   主题写死的响应框（rgba(15,15,35,.8)）——在亮色主题下会变成突兀的近黑方块。
   改成终端语汇：平色底 + hairline 描边 + 0 圆角，交互只改底色与描边，不位移。
   容器的 padding 也去掉了：.layout_content 已经给了 16px，叠起来会到 36px。 */
.use-axios-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.button-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 32px;
    padding: 0 14px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--text-secondary);
    background: transparent;
    border: 1px solid var(--hairline);
    border-radius: 0;
    cursor: pointer;
    transition: color var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast);

    &:hover {
        color: var(--brand);
        background: var(--surface-muted);
        border-color: var(--brand);
    }

    /* 一页里最响的那一个：琥珀实底，字取地面色 */
    &.btn-primary {
        color: var(--app-bg);
        background: var(--brand);
        border-color: var(--brand);

        &:hover {
            color: var(--app-bg);
            background: var(--brand-hover);
            border-color: var(--brand-hover);
        }
    }

    /* 破坏性操作用语义红描边，不靠填充抢戏 */
    &.btn-danger {
        color: var(--danger);
        border-color: color-mix(in srgb, var(--danger) 42%, transparent);

        &:hover {
            color: var(--danger);
            background: color-mix(in srgb, var(--danger) 10%, transparent);
            border-color: var(--danger);
        }
    }
}

.response-box {
    padding: 14px;
    border: 1px solid var(--hairline);
    background: var(--surface);
}

.response-title {
    margin: 0 0 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-tertiary);
}

/* 响应体是数据，就按数据排版：等宽、可滚动、贴地色。 */
.response-content {
    margin: 0;
    padding: 12px;
    max-height: 300px;
    overflow: auto;
    border: 1px solid var(--hairline);
    background: var(--app-bg);
    color: var(--text-secondary);
    font-size: 12px;
    line-height: 1.6;
}

h2, p {
    text-align: left;
}

img {
    width: 100px;
    transition: all 2s;
}  
</style>