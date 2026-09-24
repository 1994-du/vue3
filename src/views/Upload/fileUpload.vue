<template>
    <div class="page">
        <section class="panel">
            <header class="panel__head">
                <div>
                    <h2 class="panel__title">文件上传示例</h2>
                    <p class="panel__meta">示例接口：POST /api/file/upload</p>
                </div>
                <el-tag type="primary">多文件上传</el-tag>
            </header>

            <div class="panel__body">
                <el-alert title="当前示例限制 PDF、JPG、PNG，单个文件不超过 5MB。上传时会逐个调用接口并展示状态。" type="info"
                    :closable="false" show-icon />

                <div class="btn-row actions">
                    <input ref="fileInputRef" class="hidden-input" type="file" multiple accept=".pdf,.jpg,.jpeg,.png"
                        @change="handleFileChange">
                    <el-button type="primary" @click="chooseFiles">选择文件</el-button>
                    <el-button type="success" :disabled="!selectedFiles.length || uploading" :loading="uploading"
                        @click="submitFiles">
                        开始上传
                    </el-button>
                    <el-button :disabled="uploading" @click="clearSelection">清空</el-button>
                </div>

                <div class="stat-grid" v-if="selectedFiles.length">
                    <div class="stat">
                        <span class="stat__label">文件数量</span>
                        <span class="stat__value">{{ selectedFiles.length }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">总大小</span>
                        <span class="stat__value">{{ totalSizeText }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">成功数量</span>
                        <span class="stat__value">{{ successCount }}</span>
                    </div>
                </div>

                <el-progress v-if="uploading || uploadProgress > 0" :percentage="uploadProgress" :stroke-width="10" />

                <el-empty v-if="!selectedFiles.length" description="请选择要上传的文件" />

                <el-table v-else :data="selectedFiles" border stripe max-height="460" class="file-table">
                    <el-table-column type="index" label="#" width="60" align="center" />
                    <el-table-column prop="name" label="文件名" min-width="220" show-overflow-tooltip />
                    <el-table-column label="大小" width="120" align="right">
                        <template #default="{ row }">
                            {{ formatFileSize(row.size) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" width="180" show-overflow-tooltip>
                        <template #default="{ row }">
                            {{ row.type || 'unknown' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="进度" width="180" align="center">
                        <template #default="{ row }">
                            <el-progress :percentage="row.progress"
                                :status="row.status === 'error' ? 'exception' : undefined" :stroke-width="10" />
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="110" align="center">
                        <template #default="{ row }">
                            <el-tag :type="statusTagMap[row.status]">
                                {{ statusTextMap[row.status] }}
                            </el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile } from '@/api/upload'

// 定义文件项接口
interface FileItem {
    uid: string
    name: string
    size: number
    type: string
    raw: File
    progress: number
    status: 'ready' | 'uploading' | 'success' | 'error'
}

// 定义上传响应接口
interface UploadResponse {
    code: number
    msg?: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<FileItem[]>([])
const uploading = ref(false)
const uploadProgress = ref(0)

const statusTextMap: Record<string, string> = {
    ready: '待上传',
    uploading: '上传中',
    success: '成功',
    error: '失败'
}

const statusTagMap: Record<string, string> = {
    ready: 'info',
    uploading: 'warning',
    success: 'success',
    error: 'danger'
}

const totalSizeText = computed((): string => {
    const totalSize = selectedFiles.value.reduce((sum, item) => sum + item.size, 0)
    return formatFileSize(totalSize)
})

const successCount = computed((): number => {
    return selectedFiles.value.filter(item => item.status === 'success').length
})

const chooseFiles = (): void => {
    fileInputRef.value?.click()
}

const handleFileChange = (event: Event): void => {
    const target = event.target as HTMLInputElement
    const fileList = Array.from(target.files || [])

    if (!fileList.length) {
        clearSelection()
        return
    }

    const validFiles: FileItem[] = []

    fileList.forEach((file, index) => {
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            ElMessage.error(`${file.name} 类型不支持`)
            return
        }

        if (file.size > MAX_FILE_SIZE) {
            ElMessage.error(`${file.name} 超过 5MB 限制`)
            return
        }

        validFiles.push({
            uid: `${file.name}-${index}-${file.size}`,
            name: file.name,
            size: file.size,
            type: file.type,
            raw: file,
            progress: 0,
            status: 'ready'
        })
    })

    selectedFiles.value = validFiles
    uploadProgress.value = 0
}

const clearSelection = (): void => {
    selectedFiles.value = []
    uploadProgress.value = 0

    if (fileInputRef.value) {
        fileInputRef.value.value = ''
    }
}

const submitFiles = async (): Promise<void> => {
    if (!selectedFiles.value.length || uploading.value) {
        return
    }

    const totalSize = selectedFiles.value.reduce((sum, item) => sum + item.size, 0)
    let uploadedSize = 0
    let successTotal = 0

    try {
        uploading.value = true
        uploadProgress.value = 0

        for (const item of selectedFiles.value) {
            const formData = new FormData()
            formData.append('file', item.raw)

            item.status = 'uploading'
            item.progress = 0

            try {
                const res: any = await uploadFile(formData, {
                    onUploadProgress: (progressEvent: any) => {
                        const { loaded = 0, total = 0 } = progressEvent
                        if (!total) {
                            return
                        }

                        item.progress = Math.min(100, Math.round((loaded / total) * 100))
                        uploadProgress.value = Math.min(
                            100,
                            Math.round(((uploadedSize + loaded) / totalSize) * 100)
                        )
                    }
                })

                if (res?.code === 200) {
                    item.status = 'success'
                    item.progress = 100
                    successTotal += 1
                } else {
                    item.status = 'error'
                    ElMessage.error(res?.msg || `${item.name} 上传失败`)
                }
            } catch (error) {
                item.status = 'error'
            } finally {
                uploadedSize += item.size
                uploadProgress.value = Math.min(
                    100,
                    Math.round((uploadedSize / totalSize) * 100)
                )
            }
        }

        if (successTotal === selectedFiles.value.length) {
            ElMessage.success('文件上传成功')
        } else if (successTotal > 0) {
            ElMessage.warning(`部分文件上传成功：${successTotal}/${selectedFiles.value.length}`)
        } else {
            ElMessage.error('文件上传失败')
        }
    } finally {
        uploading.value = false
    }
}

const formatFileSize = (size: number = 0): string => {
    if (size < 1024) {
        return `${size} B`
    }

    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)} KB`
    }

    if (size < 1024 * 1024 * 1024) {
        return `${(size / 1024 / 1024).toFixed(2)} MB`
    }

    return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`
}
</script>

<style scoped lang="scss">
/* 版式来自 design-system.scss 的 .page / .panel / .stat-grid / .btn-row，这里只
   保留页面私有项。原先的 padding: 24px 会叠在 .layout_content 的 16px 上变成
   40px，已移除。 */
.hidden-input {
    display: none;
}

.actions {
    margin: 14px 0;
}

.file-table {
    margin-top: 14px;
}
</style>
