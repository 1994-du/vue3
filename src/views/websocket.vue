<template>
  <div class="page">
    <!-- 概念：只加说明，不动下面的聊天逻辑 -->
    <section class="panel">
      <div class="panel__head">
        <div class="head-group">
          <span class="kicker">WebSocket</span>
          <h2 class="panel__title">一次 HTTP 握手，换来双向长连接</h2>
        </div>
        <span class="panel__meta">下面这个聊天室是真实在跑的</span>
      </div>
      <div class="panel__body">
        <p class="intro__text">
          HTTP 是<em>问一句答一句</em>，服务端永远不能主动开口。WebSocket 先用一次 HTTP 请求
          带上 <code>Upgrade: websocket</code>，服务端回 <strong>101 Switching Protocols</strong>
          —— 从这一刻起这条连接就不再是 HTTP 了，双方可以随时互相推数据，
          也就省掉了轮询那一堆重复的请求头。
        </p>
        <div class="intro__points">
          <div class="point">
            <span class="point__k">和轮询比</span>
            <span class="point__v">省掉每次的 HTTP 头开销，延迟从「轮询间隔」降到「网络往返」</span>
          </div>
          <div class="point">
            <span class="point__k">生产必补三件事</span>
            <span class="point__v">心跳保活、断线重连（指数退避）、重连后重新订阅</span>
          </div>
          <div class="point">
            <span class="point__k">readyState</span>
            <span class="point__v">CONNECTING(0) / OPEN(1) / CLOSING(2) / CLOSED(3)，发消息前要判断</span>
          </div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel__head">
        <div class="head-group">
          <span class="kicker">Live Chat</span>
          <h2 class="panel__title">实时聊天室</h2>
        </div>
        <span class="panel__meta">连的是 {{ wsUrl }}，消息会推给所有在线的人</span>
      </div>
      <div class="panel__body">
  <div class="websocket_wrap">
    <div ref="message_box" class="message_box">
      <div class="message_box_item" :class="item.username !== username ? 'active' : ''" v-for="(item, index) in messageList" :key="index">
        <!-- 显示时间 -->
        <div class="message_box_item_time">{{ item.time }}</div>
        <div class="message_box_item_content">
          <div v-if="item.username === username" class="message_box_item_username">
            <img :src="`${item.avatar}`" alt="">
          </div>
          <div v-else class="message_box_item_username_other">
            <img :src="`${item.avatar}`" alt="">
          </div>
          <div class="message_box_item_message">
            <!-- 显示图片 -->
            <img v-if="item.isImage" :src="`${item.image}`" alt="图片" @click="openImagePreview(item.message)">
            <div v-else class="message_rows" :class="item.username === username ? 'me' : 'other'">{{ item.message }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="websocket_ipt">
      <el-input v-model="message" placeholder="发送消息" @keydown.enter="sendMessage"></el-input>
      <div class="custom-file-input">
        <input type="file" ref="fileInput" @change="sendImage" accept="image/*" style="display: none;">
        <el-button type="primary" @click="openFileSelector">选择图片</el-button>
      </div>
      <el-button type="primary" @click="sendMessage">发送消息</el-button>
    </div>
    <!-- 全屏预览容器 -->
    <div v-if="isImagePreviewVisible" class="image-preview" @click.stop="closeImagePreview">
      <img :src="previewImageSrc" alt="预览图片" @click.stop>
      <div class="close-button" @click.stop="closeImagePreview">×</div>
    </div>
  </div>
      </div>
    </section>

    <!-- 源码：页面里真实运行的那部分 -->
    <section class="panel">
      <div class="panel__head">
        <div class="head-group">
          <span class="kicker">Source</span>
          <h2 class="panel__title">心跳、重连与状态判断</h2>
        </div>
        <span class="panel__meta">单纯的 new WebSocket 撑不到生产</span>
      </div>
      <div class="panel__body">
        <div class="code-block">
          <div class="code-block__label">一个能真正上线的基础封装</div>
          <CodeEditor :code="wsCode" />
        </div>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
// @ts-ignore
import { uploadFile } from '@/api/api';

// 定义消息项接口
interface MessageItem {
    username: string
    avatar: string
    message: string
    image?: string
    isImage: boolean
    time: string
}

// 定义WebSocket消息负载接口
interface WebSocketPayload {
    type: string
    payload: {
        username?: string
        avatar?: string
        message?: string
        image?: string
        isImage?: boolean | string
        time?: string
        token?: string
    }
}

// 定义上传响应接口
interface UploadResponse {
    status: string
    fileUrl?: string
    msg?: string
}

const wsUrl = String(import.meta.env.VITE_WS ?? '')

let username = localStorage.getItem('username') || '';
let message_box = ref<HTMLElement | null>(null);
const message = ref('');
let messageList = ref<MessageItem[]>([]);
let socket: WebSocket | null = null;
const isImagePreviewVisible = ref(false);
const previewImageSrc = ref('');

// 获取当前时间，包含年月日时分秒
const getCurrentTime = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 连接服务器
const connectServer = (): void => {
  socket = new WebSocket(import.meta.env.VITE_WS);
  socket.onopen = () => {
    const userMessage = {
      type: 'username',
      payload: {
        username: username,
        token: localStorage.getItem('token'),
        time: getCurrentTime() // 添加时间属性
      }
    };
    socket?.send(JSON.stringify(userMessage));
  };
  socket.onmessage = (event: MessageEvent) => {
    const data: WebSocketPayload = JSON.parse(event.data);
    if (data.type === 'userJoined') {
      ElMessage({
        message: data.payload.message,
        type: 'info'
      });
    } else if(data.type === 'chat'){
      let newMessage: MessageItem;
      if (data.payload.isImage && (data.payload.isImage === true || data.payload.isImage === 'true')) {
        // 若为图片消息，直接使用完整的 payload
        newMessage = {
          avatar: data.payload.avatar || '',
          username: data.payload.username || '',
          image: data.payload.image,
          message: data.payload.image || '',
          isImage: true,
          time: data.payload.time || '' // 从 payload 中获取时间属性
        };
      } else {
        // 若为普通文本消息，按原逻辑处理
        newMessage = {
          avatar: data.payload.avatar || '',
          username: data.payload.username || '',
          message: data.payload.message || '',
          isImage: false,
          time: data.payload.time || '' // 从 payload 中获取时间属性
        };
      }
      messageList.value.push(newMessage);
      nextTick(() => {
        if (message_box.value) {
          message_box.value.scrollTop = message_box.value.scrollHeight;
        }
      });
    }
  };
  socket.onclose = (event: CloseEvent) => {
  };
};

const sendMessage = (): void => {
  if (socket && socket.readyState === WebSocket.OPEN && message.value) {
    const chatMessage = {
      type: 'chat',
      payload: {
        isImage: false,
        token: localStorage.getItem('token'),
        username: username,
        message: message.value,
        time: getCurrentTime() // 添加时间属性
      },
    };
    socket.send(JSON.stringify(chatMessage));
    message.value = '';
  } else {
  }
};

const fileInput = ref<HTMLInputElement | null>(null);

const openFileSelector = (): void => {
  fileInput.value?.click();
};

// 发送图片
const sendImage = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    try {
      // 创建FormData对象上传图片
      const formData = new FormData();
      formData.append('file', file);
      const response: any = await uploadFile(formData);
      
      // 检查上传是否成功
      if (response.status === 'success') {
        // 获取返回的图片地址
        // 假设接口返回的数据格式是 { data: { url: '图片地址' } } 或直接返回图片地址
        const imageUrl = response.fileUrl;
        
        // 通过WebSocket发送图片消息，使用服务器返回的图片地址
        if (socket && socket.readyState === WebSocket.OPEN) {
          const imageMessage = {
            type: 'chat',
            payload: {
              isImage: true,
              token: localStorage.getItem('token'),
              username: username,
              image: imageUrl, // 使用服务器返回的图片地址
              time: getCurrentTime() // 添加时间属性
            }
          };
          socket.send(JSON.stringify(imageMessage));
        } else {
          ElMessage({ message: 'WebSocket未连接', type: 'error' });
        }
      } else {
        ElMessage({ message: '图片上传失败', type: 'error' });
      }
    } catch (error) {
      ElMessage({ message: '图片上传失败，请重试', type: 'error' });
    }
  }
  // 清空文件输入，允许重复选择相同的文件
  target.value = '';
};

const disConnectServer = (): void => {
  if (socket) {
    socket.close();
  }
};

// 打开图片预览
const openImagePreview = (src: string): void => {
  previewImageSrc.value = `${src}`;
  isImagePreviewVisible.value = true;
};

// 关闭图片预览
const closeImagePreview = (): void => {
  isImagePreviewVisible.value = false;
};

onMounted(() => {
  connectServer();
});

onUnmounted(() => {
  disConnectServer();
});

/* ── 展示用源码 ──────────────────────────────────────── */
const wsCode = `// ① 最基础的用法（本页聊天室就是这么连的）
const socket = new WebSocket(import.meta.env.VITE_WS)

socket.onopen = () => socket.send(JSON.stringify({ type: 'username', payload: { token } }))
socket.onmessage = (e) => handle(JSON.parse(e.data))
socket.onerror = (e) => console.error('ws error', e)
socket.onclose = (e) => console.log('关闭码', e.code, e.reason)

// 发之前一定判断状态，CLOSED 上 send 会直接抛错
if (socket.readyState === WebSocket.OPEN) socket.send(data)

// ── ② 生产要补的三件事 ──────────────────────────────────
class ReconnectWS {
  private ws: WebSocket | null = null
  private retries = 0
  private timer: number | null = null
  private pingTimer: number | null = null

  connect() {
    this.ws = new WebSocket(import.meta.env.VITE_WS)
    this.ws.onopen = () => {
      this.retries = 0
      this.heartbeat()
      this.onReopen?.()          // ← 重连后要重新订阅 / 补发未送达的消息
    }
    this.ws.onclose = () => this.scheduleReconnect()
  }

  /** 心跳：定时发 ping，服务端回了就说明连接还活着 */
  private heartbeat() {
    if (this.pingTimer) clearInterval(this.pingTimer)
    this.pingTimer = window.setInterval(() => {
      if (this.ws?.readyState !== WebSocket.OPEN) return
      this.ws.send(JSON.stringify({ type: 'ping' }))
    }, 25_000)
  }

  /** 指数退避重连：1s / 2s / 4s … 封顶 30s，别写成死循环狂重连 */
  private scheduleReconnect() {
    if (this.timer) return
    const delay = Math.min(30_000, 1000 * 2 ** this.retries++)
    this.timer = window.setTimeout(() => {
      this.timer = null
      this.connect()
    }, delay)
  }

  send(data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(data))
    else console.warn('连接不可用，这条消息丢了', data)   // 或者先入队，恢复后补发
  }

  close() {
    if (this.pingTimer) clearInterval(this.pingTimer)
    if (this.timer) clearTimeout(this.timer)
    this.ws?.close(1000, 'client close')                 // 1000 = 正常关闭
  }
}

// ── ③ 几个要记住的细节 ──────────────────────────────────
// · 浏览器对 ws:// 的个数有限制（每页约 255），别每个组件都 new 一条
// · 页面隐藏（切 tabs）时连接可能被节流，心跳间隔要留余量
// · 部署在 HTTPS 下就必须用 wss://，否则浏览器直接拒绝
// · 图片这类大消息别走 WebSocket：先 HTTP 上传拿到 URL，再把 URL 发出去
//   —— 本页「发送图片」走的正是这条路`
</script>
<style lang='scss' scoped>
.websocket_wrap {
  display: flex;
  flex-direction: column;
}

.message_box {
  height: clamp(300px, 300px, 500px);
  overflow-y: auto;
  border: 1px solid var(--hairline);
  margin-bottom: 10px;
  background: var(--surface);
  padding: 8px 4px;
  .message_box_item {
    display: flex;
    flex-direction: column;
    align-items: end;
    margin: 20px 10px 20px 10px;
    .message_box_item_time{
      margin-bottom: 10px;
      color: var(--text-tertiary);
      font-family: var(--font-mono);
      font-size: 12px;
      letter-spacing: 0.02em;
    }
    .message_box_item_content{
      display: flex;
      align-items: flex-start;
      flex-direction: row-reverse;
      .message_box_item_username {
        width: 50px;
        height: 50px;
        border-radius: var(--radius-md);
        background: var(--glass-strong);
        border: 1px solid var(--hairline);
        line-height: 40px;
        font-size: 14px;
        padding: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        img{
          width: 100%;
          height: 100%;
          border-radius: var(--radius-sm);
        }
      }
      .message_box_item_username_other {
        width: 50px;
        height: 50px;
        border-radius: var(--radius-md);
        background: var(--glass-strong);
        border: 1px solid var(--hairline);
        line-height: 40px;
        font-size: 14px;
        padding: 5px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          width: 100%;
          height: 100%;
          border-radius: var(--radius-sm);
        }
      }
      .message_box_item_message {
        font-size: 15px;
        margin: 0 10px;
        color: var(--text-primary);
        img {
          max-width: 200px; /* 设置图片最大宽度 */
          max-height: 200px; /* 设置图片最大高度 */
          cursor: pointer; // 添加鼠标指针样式
          border-radius: var(--radius-sm);
          border: 1px solid var(--hairline-strong);
        }
        .message_rows{
          font-size: 14px;
          max-width: 600px; /* 设置图片最大宽度 */
          text-wrap: break-word;
          text-align: left;
          padding: 10px 15px;
          border-radius: var(--radius-md);
          position: relative;
          line-height: 1.6;
          
        }
        .other{
          background: var(--glass-strong);
          color: var(--text-primary);
          border: 1px solid var(--hairline);
          border-top-left-radius: var(--radius-xs);
        }
        .me{
          background: var(--brand);
          color: var(--app-bg);
          border-top-right-radius: var(--radius-xs);
        }
      }
    }    
  }
  .active {
    justify-content: flex-start;
    align-items: start;
    .message_box_item_content{
      flex-direction: row;
    }
  }
}

.websocket_ipt {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  .custom-file-input {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .el-input {
    height: 100%;
  }
  .el-button {
    height: 100%;
    margin-left: 10px;
  }
}

// 全屏预览样式
.image-preview {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--veil);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  img {
    max-width: 90%;
    max-height: 90%;
  }

  /* 关闭按钮用文本色而不是写死白色：亮色主题下遮罩是浅灰，白字会看不见。 */
  .close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    color: var(--text-primary);
    font-size: 22px;
    cursor: pointer;
  }
}
</style>