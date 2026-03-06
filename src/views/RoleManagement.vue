<template>
    <div class="role_management_wrap">
        <header>
            <el-button type="primary" @click="createRole">新建角色</el-button>
        </header>
        <el-table class="my-[10px]" border :data="tableData">
            <el-table-column label="角色名称" prop="name"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作">
                <template #default="{row}">
                    <el-button link type="primary" @click="editRole(row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-model:current-page="currentPage4"
            v-model:page-size="pageSize4"
            :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            />
    </div>
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="50%">
        <el-form ref="formRef"  :model="formData" :rules="rules" label-width="auto">
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="formData.roleDesc"></el-input>
            </el-form-item>
            <el-form-item label="角色权限" prop="menus">
                <el-tree
                    ref="formTree"
                    :data="allMenus"
                    node-key="id"
                    show-checkbox
                    :default-expand-all="true"
                    :props="defaultProps"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="handleRole">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { getRoles,setRole,addRole } from '../api/role'
import { addMenu, getMenuTree } from '../api/menus'
let allMenus = ref([])
onMounted(()=>{
    getMenuTree().then(res=>{
        if(res.code===200){
            allMenus.value = res.data
        }
    })
})
const defaultProps = {
  children: 'children',
  label: 'name',
}
let dialogType = ref('add')
let dialogTitle = ref('新建角色')
let tableData = ref([])
let currentPage4 = ref(1)
let pageSize4 = ref(10)
let total = ref(0)
// const handleCheckChange = (checkedKeys, checkedNodes) => {
//     console.log('checkedKeys', checkedKeys)
//     console.log('checkedNodes', checkedNodes)
// }
const handleSizeChange = (val) => {
    pageSize4.value = val
    getRoleList()
}
const handleCurrentChange = (val) => {
    currentPage4.value = val
    getRoleList()
}

const getRoleList = () => {
    getRoles({
        page: currentPage4.value,
        pageSize: pageSize4.value
    }).then(res=>{
        tableData.value = res.data.list || []
        total.value = res.data.total || 0
    }).catch(err=>{
        console.error('获取角色数据失败',err)
    })
}
let formRef = ref(null)
let formTree = ref(null)
let dialogVisible = ref(false)
let formData = ref({
    roleName: '',
    roleDesc: '',
    menus: []
})
const rules = ref({
    name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' }
    ],
    roleDesc: [
        { required: true, message: '请输入角色描述', trigger: 'blur' }
    ]
})
const handleRole = () => {
    let checkKeys = formTree.value.getCheckedKeys()
    let checkHalfKeys = formTree.value.getHalfCheckedKeys()
    console.log('关闭弹窗', checkKeys, checkHalfKeys)
    formRef.value.validate((valid)=>{
        if(valid){
            if(dialogType.value === 'add'){
                // 新增角色
                addRole({
                    ...formData.value,
                    menus: checkKeys
                }).then(res=>{
                    console.log('新增角色成功', res)
                    if(res.code===200){
                        dialogVisible.value = false
                        getRoleList()
                    }
                }).catch(err=>{
                    console.error('新增角色失败', err)
                })
            }else{
                // 编辑角色
                setRole({
                    ...formData.value,
                    menus: checkKeys
                }).then(res=>{
                    console.log('设置角色成功', res)
                    if(res.code===200){
                        dialogVisible.value = false
                        getRoleList()
                    }
                }).catch(err=>{
                    console.error('设置角色失败', err)
                })
            }
        }
    })
}
const editRole = (row) => {
    dialogVisible.value = true
    dialogType.value = 'edit'
    dialogTitle.value = '编辑角色'
    console.log('编辑角色', row)
    formData.value = Object.assign({},row)
    console.log('formData',formData.value);
    nextTick(()=>{
        formTree.value.setCheckedKeys(formData.value.menus)
    })
}
const createRole = () => {
    dialogType.value = 'add'
    dialogTitle.value = '新建角色'
    dialogVisible.value = true
    formData.value = {}
}
onMounted(()=>{
    getRoleList()
})
</script>
<style scoped lang='scss'>
@use '@/styles/roleManagement.scss';
</style>