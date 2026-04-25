<template>
    <div class="org-structure-container">
        <div class="page-header">
            <h2>组织架构管理</h2>
            <div class="header-actions">
                <el-button type="primary" @click="handleAdd" class="add-btn">
                    <el-icon><Plus /></el-icon>新增组织
                </el-button>
                <el-button type="default" @click="refreshData" class="refresh-btn">
                    <el-icon><Refresh /></el-icon>刷新
                </el-button>
            </div>
        </div>
        
        <div class="table-card">
            <el-table 
                :data="tableData" 
                border 
                row-key="id"
                default-expand-all
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                v-loading="loading"
                class="org-table">
                <el-table-column label="组织名称" prop="name" min-width="200">
                    <template #default="{ row }">
                        <div class="org-name">
                            <el-icon class="org-icon" v-if="row.children && row.children.length > 0">
                                <OfficeBuilding />
                            </el-icon>
                            <el-icon class="org-icon" v-else>
                                <User />
                            </el-icon>
                            <span>{{ row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="组织编码" prop="code" width="150" />
                <el-table-column label="排序" prop="sort" width="80" />
                <el-table-column label="状态" prop="status" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 1 ? 'success' : 'danger'" effect="light">
                            {{ row.status === 1 ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime" width="180" />
                <el-table-column label="操作" width="250" fixed="right">
                    <template #default="{ row }">
                        <div class="table-actions">
                            <el-button link type="primary" @click="handleAddChild(row)" class="action-btn">添加下级</el-button>
                            <el-button link type="primary" @click="handleEdit(row)" class="action-btn">编辑</el-button>
                            <el-popconfirm 
                                title="确定删除此组织?"
                                @confirm="handleDelete(row.id)"
                                confirm-button-text="确定"
                                cancel-button-text="取消">
                                <template #reference>
                                    <el-button link type="danger" class="action-btn">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog 
        :title="dialogTitle"
        v-model="dialogVisible"
        width="500px"
        class="org-dialog"
        :close-on-click-modal="false">
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px" class="org-form">
            <el-form-item label="上级组织" v-if="formData.parentId !== 0">
                <el-input v-model="parentName" disabled class="disabled-input" />
            </el-form-item>
            <el-form-item label="组织名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入组织名称" class="custom-input" />
            </el-form-item>
            <el-form-item label="组织编码" prop="code">
                <el-input v-model="formData.code" placeholder="请输入组织编码" class="custom-input" />
            </el-form-item>
            <el-form-item label="排序">
                <el-input-number v-model="formData.sort" :min="0" :max="999" class="custom-input-number" />
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="formData.status" class="status-radio">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注">
                <el-input 
                    v-model="formData.remark" 
                    type="textarea" 
                    :rows="3"
                    placeholder="请输入备注" 
                    class="custom-textarea"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false" class="cancel-btn">取消</el-button>
                <el-button type="primary" @click="handleSubmit" class="submit-btn">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, OfficeBuilding, User, Plus } from '@element-plus/icons-vue'
import { 
    getOrgTree, 
    addOrg, 
    updateOrg, 
    deleteOrg,
    getOrgDetail 
} from '@/api/api'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' | 'edit' | 'addChild'
const formRef = ref(null)
const parentName = ref('')

const formData = reactive({
    id: null,
    parentId: 0,
    name: '',
    code: '',
    sort: 0,
    status: 1,
    remark: ''
})

const rules = {
    name: [
        { required: true, message: '请输入组织名称', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入组织编码', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ]
}

const dialogTitle = computed(() => {
    const titles = {
        add: '新增组织',
        edit: '编辑组织',
        addChild: '添加下级组织'
    }
    return titles[dialogType.value] || '组织管理'
})

// 获取组织架构树
const fetchData = async () => {
    loading.value = true
    try {
        const res = await getOrgTree()
        if (res.code === 200) {
            tableData.value = res.data || []
        } else {
            ElMessage.error(res.msg || '获取数据失败')
        }
    } catch (error) {
        ElMessage.error('获取组织架构数据失败')
    } finally {
        loading.value = false
    }
}

// 刷新数据
const refreshData = () => {
    fetchData()
}

// 重置表单
const resetForm = () => {
    formData.id = null
    formData.parentId = 0
    formData.name = ''
    formData.code = ''
    formData.sort = 0
    formData.status = 1
    formData.remark = ''
    parentName.value = ''
}

// 新增组织
const handleAdd = () => {
    dialogType.value = 'add'
    resetForm()
    dialogVisible.value = true
}

// 添加下级组织
const handleAddChild = (row) => {
    dialogType.value = 'addChild'
    resetForm()
    formData.parentId = row.id
    parentName.value = row.name
    dialogVisible.value = true
}

// 编辑组织
const handleEdit = async (row) => {
    dialogType.value = 'edit'
    resetForm()
    try {
        const res = await getOrgDetail({ id: row.id })
        if (res.code === 200) {
            Object.assign(formData, res.data)
            dialogVisible.value = true
        } else {
            ElMessage.error(res.msg || '获取详情失败')
        }
    } catch (error) {
        ElMessage.error('获取组织详情失败')
    }
}

// 删除组织
const handleDelete = async (id) => {
    try {
        const res = await deleteOrg({ id })
        if (res.code === 200) {
            ElMessage.success('删除成功')
            fetchData()
        } else {
            ElMessage.error(res.msg || '删除失败')
        }
    } catch (error) {
        ElMessage.error('删除失败')
    }
}

// 提交表单
const handleSubmit = async () => {
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) return

    try {
        let res
        if (dialogType.value === 'edit') {
            res = await updateOrg(formData)
        } else {
            res = await addOrg(formData)
        }
        
        if (res.code === 200) {
            ElMessage.success(dialogType.value === 'edit' ? '更新成功' : '添加成功')
            dialogVisible.value = false
            fetchData()
        } else {
            ElMessage.error(res.msg || '操作失败')
        }
    } catch (error) {
        ElMessage.error('操作失败')
    }
}

onMounted(() => {
    fetchData()
})
</script>

<style scoped lang="scss">
.org-structure-container {
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
        
        .refresh-btn {
            border-radius: var(--border-radius);
            transition: all var(--transition-fast);
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

.org-table {
    :deep(.el-table) {
        background-color: transparent;
        border: none;
        
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

.org-name {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .org-icon {
        color: var(--primary);
        font-size: 16px;
    }
}

.table-actions {
    display: flex;
    gap: 12px;
    
    .action-btn {
        padding: 4px 8px;
        font-size: 14px;
    }
}

.org-dialog {
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

.org-form {
    .custom-input,
    .disabled-input,
    .custom-textarea {
        border-radius: var(--border-radius);
        transition: all var(--transition-fast);
        
        &:focus {
            box-shadow: 0 0 0 2px var(--primary) inset !important;
        }
    }
    
    .custom-input-number {
        border-radius: var(--border-radius);
        
        :deep(.el-input__wrapper) {
            border-radius: var(--border-radius);
        }
    }
    
    .status-radio {
        display: flex;
        gap: 24px;
        
        :deep(.el-radio) {
            margin-right: 0;
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
</style>
