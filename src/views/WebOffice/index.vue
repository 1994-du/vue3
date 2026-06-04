<template>
    <div class="web-office-container">
        <div class="header">
            <h2>Web Office SDK 完整示例</h2>
            <p>Web Office SDK v1.1.20 在线文档编辑组件使用演示</p>
        </div>
        
        <div class="config-section">
            <h3>📋 配置选项</h3>
            
            <div class="upload-section">
                <h4>📤 上传文件</h4>
                <el-upload
                    drag
                    :file-list="fileList"
                    :before-upload="beforeUpload"
                    :on-change="handleChange"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :http-request="customUpload"
                    :limit="1"
                    :on-exceed="handleExceed"
                    accept=".docx,.xlsx,.pptx"
                >
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        将文件拖到此处，或 <em>点击上传</em>
                    </div>
                    <template #tip>
                        <div class="el-upload__tip">
                            支持 docx、xlsx、pptx 格式文件
                        </div>
                    </template>
                </el-upload>
            </div>

            <div class="config-grid" style="margin-top: 24px;">
                <div class="config-item">
                    <label>文档类型</label>
                    <select v-model="config.fileType">
                        <option value="docx">Word (.docx)</option>
                        <option value="xlsx">Excel (.xlsx)</option>
                        <option value="pptx">PowerPoint (.pptx)</option>
                    </select>
                </div>
                <div class="config-item">
                    <label>文档标题</label>
                    <input type="text" v-model="config.title" placeholder="输入文档标题">
                </div>
                <div class="config-item">
                    <label>编辑模式</label>
                    <select v-model="config.mode">
                        <option value="edit">编辑模式</option>
                        <option value="view">只读模式</option>
                    </select>
                </div>
                <div class="config-item">
                    <label>AppID</label>
                    <input type="text" v-model="config.appId" placeholder="输入 AppID">
                </div>
                <div class="config-item">
                    <label>FileID</label>
                    <input type="text" v-model="config.fileId" placeholder="输入 FileID">
                </div>
                <div class="config-item" style="grid-column: 1 / -1;">
                    <label>Token (可选)</label>
                    <input type="text" v-model="config.token" placeholder="输入 WPS Office SDK Token">
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" @click="initOffice">
                    <span>🚀</span> 初始化文档
                </button>
                <button class="btn btn-secondary" @click="destroyOffice">
                    <span>🗑️</span> 销毁实例
                </button>
            </div>
        </div>
        
        <div class="office-section">
            <h3>📄 Web Office 文档区域</h3>
            <div class="office-container">
                <div v-if="!isInitialized" class="placeholder">
                    <div class="icon">📁</div>
                    <p>点击上方"初始化文档"按钮开始</p>
                </div>
                <div ref="officeViewer" id="office-container" v-else class="office-viewer"></div>
            </div>
        </div>
        
        <div class="code-section">
            <h3>📝 使用示例代码</h3>
            <div class="code-tabs">
                <button 
                    v-for="tab in codeTabs" 
                    :key="tab.name"
                    :class="{ active: activeCodeTab === tab.name }"
                    @click="activeCodeTab = tab.name"
                >
                    {{ tab.label }}
                </button>
            </div>
            <div class="code-content">
                <pre><code>{{ activeCode }}</code></pre>
            </div>
        </div>
        
        <div class="log-section">
            <div class="log-header">
                <h3>📊 操作日志</h3>
                <button class="btn btn-small" @click="clearLogs">清空日志</button>
            </div>
            <div class="log-container" ref="logContainer">
                <div v-for="(log, index) in logs" :key="index" :class="['log-item', log.type]">
                    <span class="log-time">{{ log.time }}</span>
                    <span class="log-type">[{{ log.type }}]</span>
                    <span class="log-message">{{ log.message }}</span>
                </div>
                <div v-if="logs.length === 0" class="log-empty">暂无日志记录</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { config as WebOfficeConfig } from '@/assets/web-office-sdk-v1.1.20.es.js'
import { uploadToWPS, wpsUpload } from '@/api/wps'

const officeViewer = ref<HTMLElement | null>(null)
const logContainer = ref<HTMLElement | null>(null)
const isInitialized = ref(false)
const officeInstance = ref<any>(null)
const activeCodeTab = ref('basic')
const fileList = ref<any[]>([])
const isUploading = ref(false)

const config = ref({
    fileType: 'docx',
    title: '文档',
    mode: 'edit',
    appId: 'SX20250425VSHWJE',
    fileId: 'test-file-001',
    token: ''
})

const logs = ref<any[]>([])

const codeTabs = [
    { name: 'basic', label: '基础使用' },
    { name: 'events', label: '事件监听' },
    { name: 'api', label: 'API 调用' }
]

const codeExamples = {
    basic: `// 基础使用示例
import { config as WebOfficeConfig } from '@/assets/web-office-sdk-v1.1.20.es.js'

const wpsOffice = WebOfficeConfig({
    appId: 'your-app-id',
    fileId: 'your-file-id',
    mount: document.querySelector('#office-container'),
    commonOptions: {
        isShowTopArea: true,
        isShowHeader: true
    }
})

wpsOffice.ready()`,
    events: `// 事件监听
wpsOffice.on('fileOpen', () => {
    console.log('文档已打开')
})

wpsOffice.on('fileSaved', () => {
    console.log('文档已保存')
})

wpsOffice.on('fileStatus', (data) => {
    console.log('文件状态:', data)
})

wpsOffice.on('error', (error) => {
    console.error('错误:', error)
})`,
    api: `// API 调用
wpsOffice.save()
wpsOffice.destroy()
wpsOffice.updateConfig({})`
}

const activeCode = computed(() => (codeExamples as any)[activeCodeTab.value])

const addLog = (type: string, ...messages: any[]) => {
    const time = new Date().toLocaleTimeString()
    const message = messages.map(m => {
        if (typeof m === 'object') {
            try {
                return JSON.stringify(m)
            } catch (e) {
                return String(m)
            }
        }
        return String(m)
    }).join(' ')
    logs.value.push({ type, message, time })
    console.log(`[${type.toUpperCase()}]`, ...messages)
    nextTick(() => {
        if (logContainer.value) {
            logContainer.value.scrollTop = logContainer.value.scrollHeight
        }
    })
}

const clearLogs = () => {
    logs.value = []
}

// 上传相关方法
const beforeUpload = (file: any) => {
    const validTypes = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
    const fileName = file.name.toLowerCase()
    const isValidType = fileName.endsWith('.docx') || 
                       fileName.endsWith('.xlsx') || 
                       fileName.endsWith('.pptx')
    
    if (!isValidType) {
        ElMessage.error('只能上传 docx、xlsx、pptx 格式的文件！')
        return false
    }
    
    // 自动判断文档类型
    if (fileName.endsWith('.docx')) {
        config.value.fileType = 'docx'
    } else if (fileName.endsWith('.xlsx')) {
        config.value.fileType = 'xlsx'
    } else if (fileName.endsWith('.pptx')) {
        config.value.fileType = 'pptx'
    }
    
    config.value.title = file.name
    return true
}

const handleChange = (file: any, fileList: any[]) => {
    addLog('info', `文件选择: ${file.name}`)
}

const handleExceed = () => {
    ElMessage.warning('只能上传一个文件！')
}

const customUpload = async (options: any) => {
    const { file, onSuccess, onError, onProgress } = options
    
    try {
        isUploading.value = true
        addLog('info', `开始上传文件到 WPS: ${file.name}`)
        
        const formData = new FormData()
        formData.append('file', file)
        
        // 使用后端提供的 /wps/upload 接口
        const response: any = await wpsUpload(formData, {
            onUploadProgress: (progressEvent: any) => {
                const percent = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                )
                onProgress({ percent })
                addLog('info', `上传进度: ${percent}%`)
            }
        })
        
        addLog('success', '文件上传到 WPS 成功！')
        addLog('info', 'WPS 响应:', response)
        
        // 解析后端返回的数据
        let wpsFileId = null
        
        // 根据后端实际返回结构调整
        if (response.data) {
            if (response.data.wpsFileId) {
                wpsFileId = response.data.wpsFileId
            } else if (response.data.fileId) {
                wpsFileId = response.data.fileId
            } else if (response.data.data && response.data.data.wpsFileId) {
                wpsFileId = response.data.data.wpsFileId
            }
        }
        
        if (wpsFileId) {
            config.value.fileId = wpsFileId
            addLog('info', `获取到 WPS FileID: ${wpsFileId}`)
            onSuccess({ wpsFileId })
            
            // 自动初始化文档
            ElMessage.success('上传成功，即将打开文档...')
            setTimeout(() => {
                initOffice()
            }, 1000)
        } else {
            addLog('error', '后端未返回 WPS FileID，请检查接口响应')
            ElMessage.error('获取文件信息失败，请重试')
            onError(new Error('未获取到 WPS FileID'))
        }
        
    } catch (error: any) {
        addLog('error', `上传失败: ${error.message}`)
        ElMessage.error('上传失败，请重试')
        onError(error)
    } finally {
        isUploading.value = false
    }
}

const handleSuccess = (response: any, file: any) => {
    addLog('info', '文件上传处理完成')
}

const handleError = (error: any, file: any) => {
    addLog('error', `文件上传出错: ${error.message}`)
}

const initOffice = () => {
    addLog('info', `开始初始化文档: ${config.value.title} (${config.value.fileType})`)
    addLog('info', 'AppID:', config.value.appId)
    addLog('info', 'FileID:', config.value.fileId)
    
    try {
        isInitialized.value = true
        
        nextTick(() => {
            const container = officeViewer.value as HTMLElement
            if (!container) {
                addLog('error', '找不到 office-container 元素')
                return
            }
            
            addLog('info', '容器元素:', container)
            
            container.innerHTML = ''
            
            let configOptions: Record<string, any> = {
                appId: config.value.appId,
                fileId: config.value.fileId,
                mount: container,
                commonOptions: {
                    isShowTopArea: true,
                    isShowHeader: true
                }
            }
            
            switch (config.value.fileType) {
                case 'docx':
                    configOptions.url = 'https://wwo.wps.cn/office/w/'
                    break
                case 'xlsx':
                    configOptions.url = 'https://wwo.wps.cn/office/s/'
                    break
                case 'pptx':
                    configOptions.url = 'https://wwo.wps.cn/office/p/'
                    break
            }

            if (config.value.token) {
                configOptions.token = config.value.token
            }

            addLog('info', '配置参数:', configOptions)
            addLog('info', '正在初始化 WPS Office SDK...')

            const wpsOffice = WebOfficeConfig(configOptions as any)
            
            addLog('info', 'wpsOffice 实例:', wpsOffice)
            
            officeInstance.value = wpsOffice
            
            addLog('success', 'SDK 初始化成功！')
            
            wpsOffice.on('fileOpen', () => {
                addLog('info', '文档已打开！')
            })
            
            wpsOffice.on('fileStatus', (data) => {
                addLog('info', `文件状态更新: ${JSON.stringify(data)}`)
            })
            
            wpsOffice.on('error', (error) => {
                addLog('error', `SDK 错误: ${JSON.stringify(error)}`)
                console.error('SDK 错误:', error)
            })
            
            wpsOffice.ready().then((app) => {
                addLog('info', 'SDK ready 回调触发！')
                addLog('info', 'Application 对象:', app)
            })
        })
        
    } catch (error: any) {
        addLog('error', `初始化失败: ${error.message}`)
        console.error('SDK 初始化错误:', error)
        console.error('错误堆栈:', error.stack)
    }
}

const destroyOffice = () => {
    addLog('warning', '开始销毁文档实例')
    if (officeInstance.value) {
        try {
            officeInstance.value.destroy()
            addLog('success', 'SDK 实例已销毁')
        } catch (error: any) {
            addLog('error', 'SDK 销毁错误: ' + error)
        }
        officeInstance.value = null
    }
    isInitialized.value = false
}

onMounted(() => {
    addLog('info', 'Web Office SDK 示例页面已加载')
    addLog('info', '版本: v1.1.20')
    addLog('info', '请点击"初始化文档"查看 SDK 信息')
})

onBeforeUnmount(() => {
    if (isInitialized.value) {
        destroyOffice()
    }
})
</script>

<style lang="scss" scoped>
.web-office-container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
}

.header {
    text-align: center;
    margin-bottom: 32px;
    
    h2 {
        color: var(--primary);
        margin-bottom: 8px;
        font-size: 28px;
    }
    
    p {
        color: #888;
        font-size: 14px;
    }
}

.config-section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 24px;
    border: 1px solid var(--border-color);
    margin-bottom: 24px;
    
    h3 {
        margin-bottom: 20px;
        color: var(--primary);
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .upload-section {
        margin-bottom: 16px;
        
        h4 {
            margin-bottom: 12px;
            color: #aaa;
            font-size: 14px;
        }
        
        :deep(.el-upload-dragger) {
            background: rgba(255, 255, 255, 0.05);
            border: 2px dashed var(--border-color);
            
            &:hover {
                border-color: var(--primary);
            }
        }
        
        :deep(.el-upload__text) {
            color: #aaa;
            
            em {
                color: var(--primary);
                font-style: normal;
            }
        }
        
        :deep(.el-upload__tip) {
            color: #666;
        }
    }
}

.config-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
}

.config-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    label {
        font-size: 14px;
        color: #aaa;
    }
    
    select, input {
        padding: 10px 14px;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        background: rgba(0, 0, 0, 0.3);
        color: white;
        font-size: 14px;
        
        &:focus {
            outline: none;
            border-color: var(--primary);
        }
    }
}

.btn-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.office-section {
    margin-bottom: 24px;
    
    h3 {
        margin-bottom: 16px;
        color: var(--primary);
        display: flex;
        align-items: center;
        gap: 8px;
    }
}

.office-container {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    border: 1px solid var(--border-color);
    min-height: 500px;
    position: relative;
}

.placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 500px;
    color: #666;
    
    .icon {
        font-size: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
    }
}

.office-viewer {
    width: 100%;
    height: 700px;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border-color);
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    
    &:hover {
        transform: translateY(-2px);
    }
    
    &.btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }
    
    &.btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid var(--border-color);
    }
    
    &.btn-small {
        padding: 6px 12px;
        font-size: 12px;
    }
}

.code-section {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 24px;
    border: 1px solid var(--border-color);
    margin-bottom: 24px;
    
    h3 {
        margin-bottom: 16px;
        color: var(--primary);
        display: flex;
        align-items: center;
        gap: 8px;
    }
}

.code-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    
    button {
        padding: 8px 16px;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        color: #aaa;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        
        &.active {
            background: var(--primary);
            color: white;
        }
        
        &:hover:not(.active) {
            background: rgba(255, 255, 255, 0.15);
        }
    }
}

.code-content {
    pre {
        margin: 0;
        padding: 16px;
        background: #1a1a2e;
        border-radius: 8px;
        overflow-x: auto;
        
        code {
            color: #4ecdc4;
            font-family: 'Consolas', monospace;
            font-size: 13px;
            line-height: 1.6;
        }
    }
}

.log-section {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 24px;
    border: 1px solid var(--border-color);
}

.log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h3 {
        margin: 0;
        color: var(--primary);
        display: flex;
        align-items: center;
        gap: 8px;
    }
}

.log-container {
    max-height: 200px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 12px;
}

.log-item {
    padding: 6px 0;
    font-size: 13px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    
    &:last-child {
        border-bottom: none;
    }
    
    &.info {
        color: #74c0fc;
    }
    
    &.success {
        color: #51cf66;
    }
    
    &.warning {
        color: #ffd43b;
    }
    
    &.error {
        color: #ff6b6b;
    }
}

.log-time {
    color: #888;
    margin-right: 8px;
}

.log-type {
    font-weight: 600;
    margin-right: 8px;
}

.log-empty {
    color: #666;
    text-align: center;
    padding: 20px;
}
</style>
