<template>
    <div class="org-structure-container">
        <div class="flex justify-between items-center mb-4">
            <el-button type="primary" @click="handleAdd">新增组织</el-button>
            <el-button type="default" @click="refreshData">
                <el-icon><Refresh /></el-icon>刷新
            </el-button>
        </div>
        
        <el-table 
            :data="tableData" 
            border 
            row-key="id"
            default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            v-loading="loading">
            <el-table-column label="组织名称" prop="name" min-width="200">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-icon class="mr-2" v-if="row.children && row.children.length > 0">
                            <OfficeBuilding />
                        </el-icon>
                        <el-icon class="mr-2" v-else>
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
                    <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                        {{ row.status === 1 ? '启用' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="180" />
            <el-table-column label="操作" width="250" fixed="right">
                <template #default="{ row }">
                    <el-button link type="primary" @click="handleAddChild(row)">添加下级</el-button>
                    <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
                    <el-popconfirm 
                        title="确定删除此组织?"
                        @confirm="handleDelete(row.id)">
                        <template #reference>
                            <el-button link type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog 
        :title="dialogTitle"
        v-model="dialogVisible"
        width="500px">
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="上级组织" v-if="formData.parentId !== 0">
                <el-input v-model="parentName" disabled />
            </el-form-item>
            <el-form-item label="组织名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入组织名称" />
            </el-form-item>
            <el-form-item label="组织编码" prop="code">
                <el-input v-model="formData.code" placeholder="请输入组织编码" />
            </el-form-item>
            <el-form-item label="排序">
                <el-input-number v-model="formData.sort" :min="0" :max="999" />
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="formData.status">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注">
                <el-input 
                    v-model="formData.remark" 
                    type="textarea" 
                    :rows="3"
                    placeholder="请输入备注" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, OfficeBuilding, User } from '@element-plus/icons-vue'
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
    
    :deep(.el-table) {
        background-color: transparent;
        
        .el-table__row {
            & > td:first-child {
                .cell {
                    display: flex;
                    align-items: center;
                }
            }
        }
    }
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>
