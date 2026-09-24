<template>
    <div class="page">
        <section class="panel">
            <header class="panel__head">
                <div>
                    <h2 class="panel__title">图片上传示例</h2>
                    <p class="panel__meta">示例接口：POST /api/files/upload-image</p>
                </div>
                <el-tag type="warning">图片预览 + 主色提取</el-tag>
            </header>

            <div class="panel__body">
                <el-alert title="当前示例限制 JPG、PNG、WEBP，单张图片不超过 10MB。上传前会展示预览、尺寸和主色。" type="info"
                    :closable="false" show-icon />

                <div class="btn-row actions">
                    <input ref="imageInputRef" class="hidden-input" type="file" accept="image/jpeg,image/png,image/webp"
                        @change="handleImageChange">
                    <el-button type="primary" @click="chooseImage">选择图片</el-button>
                    <el-button type="success" :disabled="!selectedImage || uploading" :loading="uploading"
                        @click="submitImage">
                        上传图片
                    </el-button>
                    <el-button :disabled="uploading" @click="clearImage">清空</el-button>
                </div>

                <div class="stat-grid" v-if="selectedImage">
                    <div class="stat">
                        <span class="stat__label">文件名</span>
                        <span class="stat__value">{{ selectedImage.name }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">文件大小</span>
                        <span class="stat__value">{{ formatFileSize(selectedImage.size) }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">图片尺寸</span>
                        <span class="stat__value">{{ imageSizeText }}</span>
                    </div>
                </div>

                <el-progress v-if="uploading || uploadProgress > 0" :percentage="uploadProgress" :stroke-width="10" />

                <el-empty v-if="!selectedImage" description="请选择一张图片" />

                <div v-else class="preview-grid">
                    <div class="panel preview-card">
                        <div class="section-title">图片预览</div>
                        <div class="image-preview-box">
                            <img :src="previewUrl" :alt="selectedImage.name">
                        </div>
                    </div>

                    <div class="panel preview-card">
                        <div class="section-title">分析结果</div>
                        <div class="color-preview" :style="{ background: dominantColor }"></div>
                        <div class="meta-list">
                            <div class="meta-item">
                                <span class="meta-label">主色值</span>
                                <span class="meta-value">{{ dominantColor }}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">文件类型</span>
                                <span class="meta-value">{{ selectedImage.type || 'unknown' }}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">上传状态</span>
                                <el-tag :type="statusTagMap[uploadStatus]">
                                    {{ statusTextMap[uploadStatus] }}
                                </el-tag>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import type { AxiosProgressEvent } from 'axios'
import { computed, onBeforeUnmount, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadImage } from '@/api/upload'

const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const imageInputRef = ref<HTMLInputElement | null>(null)
const selectedImage = ref<File | null>(null)
const previewUrl = ref('')
const dominantColor = ref('rgb(148, 163, 184)')
const imageWidth = ref(0)
const imageHeight = ref(0)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadStatus = ref<'ready' | 'uploading' | 'success' | 'error'>('ready')

const statusTextMap = {
    ready: '待上传',
    uploading: '上传中',
    success: '成功',
    error: '失败'
}

const statusTagMap = {
    ready: 'info',
    uploading: 'warning',
    success: 'success',
    error: 'danger'
}

const imageSizeText = computed(() => {
    if (!imageWidth.value || !imageHeight.value) {
        return '--'
    }

    return `${imageWidth.value} x ${imageHeight.value}`
})

const chooseImage = () => {
    imageInputRef.value?.click()
}

const handleImageChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const [file] = Array.from(target.files || [])

    if (!file) {
        clearImage()
        return
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        ElMessage.error('仅支持 JPG、PNG、WEBP 图片')
        clearImage()
        return
    }

    if (file.size > MAX_IMAGE_SIZE) {
        ElMessage.error('图片大小不能超过 10MB')
        clearImage()
        return
    }

    revokePreview()

    selectedImage.value = file
    previewUrl.value = URL.createObjectURL(file)
    uploadProgress.value = 0
    uploadStatus.value = 'ready'

    await resolveImageMeta(previewUrl.value)
}

const resolveImageMeta = (src: string) => {
    return new Promise<void>((resolve, reject) => {
        const image = new Image()
        image.src = src

        image.onload = () => {
            imageWidth.value = image.width
            imageHeight.value = image.height
            dominantColor.value = extractDominantColor(image)
            resolve()
        }

        image.onerror = () => {
            reject(new Error('图片解析失败'))
        }
    }).catch((error) => {
        ElMessage.error('图片解析失败')
    })
}

const extractDominantColor = (image: HTMLImageElement) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return 'rgb(148, 163, 184)'
    }

    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0)

    const { data } = ctx.getImageData(0, 0, image.width, image.height)
    let red = 0
    let green = 0
    let blue = 0
    let sampleCount = 0

    for (let index = 0; index < data.length; index += 40) {
        red += data[index]
        green += data[index + 1]
        blue += data[index + 2]
        sampleCount += 1
    }

    if (!sampleCount) {
        return 'rgb(148, 163, 184)'
    }

    return `rgb(${Math.round(red / sampleCount)}, ${Math.round(green / sampleCount)}, ${Math.round(blue / sampleCount)})`
}

const submitImage = async () => {
    if (!selectedImage.value || uploading.value) {
        return
    }

    const formData = new FormData()
    formData.append('file', selectedImage.value)

    try {
        uploading.value = true
        uploadStatus.value = 'uploading'
        uploadProgress.value = 0

        const res: any = await uploadImage(formData, {
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                const { loaded = 0, total = 0 } = progressEvent
                if (!total) {
                    return
                }
                uploadProgress.value = Math.min(100, Math.round((loaded / total) * 100))
            }
        })

        if (res?.code === 200) {
            uploadStatus.value = 'success'
            uploadProgress.value = 100
            ElMessage.success('图片上传成功')
        } else {
            uploadStatus.value = 'error'
            ElMessage.error(res?.msg || '图片上传失败')
        }
    } catch (error) {
        uploadStatus.value = 'error'
        ElMessage.error('图片上传失败，请稍后重试')
    } finally {
        uploading.value = false
    }
}

const revokePreview = () => {
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
    }
}

const clearImage = () => {
    revokePreview()
    previewUrl.value = ''
    selectedImage.value = null
    dominantColor.value = 'rgb(148, 163, 184)'
    imageWidth.value = 0
    imageHeight.value = 0
    uploadProgress.value = 0
    uploadStatus.value = 'ready'

    if (imageInputRef.value) {
        imageInputRef.value.value = ''
    }
}

const formatFileSize = (size = 0) => {
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

onBeforeUnmount(() => {
    revokePreview()
})
</script>

<style scoped lang="scss">
/* 版式主体来自 design-system.scss 的 .page / .panel / .stat-grid / .btn-row，这里
   只保留页面私有部分。原先的 padding: 24px 会叠在 .layout_content 的 16px 上变成
   40px，已移除。 */
.hidden-input {
    display: none;
}

.actions {
    margin: 14px 0;
}

.preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    margin-top: 14px;
}

.preview-card {
    padding: 14px;
}

.section-title {
    margin-bottom: 12px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--text-primary);
}

/* 图片待填槽位：暗色主题下用最淡的中性面，不再用蓝白渐变。 */
.image-preview-box {
    min-height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--surface-muted);

    img {
        max-width: 100%;
        max-height: 360px;
        object-fit: contain;
    }
}

.color-preview {
    height: 120px;
    margin-bottom: 16px;
    border: 1px solid var(--hairline);
}

.meta-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.meta-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--hairline);
}

.meta-item:last-child {
    padding-bottom: 0;
    border-bottom: none;
}

.meta-label {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-tertiary);
}

.meta-value {
    font-size: 12px;
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
    word-break: break-all;
}
</style>
