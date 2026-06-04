<template>
    <div class="folder-upload-page">
        <el-card shadow="hover" class="page-card">
            <template #header>
                <div class="card-header">
                    <div>
                        <h2>文件夹上传示例</h2>
                        <p>示例接口：`POST /api/files/upload-folder`</p>
                    </div>
                    <el-tag type="success">保留目录结构</el-tag>
                </div>
            </template>

            <el-alert
                title="上传时会同时提交文件内容和 webkitRelativePath，后端可以按相对路径还原目录结构。"
                type="info"
                :closable="false"
                show-icon
                class="mb-4"
            />

            <div class="actions">
                <input
                    ref="folderInputRef"
                    class="folder-input"
                    type="file"
                    webkitdirectory
                    multiple
                    @change="handleFolderChange"
                >
                <el-button type="primary" @click="chooseFolder">选择文件夹</el-button>
                <el-button
                    type="success"
                    :disabled="!selectedFiles.length || uploading"
                    :loading="uploading"
                    @click="submitFolder"
                >
                    上传文件夹
                </el-button>
                <el-button :disabled="uploading" @click="clearSelection">清空</el-button>
            </div>

            <div class="summary" v-if="selectedFiles.length">
                <div class="summary-item">
                    <span class="label">文件夹名</span>
                    <span class="value">{{ folderName }}</span>
                </div>
                <div class="summary-item">
                    <span class="label">文件数量</span>
                    <span class="value">{{ selectedFiles.length }}</span>
                </div>
                <div class="summary-item">
                    <span class="label">总大小</span>
                    <span class="value">{{ totalSizeText }}</span>
                </div>
            </div>

            <el-progress
                v-if="uploading || uploadProgress > 0"
                :percentage="uploadProgress"
                :stroke-width="14"
                class="progress"
            />

            <el-empty v-if="!selectedFiles.length" description="请选择一个本地文件夹" />

            <el-table
                v-else
                :data="selectedFiles"
                border
                stripe
                max-height="460"
                class="file-table"
            >
                <el-table-column type="index" label="#" width="60" align="center" />
                <el-table-column prop="name" label="文件名" min-width="220" show-overflow-tooltip />
                <el-table-column prop="relativePath" label="相对路径" min-width="320" show-overflow-tooltip />
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
            </el-table>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFolder } from '@/api/upload'

// 定义文件夹文件项接口
interface FolderFileItem {
    uid: string
    name: string
    size: number
    type: string
    relativePath: string
    raw: File
}

// 定义上传响应接口
interface UploadResponse {
    code: number
    msg?: string
}

const folderInputRef = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<FolderFileItem[]>([])
const uploading = ref(false)
const uploadProgress = ref(0)

const folderName = computed((): string => {
    if (!selectedFiles.value.length) {
        return ''
    }

    const [firstPath = ''] = selectedFiles.value[0].relativePath.split('/')
    return firstPath || selectedFiles.value[0].name
})

const totalSizeText = computed((): string => {
    const totalSize = selectedFiles.value.reduce((sum, item) => sum + item.size, 0)
    return formatFileSize(totalSize)
})

const chooseFolder = (): void => {
    folderInputRef.value?.click()
}

const handleFolderChange = (event: Event): void => {
    const target = event.target as HTMLInputElement
    const fileList = Array.from(target.files || [])

    if (!fileList.length) {
        clearSelection()
        return
    }

    selectedFiles.value = fileList.map((file, index) => ({
        uid: `${file.name}-${index}-${file.size}`,
        name: file.name,
        size: file.size,
        type: file.type,
        relativePath: file.webkitRelativePath || file.name,
        raw: file
    }))

    uploadProgress.value = 0
}

const clearSelection = (): void => {
    selectedFiles.value = []
    uploadProgress.value = 0

    if (folderInputRef.value) {
        folderInputRef.value.value = ''
    }
}

const submitFolder = async (): Promise<void> => {
    if (!selectedFiles.value.length || uploading.value) {
        return
    }

    const formData = new FormData()
    formData.append('folderName', folderName.value)

    selectedFiles.value.forEach((item) => {
        formData.append('files', item.raw)
        formData.append('relativePaths', item.relativePath)
    })

    try {
        uploading.value = true
        uploadProgress.value = 0

        const res: UploadResponse = await uploadFolder(formData, {
            onUploadProgress: (progressEvent: ProgressEvent) => {
                const { loaded = 0, total = 0 } = progressEvent
                if (!total) {
                    return
                }
                uploadProgress.value = Math.min(
                    100,
                    Math.round((loaded / total) * 100)
                )
            }
        })

        if (res?.code === 200) {
            ElMessage.success('文件夹上传成功')
            clearSelection()
        } else {
            ElMessage.error(res?.msg || '文件夹上传失败')
        }
    } catch (error) {
        console.error('文件夹上传失败', error)
        ElMessage.error('文件夹上传失败，请稍后重试')
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
.folder-upload-page {
    padding: 24px;

    .page-card {
        border-radius: 16px;
    }

    .card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;

        h2 {
            margin: 0 0 8px;
            font-size: 22px;
            font-weight: 600;
            color: #1f2937;
        }

        p {
            margin: 0;
            color: #6b7280;
            font-size: 14px;
        }
    }

    .folder-input {
        display: none;
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 20px;
    }

    .summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
        margin-bottom: 20px;
    }

    .summary-item {
        padding: 14px 16px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        background: #f8fafc;
    }

    .label {
        display: block;
        margin-bottom: 6px;
        font-size: 13px;
        color: #6b7280;
    }

    .value {
        font-size: 15px;
        font-weight: 600;
        color: #111827;
        word-break: break-all;
    }

    .progress {
        margin-bottom: 20px;
    }

    .file-table {
        margin-top: 12px;
    }
}
</style>
