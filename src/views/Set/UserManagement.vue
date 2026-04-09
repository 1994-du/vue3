<template>
    <div class="flex flex-col items-start">
        <el-button type="primary" @click="createUser">新建用户</el-button>
        <el-table class="my-[10px]" :data="tableData" border>
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="头像" prop="avatar">
                <template #default="{row}">
                    <img :src="`${preUrl}${row.avatar}`" alt="" class="avatar"></img>
                </template>
            </el-table-column>
            <el-table-column label="角色" prop="roleName"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button link type="primary" @click="editUser(row)">编辑</el-button>
                    <el-popconfirm 
                        title="确定删除此用户?"
                        @confirm="deleteUser(row.id)">
                        <template #reference>
                            <el-button link type="primary">删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-popconfirm 
                        title="确定重置此用户的密码?"
                        @confirm="resetPassword(row.id)">
                        <template #reference>
                            <el-button link type="primary">密码重置</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 10px;"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize4"
            :page-sizes="[10, 20, 30, 40]"
            :size="size"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            />
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
let tableData = ref([])
let editUserVisible = ref(false)
let editUserObj = ref({})
let roleList = ref([])
const preUrl = `${import.meta.env.VITE_PROXY}`.replace(/\/$/, '')
const getUsersList = ()=>{
    getUsers({
        page: currentPage.value,
        pageSize: pageSize4.value
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
    })
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
@use '@/styles/userManagement.scss';
</style>