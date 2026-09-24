<template>
    <div class="page">
        <section class="panel">
            <header class="panel__head">
                <div>
                    <h2 class="panel__title">文件夹上传示例</h2>
                    <p class="panel__meta">示例接口：POST /api/files/upload-folder</p>
                </div>
                <el-tag type="success">保留目录结构</el-tag>
            </header>

            <div class="panel__body">
                <el-alert title="上传时会同时提交文件内容和 webkitRelativePath，后端可以按相对路径还原目录结构。" type="info"
                    :closable="false" show-icon />

                <div class="btn-row actions">
                    <input ref="folderInputRef" class="folder-input" type="file" webkitdirectory multiple
                        @change="handleFolderChange">
                    <el-button type="primary" @click="chooseFolder">选择文件夹</el-button>
                    <el-button type="success" :disabled="!selectedFiles.length || uploading" :loading="uploading"
                        @click="submitFolder">
                        上传文件夹
                    </el-button>
                    <el-button :disabled="uploading" @click="clearSelection">清空</el-button>
                </div>

                <div class="stat-grid" v-if="selectedFiles.length">
                    <div class="stat">
                        <span class="stat__label">文件夹名</span>
                        <span class="stat__value">{{ folderName }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">文件数量</span>
                        <span class="stat__value">{{ selectedFiles.length }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">总大小</span>
                        <span class="stat__value">{{ totalSizeText }}</span>
                    </div>
                </div>

                <el-progress v-if="uploading || uploadProgress > 0" :percentage="uploadProgress" :stroke-width="10" />

                <el-empty v-if="!selectedFiles.length" description="请选择一个本地文件夹" />

                <el-table v-else :data="selectedFiles" border stripe max-height="460" class="file-table">
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
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import type { AxiosProgressEvent } from 'axios'
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

        const res: any = await uploadFolder(formData, {
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
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
/* 版式来自 design-system.scss 的 .page / .panel / .stat-grid / .btn-row，这里只
   保留页面私有项。
   注意原来这里写的 padding: 24px 会叠在 .layout_content 已有的 16px 上变成 40px
   —— 这是全项目最普遍的「双 padding」来源，已移除。 */
.folder-input {
    display: none;
}

.actions {
    margin: 14px 0;
}

.file-table {
    margin-top: 14px;
}
</style>
