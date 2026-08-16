<template>
    <div class="org-structure-container">
        <PageHeader title="组织架构">
            <template #actions>
                <el-button type="primary" @click="handleAdd" class="add-btn page-primary-action">
                    <el-icon><CirclePlusFilled /></el-icon>新增组织
                </el-button>
                <el-button type="default" @click="refreshData" class="refresh-btn">
                    <el-icon><Refresh /></el-icon>刷新
                </el-button>
            </template>
        </PageHeader>
        
        <div class="org-workspace" v-loading="loading">
            <aside class="org-tree-panel">
                <div class="org-panel-heading">
                    <div>
                        <span class="org-panel-heading__eyebrow">组织树</span>
                        <h2>层级关系</h2>
                    </div>
                    <span class="org-count">{{ totalOrgCount }}</span>
                </div>

                <div class="org-tree-summary">
                    <span><i class="status-dot is-enabled"></i>{{ enabledOrgCount }} 个启用</span>
                    <span>{{ rootOrgCount }} 个根组织</span>
                </div>

                <el-scrollbar class="org-tree-scroll">
                    <el-tree
                        v-if="tableData.length"
                        ref="treeRef"
                        :data="tableData"
                        :props="treeProps"
                        :current-node-key="selectedOrgId"
                        :expand-on-click-node="false"
                        :indent="26"
                        node-key="id"
                        default-expand-all
                        highlight-current
                        class="org-tree"
                        @node-click="handleNodeClick">
                        <template #default="{ node, data }">
                            <div class="org-tree-node">
                                <span class="org-tree-node__icon" :class="{ 'is-leaf': !data.children?.length }">
                                    <el-icon>
                                        <OfficeBuilding v-if="data.children?.length" />
                                        <User v-else />
                                    </el-icon>
                                </span>
                                <span class="org-tree-node__content">
                                    <strong>{{ data.name }}</strong>
                                    <small>{{ node.level }} 级·{{ data.children?.length || 0 }} 个下级</small>
                                </span>
                                <i class="status-dot" :class="data.status === 1 ? 'is-enabled' : 'is-disabled'"></i>
                            </div>
                        </template>
                    </el-tree>
                    <el-empty v-else description="暂无组织数据" :image-size="72" />
                </el-scrollbar>
            </aside>

            <section class="org-detail-panel">
                <template v-if="currentOrg">
                    <div class="org-detail-header">
                        <div class="org-detail-heading">
                            <span class="org-detail-icon">
                                <el-icon>
                                    <OfficeBuilding v-if="currentOrg.children?.length" />
                                    <User v-else />
                                </el-icon>
                            </span>
                            <div>
                                <div class="org-detail-title">
                                    <h2>{{ currentOrg.name }}</h2>
                                    <el-tag :type="currentOrg.status === 1 ? 'success' : 'danger'" effect="light">
                                        {{ currentOrg.status === 1 ? '启用' : '禁用' }}
                                    </el-tag>
                                </div>
                                <p>{{ currentOrgPath }}</p>
                            </div>
                        </div>

                        <div class="org-detail-actions">
                            <el-button type="primary" plain @click="handleAddChild(currentOrg)">
                                <el-icon><Plus /></el-icon>添加下级
                            </el-button>
                            <el-button @click="handleEdit(currentOrg)">
                                <el-icon><Edit /></el-icon>编辑
                            </el-button>
                            <el-popconfirm
                                title="确定删除此组织?"
                                confirm-button-text="确定"
                                cancel-button-text="取消"
                                @confirm="handleDelete(currentOrg.id)">
                                <template #reference>
                                    <el-button type="danger" plain>
                                        <el-icon><Delete /></el-icon>删除
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </div>

                    <div class="org-detail-section">
                        <div class="org-section-title">
                            <span>基本信息</span>
                            <small>{{ currentOrgLevel }} 级组织</small>
                        </div>
                        <dl class="org-meta-grid">
                            <div>
                                <dt>组织编码</dt>
                                <dd>{{ currentOrg.code || '-' }}</dd>
                            </div>
                            <div>
                                <dt>上级组织</dt>
                                <dd>{{ currentOrgParentName }}</dd>
                            </div>
                            <div>
                                <dt>排序</dt>
                                <dd>{{ currentOrg.sort ?? '-' }}</dd>
                            </div>
                            <div>
                                <dt>创建时间</dt>
                                <dd>{{ currentOrg.createTime || '-' }}</dd>
                            </div>
                        </dl>
                    </div>

                    <div class="org-detail-section org-relation-section">
                        <div class="org-section-title">
                            <span>组织关系</span>
                        </div>
                        <div class="org-relation-grid">
                            <div>
                                <strong>{{ currentOrg.children?.length || 0 }}</strong>
                                <span>直属下级</span>
                            </div>
                            <div>
                                <strong>{{ currentOrgDescendantCount }}</strong>
                                <span>全部下级</span>
                            </div>
                            <div>
                                <strong>{{ currentOrgLevel }}</strong>
                                <span>当前层级</span>
                            </div>
                        </div>
                    </div>

                    <div class="org-detail-section">
                        <div class="org-section-title">
                            <span>备注</span>
                        </div>
                        <p class="org-remark" :class="{ 'is-empty': !currentOrg.remark }">
                            {{ currentOrg.remark || '暂无备注' }}
                        </p>
                    </div>
                </template>

                <el-empty v-else description="请从左侧选择组织" :image-size="88" />
            </section>
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

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { CirclePlusFilled, Delete, Edit, Refresh, OfficeBuilding, User, Plus } from '@element-plus/icons-vue'
import { 
    getOrgTree, 
    addOrg, 
    updateOrg, 
    deleteOrg,
    getOrgDetail 
} from '@/api/api'

// 定义组织数据接口
interface OrgItem {
    id: number
    parentId: number
    name: string
    code: string
    sort: number
    status: number
    remark: string
    createTime?: string
    children?: OrgItem[]
}

// 定义表单数据接口
interface OrgFormData {
    id: number | null
    parentId: number
    name: string
    code: string
    sort: number
    status: number
    remark: string
}

// 定义验证规则接口
interface ValidationRule {
    required: boolean
    message: string
    trigger: string
    min?: number
    max?: number
}

// 定义API响应接口
interface ApiResponse {
    code: number
    data?: any
    msg?: string
}

const loading = ref(false)
const tableData = ref<OrgItem[]>([])
const treeRef = ref<any>(null)
const selectedOrgId = ref<number | null>(null)
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit' | 'addChild'>('add')
const formRef = ref<any>(null)
const parentName = ref('')

const treeProps = {
    children: 'children',
    label: 'name'
}

interface FlatOrgItem {
    item: OrgItem
    level: number
    path: string[]
    parentName: string
}

const formData = reactive<OrgFormData>({
    id: null,
    parentId: 0,
    name: '',
    code: '',
    sort: 0,
    status: 1,
    remark: ''
})

const rules: Record<string, ValidationRule[]> = {
    name: [
        { required: true, message: '请输入组织名称', trigger: 'blur' },
        { required: true, min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入组织编码', trigger: 'blur' },
        { required: true, min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ]
}

const dialogTitle = computed(() => {
    const titles: Record<string, string> = {
        add: '新增组织',
        edit: '编辑组织',
        addChild: '添加下级组织'
    }
    return titles[dialogType.value] || '组织管理'
})

const flattenOrgTree = (nodes: OrgItem[], level = 1, path: string[] = [], parentName = ''): FlatOrgItem[] => {
    return nodes.flatMap((item) => {
        const currentPath = [...path, item.name]
        return [
            { item, level, path: currentPath, parentName },
            ...(item.children?.length ? flattenOrgTree(item.children, level + 1, currentPath, item.name) : [])
        ]
    })
}

const flatOrgData = computed(() => flattenOrgTree(tableData.value))
const totalOrgCount = computed(() => flatOrgData.value.length)
const rootOrgCount = computed(() => tableData.value.length)
const enabledOrgCount = computed(() => flatOrgData.value.filter(({ item }) => item.status === 1).length)
const currentOrg = computed(() => flatOrgData.value.find(({ item }) => item.id === selectedOrgId.value)?.item || null)
const currentOrgMeta = computed(() => flatOrgData.value.find(({ item }) => item.id === selectedOrgId.value) || null)
const currentOrgPath = computed(() => currentOrgMeta.value?.path.join(' / ') || '')
const currentOrgLevel = computed(() => currentOrgMeta.value?.level || 0)
const currentOrgParentName = computed(() => currentOrgMeta.value?.parentName || '顶级组织')

const countDescendants = (node: OrgItem): number => {
    return (node.children || []).reduce((total, child) => total + 1 + countDescendants(child), 0)
}

const currentOrgDescendantCount = computed(() => currentOrg.value ? countDescendants(currentOrg.value) : 0)

const syncSelectedOrg = async (): Promise<void> => {
    const selectedStillExists = selectedOrgId.value !== null && flatOrgData.value.some(({ item }) => item.id === selectedOrgId.value)
    selectedOrgId.value = selectedStillExists ? selectedOrgId.value : (flatOrgData.value[0]?.item.id ?? null)
    await nextTick()
    if (selectedOrgId.value !== null) {
        treeRef.value?.setCurrentKey(selectedOrgId.value)
    }
}

// 获取组织架构树
const fetchData = async (): Promise<void> => {
    loading.value = true
    try {
        const res: any = await getOrgTree()
        if (res.code === 200) {
            tableData.value = res.data || []
            await syncSelectedOrg()
        } else {
            ElMessage.error(res.msg || '获取数据失败')
        }
    } catch (error) {
        ElMessage.error('获取组织架构数据失败')
    } finally {
        loading.value = false
    }
}

const handleNodeClick = (data: OrgItem): void => {
    selectedOrgId.value = data.id
}

// 刷新数据
const refreshData = (): void => {
    fetchData()
}

// 重置表单
const resetForm = (): void => {
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
const handleAdd = (): void => {
    dialogType.value = 'add'
    resetForm()
    dialogVisible.value = true
}

// 添加下级组织
const handleAddChild = (row: OrgItem): void => {
    dialogType.value = 'addChild'
    resetForm()
    formData.parentId = row.id
    parentName.value = row.name
    dialogVisible.value = true
}

// 编辑组织
const handleEdit = async (row: OrgItem): Promise<void> => {
    dialogType.value = 'edit'
    resetForm()
    try {
        const res: any = await getOrgDetail({ id: row.id })
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
const handleDelete = async (id: number): Promise<void> => {
    try {
        const res: any = await deleteOrg({ id })
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
const handleSubmit = async (): Promise<void> => {
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) return

    try {
        let res: any
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

.org-workspace {
    min-height: 560px;
    display: grid;
    grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
    overflow: hidden;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--surface);
}

.org-tree-panel {
    min-width: 0;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border-color);
    background: var(--surface-subtle);
}

.org-panel-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 22px 8px;

    h2 {
        margin: 3px 0 0;
        color: var(--text-primary);
        font-size: 17px;
        line-height: 1.3;
    }
}

.org-panel-heading__eyebrow {
    color: var(--text-tertiary);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.org-count {
    min-width: 32px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    border-radius: var(--radius-sm);
    color: var(--brand);
    background: var(--brand-soft);
    font-size: 12px;
    font-weight: 700;
}

.org-tree-summary {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 22px 16px;
    color: var(--text-tertiary);
    font-size: 12px;

    span {
        display: inline-flex;
        align-items: center;
        gap: 5px;
    }
}

.status-dot {
    width: 7px;
    height: 7px;
    display: inline-block;
    flex: 0 0 auto;
    border-radius: 50%;
    background: var(--text-tertiary);

    &.is-enabled {
        background: var(--success);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--success) 14%, transparent);
    }

    &.is-disabled {
        background: var(--danger);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--danger) 12%, transparent);
    }
}

.org-tree-scroll {
    flex: 1;
    min-height: 390px;
    padding: 0 10px 18px 12px;
}

.org-tree {
    :deep(.el-tree-node__content) {
        min-height: 58px;
        margin: 2px 0;
        padding-right: 10px;
        border-radius: var(--radius-sm);
        color: var(--text-secondary);
        transition: background-color var(--transition-fast), color var(--transition-fast);
    }

    :deep(.el-tree-node__content:hover) {
        background: var(--brand-soft);
    }

    :deep(.el-tree-node.is-current > .el-tree-node__content) {
        color: var(--brand);
        background: color-mix(in srgb, var(--brand) 13%, var(--surface));
        box-shadow: inset 3px 0 0 var(--brand);
    }

    :deep(.el-tree-node__expand-icon) {
        color: var(--text-tertiary);
        font-size: 15px;
    }

    :deep(.el-tree-node__expand-icon.is-leaf) {
        visibility: hidden;
    }

    :deep(.el-tree-node__children) {
        border-left: 1px solid color-mix(in srgb, var(--brand) 22%, var(--border-color));
    }
}

.org-tree-node {
    min-width: 0;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 9px;
}

.org-tree-node__icon {
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    border-radius: var(--radius-sm);
    color: var(--brand);
    background: var(--brand-soft);
    font-size: 16px;

    &.is-leaf {
        color: var(--accent);
        background: color-mix(in srgb, var(--accent) 12%, var(--surface));
    }
}

.org-tree-node__content {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;

    strong,
    small {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    strong {
        color: inherit;
        font-size: 13px;
        font-weight: 700;
    }

    small {
        color: var(--text-tertiary);
        font-size: 11px;
    }
}

.org-detail-panel {
    min-width: 0;
    padding: 30px 34px;
    background: var(--surface);
}

.org-detail-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    padding-bottom: 28px;
    border-bottom: 1px solid var(--border-color);
}

.org-detail-heading {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 14px;
}

.org-detail-icon {
    width: 46px;
    height: 46px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    border-radius: 12px;
    color: var(--brand);
    background: var(--brand-soft);
    font-size: 23px;
}

.org-detail-title {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 9px;

    h2 {
        max-width: min(520px, 100%);
        margin: 0;
        overflow: hidden;
        color: var(--text-primary);
        font-size: 22px;
        line-height: 1.3;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.org-detail-heading p {
    margin: 6px 0 0;
    overflow: hidden;
    color: var(--text-tertiary);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.org-detail-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;

    .el-button + .el-button {
        margin-left: 0;
    }
}

.org-detail-section {
    padding: 26px 0;
    border-bottom: 1px solid var(--border-color);
}

.org-section-title {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 700;

    small {
        color: var(--text-tertiary);
        font-size: 12px;
        font-weight: 500;
    }
}

.org-meta-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px 32px;
    margin: 0;

    div {
        min-width: 0;
    }

    dt {
        margin-bottom: 7px;
        color: var(--text-tertiary);
        font-size: 12px;
    }

    dd {
        margin: 0;
        overflow: hidden;
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.org-relation-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;

    div {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 16px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background: var(--surface-subtle);
    }

    strong {
        color: var(--brand);
        font-size: 22px;
        line-height: 1;
    }

    span {
        color: var(--text-tertiary);
        font-size: 12px;
    }
}

.org-remark {
    min-height: 48px;
    margin: 0;
    padding: 13px 15px;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    background: var(--surface-subtle);
    font-size: 13px;
    line-height: 1.7;

    &.is-empty {
        color: var(--text-tertiary);
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

@media (max-width: 980px) {
    .org-workspace {
        grid-template-columns: minmax(240px, 290px) minmax(0, 1fr);
    }

    .org-detail-panel {
        padding: 24px;
    }

    .org-detail-header {
        flex-direction: column;
    }

    .org-detail-actions {
        justify-content: flex-start;
    }
}

@media (max-width: 720px) {
    .org-structure-container {
        padding: 0;
    }

    .org-workspace {
        display: flex;
        flex-direction: column;
        border-radius: var(--radius-sm);
    }

    .org-tree-panel {
        min-height: 330px;
        border-right: 0;
        border-bottom: 1px solid var(--border-color);
    }

    .org-tree-scroll {
        min-height: 260px;
        max-height: 360px;
    }

    .org-detail-panel {
        padding: 22px 18px;
    }

    .org-detail-heading {
        align-items: flex-start;
    }

    .org-detail-title h2 {
        max-width: 220px;
        font-size: 19px;
    }

    .org-meta-grid,
    .org-relation-grid {
        grid-template-columns: 1fr;
    }
}
</style>
