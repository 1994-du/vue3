<template>
    <div class="role-management-container">
        <!-- 操作栏 -->
        <div class="action-bar">
            <el-button type="primary" @click="createRole" class="create-btn">
                <el-icon><Plus /></el-icon>
                新建角色
            </el-button>
            <div class="search-container">
                <el-input
                    v-model="searchKeyword"
                    placeholder="搜索角色名称"
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
        <el-card class="role-table-card" shadow="hover">
            <el-table 
                v-loading="loading" 
                :data="tableData" 
                style="width: 100%"
                :row-class-name="tableRowClassName"
                :fit="true"
            >
                <el-table-column label="ID" prop="id" width="120" align="center"></el-table-column>
                <el-table-column label="角色名称" prop="name" width="150">
                    <template #default="{row}">
                        <div class="role-info">
                            <el-tag type="primary" size="small" class="role-tag">
                                {{ row.name }}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="{row}">
                        <el-button 
                            link 
                            type="primary" 
                            @click="editRole(row)"
                            class="action-btn edit-btn"
                        >
                            <el-icon><Edit /></el-icon>
                            编辑
                        </el-button>
                        <el-popconfirm 
                            title="确定删除此角色?"
                            @confirm="deleteRole(row.id)"
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
                    </template>
                </el-table-column>
            </el-table>
            
            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination
                    v-model:current-page="currentPage4"
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
import { getRoles,setRole,addRole, delRole } from '../../api/role'
import { addMenu, getMenuTree } from '../../api/menus'
import { ElMessage } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

// 响应式数据
let allMenus = ref([])
let dialogType = ref('add')
let dialogTitle = ref('新建角色')
let tableData = ref([])
let currentPage4 = ref(1)
let pageSize4 = ref(10)
let total = ref(0)
let searchKeyword = ref('')
let loading = ref(false)

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
    loading.value = true
    getRoles({
        page: currentPage4.value,
        size: pageSize4.value,
        keyword: searchKeyword.value
    }).then(res=>{
        tableData.value = res.data.list || []
        total.value = res.data.total || 0
    }).catch(err=>{
        console.error('获取角色数据失败',err)
    }).finally(() => {
        loading.value = false
    })
}

// 搜索方法
const handleSearch = () => {
    currentPage4.value = 1 // 搜索时重置为第一页
    getRoleList()
}

// 表格行样式
const tableRowClassName = ({ row, rowIndex }) => {
    return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

// 删除角色
const deleteRole = (roleId) => {
    delRole({
        id: roleId
    }).then(res=>{
        if(res.code===200){
            ElMessage.success('角色删除成功')
            getRoleList()
        }
    }).catch(err=>{
        console.error('删除角色失败', err)
        ElMessage.error('删除角色失败')
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
    ]
})

const normalizeMenuIds = (menus) => {
    if (Array.isArray(menus)) {
        return menus
    }

    if (typeof menus === 'string') {
        try {
            const parsedMenus = JSON.parse(menus)
            return Array.isArray(parsedMenus) ? parsedMenus : []
        } catch (error) {
            console.error('解析角色菜单数据失败', error)
        }
    }

    return []
}

const restoreCheckedMenus = (menus = []) => {
    if (!formTree.value) {
        return
    }

    const checkedMenuIds = normalizeMenuIds(menus)

    formTree.value.setCheckedKeys([])
    checkedMenuIds.forEach((menuId) => {
        formTree.value.setChecked(menuId, true, false)
    })
}

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
    formData.value = Object.assign({},row, {
        menus: normalizeMenuIds(row.menus)
    })
    console.log('formData',formData.value);
    nextTick(()=>{
        restoreCheckedMenus(formData.value.menus)
    })
}
const createRole = () => {
    dialogType.value = 'add'
    dialogTitle.value = '新建角色'
    dialogVisible.value = true
    formData.value = {
        roleName: '',
        roleDesc: '',
        menus: []
    }
    nextTick(()=>{
        restoreCheckedMenus([])
    })
}
onMounted(()=>{
    getRoleList()
})
</script>
<style scoped lang='scss'>
.role-management-container {
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

/* 角色表格卡片 */
.role-table-card {
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

/* 角色信息 */
.role-info {
    .role-tag {
        font-size: 14px;
        font-weight: 500;
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
    .role-management-container {
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
    .pagination-container {
        justify-content: center;
    }
}
</style>
