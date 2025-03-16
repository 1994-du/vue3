<template>
    <div class="user_management">
        <h4>用户管理</h4>
        <header>
            <el-button @click="createRole">新建角色</el-button>
        </header>
        <el-table :data="tableData">
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="头像" prop="avatar">
                <template #default="{row}">
                    <img :src="row.avatar" alt="" class="avatar"></img>
                </template>
            </el-table-column>
            <el-table-column label="角色" prop="roleName"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button link @click="editUser(row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- 编辑用户 -->
     <el-dialog 
        title="编辑用户"
        :visible="editUserVisible"
        width="30%">
        <div>
            <el-form>
                <el-form-item label="用户名">
                    <el-input v-model="username"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <el-input v-model="avatar"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="roleName" placeholder="请选择">
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
     </el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

let tableData = ref([])
let editUserVisible = ref(false)
let roleList = ref([])
const getUsers = ()=>{
    axios.get('/api/getUsers').then(res=>{
        console.log('users---',res);
        if(res.status === 200){
            tableData.value = res.data.data
        }
    })
}
const createRole = ()=>{
    console.log('createRole');
}
const editUser = (row)=>{
    console.log('editUser',row);
    editUserVisible.value = true
}
onMounted(()=>{
    getUsers()
    console.log('UserManagement.vue');
})
</script>
<style scoped lang='less'>
.user_management{
    padding: 20px;
}
.avatar{
    width: 50px;
    height: 50px;
}
</style>