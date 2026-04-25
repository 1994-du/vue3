<template>
    <div class="menu-management-container">
        <div class="page-header">
            <h2>菜单管理</h2>
            <div class="header-actions">
                <el-button type="primary" @click="handleAddMenu(null)" class="add-btn">
                    <el-icon><Plus /></el-icon>新建菜单
                </el-button>
            </div>
        </div>
        
        <div class="table-card">
            <el-table 
                class="menu-table"
                border 
                row-key="id" 
                :data="menusList" 
                style="width: 100%"
                v-loading="loading">
                <el-table-column prop="name" label="菜单名称" min-width="180">
                    <!-- <template #default="{ row }">
                        <div class="menu-name">
                            <component v-if="row.icon" :is="`el-icon-${row.icon}`" class="menu-icon"></component>
                            <span>{{ row.name }}</span>
                        </div>
                    </template> -->
                </el-table-column>
                <el-table-column prop="path" label="菜单路径" min-width="200" />
                <el-table-column prop="component" label="组件" min-width="200" />
                <el-table-column prop="sort" label="序号" width="80" />

                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="scope">
                        <div class="table-actions">
                            <el-button link type="primary" @click="handleAddMenu(scope.row)" class="action-btn">新增</el-button>
                            <el-button link type="primary" @click="handleEditMenu(scope.row)" class="action-btn">编辑</el-button>
                            <el-button link type="danger" @click="handleDeleteMenu(scope.row)" class="action-btn">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            
            <div class="pagination-container">
                <el-pagination
                    v-model:current-page="currentPage4"
                    v-model:page-size="pageSize4"
                    :page-sizes="[20, 30, 40]"
                    layout="total, sizes, prev, pager, next"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    class="menu-pagination"
                />
            </div>
        </div>
    </div>
    
    <el-dialog 
        :title="dialogTitle" 
        v-model="createMenuVisible" 
        width="450" 
        :close-on-click-modal="false"
        class="menu-dialog">
        <el-form 
            :model="createMenuObj" 
            :rules="createMenuRules" 
            ref="createMenuFormRef" 
            label-width="90px"
            class="menu-form">
            <el-form-item label="菜单名称" prop="name">
                <el-input v-model="createMenuObj.name" placeholder="请输入菜单名称" class="custom-input" />
            </el-form-item>
            <el-form-item label="菜单路径" prop="path">
                <el-input v-model="createMenuObj.path" placeholder="请输入菜单路径" class="custom-input" />
            </el-form-item>
            <el-form-item label="组件" prop="component">
                <el-input v-model="createMenuObj.component" placeholder="请输入组件" class="custom-input" />
            </el-form-item>
            <el-form-item label="序号" prop="sort">
                <el-input v-model="createMenuObj.sort" placeholder="请输入序号" class="custom-input" />
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-input v-model="createMenuObj.icon" placeholder="请输入图标" class="custom-input" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="createMenuVisible = false" class="cancel-btn">取消</el-button>
                <el-button type="primary" @click="handleCreateMenu" class="submit-btn">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref,shallowRef, onMounted } from 'vue'
import { getMenus,addMenu, setMenu, deleteMenu } from '@/api/menus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
let dialogTitle = ref('新增菜单')
let dialogType = ref('add')
let currentPage4 = ref(1)
let pageSize4 = ref(20)
const total = ref(0)
const createMenuVisible = ref(false)
const createMenuObj = ref({
    name: '',
    path: '',
    component: '',
    sort: '',
    icon: ''
})
const createMenuRules = ref({
    name: [
        { required: true, message: '请输入菜单名称', trigger: 'blur' }
    ],
    path: [
        { required: true, message: '请输入菜单路径', trigger: 'blur' }
    ]
})
const createMenuFormRef = ref(null)
const loading = ref(false)
// 新增菜单
const handleCreateMenu = ()=>{
    createMenuFormRef.value.validate((valid) => {
        if (valid) {
            if(dialogType.value === 'add'){
                // 表单验证通过，提交数据
                addMenu({
                    parentId: createMenuObj.value.parentId,
                    name: createMenuObj.value.name,
                    path: createMenuObj.value.path,
                    component: createMenuObj.value.component,
                    sort: createMenuObj.value.sort,
                    icon: createMenuObj.value.icon || 'default'
                }).then(res=>{
                    if(res.code===200){
                        createMenuVisible.value = false
                        getMenusList()
                    } else {
                        ElMessage.error(res.msg)
                    }
                })
            }else{
                // 表单验证通过，提交数据
                setMenu({
                    id: createMenuObj.value.id,
                    parentId: createMenuObj.value.parentId,
                    name: createMenuObj.value.name,
                    path: createMenuObj.value.path,
                    component: createMenuObj.value.component,
                    sort: createMenuObj.value.sort,
                    icon: createMenuObj.value.icon || 'default'
                }).then(res=>{
                    if(res.code===200){
                        createMenuVisible.value = false
                        getMenusList()
                    } else {
                        ElMessage.error(res.msg)
                    }
                })
            }
            
        } else {
            // 表单验证不通过，提示用户
            ElMessage.error('请填写完整信息');
        }
    });
}

const menusList = shallowRef([])
const getMenusList = ()=>{
    loading.value = true
    getMenus().then(res=>{
        if(res.code===200){
            menusList.value = res.data
            total.value = res.data.length
        }
    }).finally(() => {
        loading.value = false
    })
}
// 新增
const handleAddMenu = (row)=>{
    console.log('新增菜单', row)
    dialogTitle.value = '新增菜单'
    dialogType.value = 'add'
    createMenuObj.value = {}
    createMenuObj.value.parentId = row?.id || ''
    createMenuVisible.value = true
}
// 编辑
const handleEditMenu = (row)=>{
    dialogTitle.value = '编辑菜单'
    dialogType.value = 'edit'
    createMenuObj.value = {...row}
    createMenuVisible.value = true
    console.log(row)
}
// 删除
const handleDeleteMenu = (row)=>{
    console.log(row)
    ElMessageBox.confirm('确认删除该菜单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteMenu({id: row.id}).then(res=>{
            if(res.code===200){
                getMenusList()
            } else {
                ElMessage.error(res.msg)
            }
        })
    }).catch(() => {
        // 取消删除操作
    });
}
// 分页大小改变
const handleSizeChange = (val)=>{
    console.log(`每页 ${val} 条`)
    pageSize4.value = val
    getMenusList()
}
// 分页当前页改变
const handleCurrentChange = (val)=>{
    console.log(`当前页: ${val}`)
    currentPage4.value = val
    getMenusList()
}
onMounted(()=>{
    getMenusList()
})
</script>

<style scoped lang="scss">
.menu-management-container {
    padding: 20px;
    background-color: var(--bg-primary);
    min-height: 100vh;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
    
    h2 {
        font-size: 20px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
    }
    
    .header-actions {
        display: flex;
        gap: 12px;
        
        .add-btn {
            border-radius: var(--border-radius);
            transition: all var(--transition-fast);
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(93, 186, 171, 0.3);
            }
        }
    }
}

.table-card {
    background-color: var(--bg-elevated);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    padding: 20px;
    margin-bottom: 24px;
}

.menu-table {
    :deep(.el-table) {
        background-color: transparent;
        border: none;
        margin-bottom: 20px;
        
        .el-table__header-wrapper {
            .el-table__header {
                th {
                    background-color: var(--bg-secondary);
                    color: var(--text-secondary);
                    font-weight: 600;
                    border-bottom: 1px solid var(--border-color);
                }
            }
        }
        
        .el-table__body-wrapper {
            .el-table__row {
                transition: background-color var(--transition-fast);
                
                &:hover {
                    background-color: var(--bg-secondary) !important;
                }
                
                &.el-table__row--striped {
                    background-color: var(--bg-elevated) !important;
                }
                
                td {
                    border-bottom: 1px solid var(--border-color);
                    
                    &:last-child {
                        border-right: none;
                    }
                }
            }
        }
    }
}

/* .menu-name {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .menu-icon {
        color: var(--primary);
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    component {
        color: var(--primary);
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    span {
        display: flex;
        align-items: center;
    }
} */

.table-actions {
    display: flex;
    gap: 12px;
    
    .action-btn {
        padding: 4px 8px;
        font-size: 14px;
    }
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.menu-pagination {
    :deep(.el-pagination) {
        .el-pager li {
            margin: 0 5px;
            
            &.is-active {
                background-color: var(--primary);
                color: white;
            }
        }
    }
}

.menu-dialog {
    :deep(.el-dialog__header) {
        border-bottom: 1px solid var(--border-color);
        padding: 20px;
    }
    
    :deep(.el-dialog__title) {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    :deep(.el-dialog__body) {
        padding: 24px;
    }
    
    :deep(.el-dialog__footer) {
        border-top: 1px solid var(--border-color);
        padding: 16px 24px;
    }
}

.menu-form {
    .custom-input {
        border-radius: var(--border-radius);
        transition: all var(--transition-fast);
        
        &:focus {
            box-shadow: 0 0 0 2px var(--primary) inset !important;
        }
    }
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    
    .cancel-btn,
    .submit-btn {
        padding: 8px 20px;
        border-radius: var(--border-radius);
        transition: all var(--transition-fast);
        
        &:hover {
            transform: translateY(-1px);
        }
    }
    
    .submit-btn {
        &:hover {
            box-shadow: 0 4px 12px rgba(93, 186, 171, 0.3);
        }
    }
}

.text-muted {
    color: var(--text-tertiary);
    font-size: 14px;
}

.icon-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background-color: var(--bg-secondary);
    border-radius: var(--border-radius);
    color: var(--primary);
    font-size: 16px;
}
</style>
