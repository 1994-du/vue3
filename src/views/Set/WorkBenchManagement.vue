<template>
    <div class="workbench-management-container">
        <div v-if="isAdmin" class="action-bar">
            <el-button type="primary" @click="openCreateDialog" class="create-btn">
                <el-icon><Plus /></el-icon>
                新建工作台
            </el-button>
        </div>

        <el-card class="workbench-table-card" shadow="hover">
            <el-table
                v-loading="loading"
                :data="tableData"
                style="width: 100%"
                :row-class-name="tableRowClassName"
                :fit="true">
                <el-table-column label="ID" prop="id" width="100" align="center" />
                <el-table-column label="名称" prop="name" min-width="150" />
                <el-table-column label="图标" prop="icon" min-width="160">
                    <template #default="{ row }">
                        <el-image
                            v-if="row.icon"
                            :src="getIconUrl(row.icon)"
                            :preview-src-list="[getIconUrl(row.icon)]"
                            fit="cover"
                            preview-teleported
                            class="table-icon">
                            <template #error>
                                <div class="image-error">加载失败</div>
                            </template>
                        </el-image>
                        <span v-else class="text-muted">未设置</span>
                    </template>
                </el-table-column>
                <el-table-column label="链接" prop="link" min-width="220">
                    <template #default="{ row }">
                        <span class="link-text">{{ row.link }}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="isAdmin" label="所属用户" min-width="240">
                    <template #default="{ row }">
                        <div v-if="row.users?.length" class="user-tags">
                            <el-tag
                                v-for="user in row.users"
                                :key="user.id"
                                size="small"
                                type="success"
                                effect="plain">
                                {{ user.username }}
                            </el-tag>
                        </div>
                        <span v-else class="text-muted">未分配</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="170" align="center" fixed="right">
                    <template #default="{ row }">
                        <template v-if="isAdmin">
                            <el-button link type="primary" @click="openEditDialog(row)" class="action-btn">
                                <el-icon><Edit /></el-icon>
                                编辑
                            </el-button>
                            <el-popconfirm title="确定删除此工作台?" @confirm="handleDeleteWorkbench(row.id)" placement="top">
                                <template #reference>
                                    <el-button link type="danger" class="action-btn">
                                        <el-icon><Delete /></el-icon>
                                        删除
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                        <el-button v-else link type="primary" @click="viewWorkbench(row)" class="action-btn">
                            <el-icon><View /></el-icon>
                            查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>

    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="520px"
        :close-on-click-modal="false"
        @closed="resetForm">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="90px">
            <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入工作台名称" />
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-upload
                    class="icon-uploader"
                    accept="image/*"
                    :show-file-list="false"
                    :http-request="uploadIcon"
                    :before-upload="beforeIconUpload">
                    <img v-if="formData.icon" :src="getIconUrl(formData.icon)" class="icon-preview" alt="">
                    <div v-else class="icon-placeholder">
                        <el-icon><Plus /></el-icon>
                    </div>
                </el-upload>
            </el-form-item>
            <el-form-item label="链接" prop="link">
                <el-input v-model="formData.link" placeholder="例如 /micro/approval" />
            </el-form-item>
            <el-form-item label="所属用户" prop="userIds">
                <el-select
                    v-model="formData.userIds"
                    multiple
                    filterable
                    clearable
                    placeholder="请选择所属用户"
                    class="user-select"
                    :loading="usersLoading">
                    <el-option
                        v-for="user in userOptions"
                        :key="user.id"
                        :label="user.username"
                        :value="user.id" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { UploadRequestOptions } from 'element-plus'
import { Delete, Edit, Plus, View } from '@element-plus/icons-vue'
import { getCurrentUser, getUsers } from '@/api/api'
import { uploadImage } from '@/api/upload'
import {
    createWorkbench,
    deleteWorkbench,
    getCurrentWorkbenches,
    getWorkbenches,
    updateWorkbench,
    type WorkbenchPayload
} from '@/api/workbenches'

interface WorkbenchUser {
    id: number | string
    username: string
}

interface WorkbenchItem {
    id: number | string
    name: string
    icon: string
    link: string
    users?: WorkbenchUser[]
}

interface WorkbenchForm {
    id?: number | string
    name: string
    icon: string
    link: string
    userIds: Array<number | string>
}

const tableData = ref<WorkbenchItem[]>([])
const userOptions = ref<WorkbenchUser[]>([])
const loading = ref(false)
const usersLoading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit'>('create')
const formRef = ref<FormInstance>()
const preUrl = `${import.meta.env.VITE_PROXY}`.replace(/\/$/, '')
const isAdmin = ref(false)

const createDefaultForm = (): WorkbenchForm => ({
    name: '',
    icon: '',
    link: '',
    userIds: []
})

const formData = ref<WorkbenchForm>(createDefaultForm())
const dialogTitle = computed(() => dialogType.value === 'create' ? '新建工作台' : '编辑工作台')

const rules: FormRules<WorkbenchForm> = {
    name: [{ required: true, message: '请输入工作台名称', trigger: 'blur' }],
    icon: [{ required: true, message: '请输入图标', trigger: 'blur' }],
    link: [{ required: true, message: '请输入链接', trigger: 'blur' }]
}

const tableRowClassName = ({ rowIndex }: { rowIndex: number }): string => {
    return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

const getIconUrl = (icon: string): string => {
    if (!icon) {
        return ''
    }

    if (/^(https?:)?\/\//.test(icon) || icon.startsWith('data:') || icon.startsWith('blob:')) {
        return icon
    }

    return `${preUrl}${icon.startsWith('/') ? icon : `/${icon}`}`
}

const getUploadUrl = (res: any): string => {
    const data = res?.data
    if (typeof data === 'string') {
        return data
    }

    return data?.url
        || data?.fileUrl
        || data?.imageUrl
        || data?.avatarUrl
        || data?.path
        || data?.src
        || ''
}

const beforeIconUpload = (file: File): boolean => {
    const isImage = file.type.startsWith('image/')
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isImage) {
        ElMessage.error('只能上传图片格式')
    }

    if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB')
    }

    return isImage && isLt2M
}

const uploadIcon = (options: UploadRequestOptions): void => {
    const formDataParam = new FormData()
    formDataParam.append('file', options.file)

    uploadImage(formDataParam).then((res: any) => {
        if (res.code === 200) {
            const iconUrl = getUploadUrl(res)
            if (!iconUrl) {
                ElMessage.error('上传成功但未返回图片地址')
                options.onError(new Error('未返回图片地址'))
                return
            }

            formData.value.icon = iconUrl
            formRef.value?.validateField('icon')
            options.onSuccess(res)
            ElMessage.success('图标上传成功')
            return
        }

        options.onError(new Error(res?.msg || '图标上传失败'))
    }).catch((err: Error) => {
        options.onError(err)
        ElMessage.error('图标上传失败')
    })
}

const getWorkbenchList = (): void => {
    loading.value = true
    const request = isAdmin.value ? getWorkbenches() : getCurrentWorkbenches()

    request.then((res: any) => {
        if (res.code === 200) {
            tableData.value = Array.isArray(res.data) ? res.data : []
        }
    }).finally(() => {
        loading.value = false
    })
}

const getUserOptions = (): void => {
    if (!isAdmin.value) {
        userOptions.value = []
        return
    }

    usersLoading.value = true
    getUsers({
        page: 1,
        pageSize: 1000,
        keyword: ''
    }).then((res: any) => {
        if (res.code === 200) {
            const data = res.data?.list || res.data || []
            userOptions.value = Array.isArray(data) ? data.map((item: any) => ({
                id: item.id,
                username: item.username
            })) : []
        }
    }).finally(() => {
        usersLoading.value = false
    })
}

const resetForm = (): void => {
    formData.value = createDefaultForm()
    formRef.value?.clearValidate()
}

const openCreateDialog = (): void => {
    if (!isAdmin.value) {
        return
    }

    dialogType.value = 'create'
    formData.value = createDefaultForm()
    dialogVisible.value = true
}

const openEditDialog = (row: WorkbenchItem): void => {
    if (!isAdmin.value) {
        return
    }

    dialogType.value = 'edit'
    formData.value = {
        id: row.id,
        name: row.name,
        icon: row.icon,
        link: row.link,
        userIds: row.users?.map(user => user.id) || []
    }
    dialogVisible.value = true
}

const buildPayload = (): WorkbenchPayload => ({
    name: formData.value.name,
    icon: formData.value.icon,
    link: formData.value.link,
    userIds: formData.value.userIds
})

const handleSubmit = (): void => {
    if (!isAdmin.value) {
        return
    }

    formRef.value?.validate((valid: boolean) => {
        if (!valid) {
            ElMessage.error('请填写完整信息')
            return
        }

        submitLoading.value = true
        const request = dialogType.value === 'create'
            ? createWorkbench(buildPayload())
            : updateWorkbench(formData.value.id as number | string, buildPayload())

        request.then((res: any) => {
            if (res.code === 200) {
                dialogVisible.value = false
                getWorkbenchList()
            }
        }).finally(() => {
            submitLoading.value = false
        })
    })
}

const handleDeleteWorkbench = (id: number | string): void => {
    if (!isAdmin.value) {
        return
    }

    deleteWorkbench(id).then((res: any) => {
        if (res.code === 200) {
            getWorkbenchList()
        }
    })
}

const viewWorkbench = (row: WorkbenchItem): void => {
    if (!row.link) {
        ElMessage.warning('该工作台未配置链接')
        return
    }

    window.open(row.link, '_blank')
}

const getIsAdmin = (res: any): boolean => {
    const userInfo = res?.data || res
    return userInfo?.isAdmin === true
}

onMounted(async () => {
    try {
        const res: any = await getCurrentUser()
        if (res.code === 200) {
            isAdmin.value = getIsAdmin(res)
        }
    } finally {
        getWorkbenchList()
        getUserOptions()
    }
})
</script>

<style scoped lang="scss">
.workbench-management-container {
    padding: 24px;
    background: #f5f7fa;
    min-height: 100vh;
}

.action-bar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 20px;

    .create-btn {
        display: flex;
        align-items: center;
        gap: 6px;
    }
}

.workbench-table-card {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;

    &:hover {
        box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
    }

    :deep(.el-card__body) {
        padding: 0;
    }
}

:deep(.el-table) {
    border-radius: 12px;
    overflow: hidden;

    .el-table__header-wrapper {
        background: #f8f9fa;

        .el-table__header {
            th {
                background: #f8f9fa;
                border-bottom: 1px solid #ebeef5;
                font-weight: 600;
                color: #303133;
            }
        }
    }

    .el-table__body-wrapper {
        .el-table__row {
            transition: background-color 0.2s ease;

            &:hover {
                background-color: #f5f7fa !important;
            }
        }

        .even-row {
            background-color: #ffffff;
        }

        .odd-row {
            background-color: #fafafa;
        }
    }
}

.user-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.link-text {
    color: #409eff;
    word-break: break-all;
}

.text-muted {
    color: #909399;
    font-size: 14px;
}

.table-icon {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid #ebeef5;
    background: #f5f7fa;
}

.image-error {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: #909399;
    font-size: 12px;
    background: #f5f7fa;
}

.action-btn {
    margin: 0 4px;

    .el-icon {
        margin-right: 4px;
    }
}

.user-select {
    width: 100%;
}

.icon-uploader {
    :deep(.el-upload) {
        width: 88px;
        height: 88px;
        border: 1px dashed #c0c4cc;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        transition: border-color 0.2s ease;

        &:hover {
            border-color: #409eff;
        }
    }
}

.icon-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88px;
    height: 88px;
    color: #8c939d;
    font-size: 28px;
    background: #fafafa;
}

.icon-preview {
    display: block;
    width: 88px;
    height: 88px;
    object-fit: cover;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}
</style>
