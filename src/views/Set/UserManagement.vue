<template>
    <div class="user-management-container">
        <!-- 操作栏 -->
        <div class="action-bar">
            <el-button type="primary" @click="createUser" class="create-btn">
                <el-icon><Plus /></el-icon>
                新建用户
            </el-button>
            <div class="search-container">
                <el-input
                    v-model="searchKeyword"
                    placeholder="搜索用户名"
                    clearable
                    prefix-icon="el-icon-search"
                    @keyup.enter="handleSearch"
                    class="search-input"
                >
                    <template #append>
                        <el-button @click="handleSearch" type="primary" :disabled="!searchKeyword">
                            搜索
                        </el-button>
                    </template>
                </el-input>
            </div>
        </div>
        
        <!-- 数据表格 -->
        <el-card class="user-table-card" shadow="hover">
            <el-table 
                v-loading="loading" 
                :data="tableData" 
                style="width: 100%"
                :row-class-name="tableRowClassName"
                @row-hover="handleRowHover"
                :fit="true"
            >
                <el-table-column label="ID" prop="id" width="80" align="center"></el-table-column>
                <el-table-column label="用户名" prop="username" width="150">
                    <template #default="{row}">
                        <div class="user-info">
                            <img :src="`${preUrl}${row.avatar}`" alt="" class="avatar-small">
                            <span class="username">{{ row.username }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="性别" prop="gender" width="80" align="center">
                    <template #default="{row}">
                        <span class="gender-tag" :class="row.gender === '1' ? 'male' : 'female'">
                            {{ row.gender === '1' ? '男' : row.gender === '2' ? '女' : '未知' }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="角色" prop="roleName" width="120">
                    <template #default="{row}">
                        <el-tag :type="row.roleId === 7608901 ? 'primary' : 'success'">
                            {{ row.roleName }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <el-button 
                            link 
                            type="primary" 
                            @click="editUser(row)"
                            class="action-btn edit-btn"
                        >
                            <el-icon><Edit /></el-icon>
                            编辑
                        </el-button>
                        <el-popconfirm 
                            title="确定删除此用户?"
                            @confirm="deleteUser(row.id)"
                            placement="top"
                        >
                            <template #reference>
                                <el-button 
                                    link 
                                    type="danger" 
                                    class="action-btn delete-btn"
                                >
                                    <el-icon><Delete /></el-icon>
                                    删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                        <el-popconfirm 
                            title="确定重置此用户的密码?"
                            @confirm="resetPassword(row.id)"
                            placement="top"
                        >
                            <template #reference>
                                <el-button 
                                    link 
                                    type="warning" 
                                    class="action-btn reset-btn"
                                >
                                    <el-icon><Refresh /></el-icon>
                                    密码重置
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            
            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize4"
                    :page-sizes="[10, 20, 30, 40]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    class="pagination"
                />
            </div>
        </el-card>
    </div>
    <!-- 编辑用户 -->
     <el-dialog 
        title="编辑用户"
        v-model="editUserVisible"
        width="30%">
        <div class="edit_user_form">
            <el-form>
                <el-form-item label="用户名">
                    <el-input v-model="editUserObj.username"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="editUserObj.gender">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload
                        :on-success="handleAvatarUploadSuccess"
                        :on-error="handleAvatarUploadError"
                        :show-file-list="false"
                        :before-upload="beforeAvatarUpload"
                        :http-request="customUpload"
                    >
                        <img class="edit_img" :src="`${preUrl}${editUserObj.avatar}`" alt="">
                    </el-upload>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="editUserObj.roleId" placeholder="请选择">
                        <el-option
                            v-for="item in roleList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog_footer">
                <el-button type="primary" @click="handleEditUser">确定</el-button>
                <el-button @click="editUserVisible = false">取消</el-button>
            </div>
        </template>
     </el-dialog>
     <!-- 新建用户 -->
    <el-dialog
        title="新建用户"
        v-model="createUserVisible"
        width="30%">
        <el-form>
            <el-form-item label="用户名">
                <el-input v-model="createUserObj.username"></el-input>
            </el-form-item>
            <el-form-item label="头像">
                <el-upload
                    :on-success="handleAvatarUploadSuccessCreate"
                    :on-error="handleAvatarUploadError"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    :http-request="customUpload"
                >
                    <img class="edit_img" :src="`${preUrl}${createUserObj.avatar}`" alt="">
                </el-upload>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio-group v-model="createUserObj.gender">
                    <el-radio label="1">男</el-radio>
                    <el-radio label="2">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="角色">
                <el-select v-model="createUserObj.roleId" placeholder="请选择">
                    <el-option
                        v-for="item in roleList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog_footer">
                <el-button type="primary" @click="handleCreateUser">确定</el-button>
                <el-button @click="createUserVisible = false">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { getUsers,getRolesDict,updateUser,addUser, delUser,updateAvatar,toResetPassword } from '@/api/api'
import { ElMessage } from 'element-plus'
import { Plus, Edit, Delete, Refresh } from '@element-plus/icons-vue'

// 响应式数据
let tableData = ref([])
let editUserVisible = ref(false)
let editUserObj = ref({})
let roleList = ref([])
let searchKeyword = ref('')
let loading = ref(false)
let hoverRow = ref(null)
const preUrl = `${import.meta.env.VITE_PROXY}`.replace(/\/$/, '')
const getUsersList = ()=>{
    loading.value = true
    getUsers({
        page: currentPage.value,
        pageSize: pageSize4.value,
        keyword: searchKeyword.value
    }).then(res=>{
        const { code, data, msg } = res
        if(code !== 200){
            ElMessage({
                message:msg,
                type:'error'
            })
        }
        if(code === 200){
            tableData.value = data.list
            total.value = data.total
        }
    }).finally(() => {
        loading.value = false
    })
}

// 表格行样式
const tableRowClassName = ({ row, rowIndex }) => {
    return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

// 行悬停处理
const handleRowHover = (row, column, event) => {
    hoverRow.value = row
}

const handleSearch = () => {
    currentPage.value = 1 // 搜索时重置为第一页
    getUsersList()
}
const getRoleDictList = ()=>{
    getRolesDict().then(res=>{
        const { code, data, msg } = res
        if(code===200){
            roleList.value = data
        }
    })
}
//新建
let createUserVisible = ref(false)
let createUserObj = ref({})
const createUser = ()=>{
    createUserObj.value = {}
    createUserVisible.value = true
}
const handleCreateUser = ()=>{
    addUser(createUserObj.value).then(res=>{
        if(res.code===200){
            createUserVisible.value = false
            getUsersList()
        }
    })
}
// 编辑
const editUser = (row)=>{
    editUserObj.value = Object.assign({},row)
    editUserVisible.value = true
}
/**
 * @description: 重置用户密码
 * @param {*} userId
 * @return {*}
 */
const resetPassword = (userId)=>{
    toResetPassword({
        id: userId
    }).then(res=>{
        if(res.code===200){
            ElMessage.success('密码重置成功');
            // 刷新用户列表
            getUsersList();
        } else {
            ElMessage.error('密码重置失败');
        }
    })
}


/**
 * 编辑用户
 */
const handleEditUser = ()=>{
    updateUser(editUserObj.value).then(res=>{
        if(res.code===200){
            editUserVisible.value = false
            getUsersList()
        }
    })
}
/**
 * @description: 删除用户
 * @param {*}
 * @return {*}
 */
const deleteUser = (userId)=>{
    delUser({
        id: userId
    }).then(res=>{
        if(res.code===200){
            getUsersList()
        }
    })
}
let currentPage = ref(1)
let pageSize4 = ref(10)
let total = ref(0)
let size = ref('small')
let disabled = ref(false)
let background = ref(false)
const handleSizeChange = (val) => {
    pageSize4.value = val
    getUsersList()
}
const handleCurrentChange = (val) => {
    currentPage.value = val
    getUsersList()
}
onMounted(()=>{
    getUsersList()
    getRoleDictList()
})

// 上传地址，根据实际情况修改
const uploadUrl = ref('/api/commonUpload')

// 上传前的钩子，可用于检查文件类型和大小等
const beforeAvatarUpload = (file) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPG) {
        ElMessage.error('上传头像图片只能是 JPG/PNG 格式!');
    }
    if (!isLt2M) {
        ElMessage.error('上传头像图片大小不能超过 2MB!');
    }
    return isJPG && isLt2M;
}

// 编辑上传成功回调
const handleAvatarUploadSuccess = (response, file, fileList) => {
    if (response.code === 200) {
        editUserObj.value.avatar = response.data.avatarUrl;
    }
}
// 新建上传成功回调
const handleAvatarUploadSuccessCreate = (response, file, fileList) => {
    if (response.code===200) {
        createUserObj.value.avatar = response.data.avatarUrl;
    }
}
// 上传失败回调
const handleAvatarUploadError = (err, file, fileList) => {
    ElMessage.error('头像上传失败，请稍后重试');
}

// 自定义上传方法
const customUpload = (param) => {
    const formData = new FormData();
    formData.append('file', param.file); // 将文件添加到 FormData 中
    updateAvatar(formData).then(response => {
        param.onSuccess(response); // 调用成功回调
    })
    .catch(error => {
        param.onError(error); // 调用失败回调
    });
}
</script>
<style scoped lang='scss'>
.user-management-container {
    padding: 24px;
    background: #f5f7fa;
    min-height: 100vh;
}

/* 操作栏 */
.action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
    .create-btn {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .search-container {
        .search-input {
            width: 300px;
            .el-input__wrapper {
                border-radius: 8px;
            }
        }
    }
}

/* 用户表格卡片 */
.user-table-card {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
    &:hover {
        box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
    }
    .el-card__body {
        padding: 0;
    }
}

/* 表格样式 */
:deep(.el-table) {
    border-radius: 12px 12px 0 0;
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

/* 用户信息 */
.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    .avatar-small {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #f0f0f0;
    }
    .username {
        font-size: 14px;
        color: #303133;
        font-weight: 500;
    }
}

/* 性别标签 */
.gender-tag {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    &.male {
        background-color: #e6f7ff;
        color: #1890ff;
    }
    &.female {
        background-color: #fff0f6;
        color: #f5222d;
    }
}

/* 操作按钮 */
.action-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin: 0 4px;
    &:hover {
        opacity: 0.8;
    }
}

/* 分页容器 */
.pagination-container {
    padding: 20px;
    background: #ffffff;
    border-top: 1px solid #ebeef5;
    display: flex;
    justify-content: flex-end;
    .pagination {
        .el-pagination__sizes {
            margin-right: 16px;
        }
    }
}

/* 编辑表单 */
.edit_user_form {
    :deep(.el-form-item) {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        .el-form-item__label {
            width: 80px;
            flex-shrink: 0;
        }
    }
}

/* 头像样式 */
.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

.edit_img {
    width: 80px;
    height: 80px;
    margin: 0 20px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #f0f0f0;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
}

/* 对话框样式 */
:deep(.el-dialog) {
    border-radius: 12px;
    overflow: hidden;
    .el-dialog__header {
        background: #f8f9fa;
        border-bottom: 1px solid #ebeef5;
        .el-dialog__title {
            font-size: 18px;
            font-weight: 600;
        }
    }
    .el-dialog__body {
        padding: 24px;
    }
    .el-dialog__footer {
        padding: 16px 24px;
        border-top: 1px solid #ebeef5;
        background: #f8f9fa;
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .user-management-container {
        padding: 16px;
    }
    .action-bar {
        flex-direction: column;
        align-items: stretch;
        .search-container {
            .search-input {
                width: 100%;
            }
        }
    }
    .user-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    .pagination-container {
        justify-content: center;
    }
}
</style>