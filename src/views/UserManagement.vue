<template>
    <div class="user_management">
        <header>
            <el-button type="primary" @click="createUser">新建用户</el-button>
        </header>
        <el-table style="width: 100%;" :data="tableData" border>
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="头像" prop="avatar">
                <template #default="{row}">
                    <img :src="row.avatar" alt="" class="avatar"></img>
                </template>
            </el-table-column>
            <el-table-column label="角色" prop="roleName"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button link type="primary" @click="editUser(row)">编辑</el-button>
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
                <el-form-item label="头像">
                    <img class="edit_img" :src="editUserObj.avatar" alt="">
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="editUserObj.roleId" placeholder="请选择" @change="changeRole">
                        <el-option
                            v-for="item in roleList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
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
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { getUsers,getRolesDict,updateUser } from '@/api/api'
let tableData = ref([])
let editUserVisible = ref(false)
let editUserObj = ref({})
let roleList = ref([])
const getUsersList = ()=>{
    getUsers({
        page: currentPage.value,
        pageSize: pageSize4.value
    }).then(res=>{
        console.log('getUsersList',res);
        
        if(res.status === 200){
            tableData.value = res.data
            total.value = res.total
        }
    })
}
const getRoleDictList = ()=>{
    getRolesDict().then(res=>{
        console.log('getRoleDictList',res);
        if(res.status === 200){
            roleList.value = res.data
        }
    })
}
const createUser = ()=>{
    console.log('createUser');
}
const editUser = (row)=>{
    console.log('editUser',row);
    editUserObj.value = Object.assign({},row)
    editUserVisible.value = true
}
const changeRole = (val)=>{
    console.log('changeRole',val);
    let res = roleList.value.filter(item=>item.value === val)[0]
    editUserObj.value.roleName = res.label
    
}
/**
 * 编辑用户
 */
const handleEditUser = ()=>{
    updateUser(editUserObj.value).then(res=>{
        if(res.status === 200){
            editUserVisible.value = false
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
</script>
<style scoped lang='scss'>
@use '@/styles/userManagement.scss';
</style>