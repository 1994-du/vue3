<template>
    <div class="role_management_wrap">
        <h4 style="margin-bottom:0">角色管理</h4>
        <div style="margin: 10px 0;">
            <el-button type="primary" @click="getRoleList">查询</el-button>
        </div>
        <el-table style="width: 100%;" border :data="tableData">
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作">
                <template #default="{row}">
                    <el-button link @click="editRole(row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 10px;"
            v-model:current-page="currentPage4"
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
    <el-dialog
        v-model="dialogVisible"
        title="编辑角色"
        width="50%">
        <el-form :model="formData" label-width="auto">
            <el-form-item label="角色名称">
                <el-input v-model="formData.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
                <el-input v-model="formData.roleDesc"></el-input>
            </el-form-item>
            <el-form-item label="角色权限">
                <el-tree
                    ref="formTree"
                    :data="formData.menus"
                    show-checkbox
                    node-key="menuLink"
                    :props="defaultProps"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="closeDialog">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRoles, setRoles} from '../api/api'
const defaultProps = {
  children: 'children',
  label: 'menuName',
}

let tableData = ref([])
let currentPage4 = ref(1)
let pageSize4 = ref(10)
let total = ref(0)
let size = ref('small')
let disabled = ref(false)
let background = ref(false)
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
        tableData.value = res.data
        total.value = res.total
    }).catch(err=>{
        console.error('获取角色数据失败',err)
    })
}

let formTree = ref(null)
let dialogVisible = ref(false)
let formData = ref({
    roleName: '',
    roleDesc: '',
    menus: []
})
const closeDialog = () => {
    let checkNodes = formTree.value.getCheckedNodes()
    
    console.log('关闭弹窗', checkNodes)
    // dialogVisible.value = false
    setRoles({
        roleId: formData.value.roleId,
        roleName: formData.value.roleName,
        roleDesc: formData.value.roleDesc,
        menus: JSON.stringify(formData.value.menus),
        checked: JSON.stringify(checkNodes)
    }).then(res=>{
        console.log('设置角色成功', res)
        // dialogVisible.value = false
        // getRoleList()
    }).catch(err=>{
        console.error('设置角色失败', err)
    })
}
const editRole = (row) => {
    console.log('编辑角色', row)
    formData.value.roleId = row.roleId
    formData.value.roleName = row.roleName
    formData.value.roleDesc = row.roleDesc
    formData.value.menus = row.menus
    dialogVisible.value = true
}

onMounted(()=>{
    getRoleList()
})
</script>
<style scoped lang='less'>
.role_management_wrap{
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    .role_management{
        display: flex;
        flex: 1;
        overflow: hidden;
        .role_list{
            width: 50%;
        }
        .role_tree{
            flex: 1;
            border-left: 1px solid #ccc;
            overflow-y: auto;
            overflow-x: hidden;
        }
    }
}

</style>