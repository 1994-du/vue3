<template>
    <div class="menu-management-container">
        <PageHeader title="菜单管理">
            <template #actions>
                <el-button type="primary" @click="handleAddMenu(null)" class="add-btn page-primary-action">
                    <el-icon><Plus /></el-icon>新建菜单
                </el-button>
                <el-button type="default" @click="getMenusList" class="refresh-btn">
                    <el-icon><Refresh /></el-icon>刷新
                </el-button>
            </template>
        </PageHeader>

        <div class="tree-card" v-loading="loading">
            <div class="tree-card__header">
                <div class="tree-card__heading">
                    <span class="tree-card__eyebrow">菜单树</span>
                    <h2>层级结构</h2>
                </div>
                <div class="tree-card__actions">
                    <el-input
                        v-model="filterText"
                        placeholder="搜索菜单名称"
                        clearable
                        size="default"
                        class="filter-input">
                        <template #prefix>
                            <el-icon><Search /></el-icon>
                        </template>
                    </el-input>
                    <el-button @click="expandAll">全部展开</el-button>
                    <el-button @click="collapseAll">全部收起</el-button>
                </div>
            </div>

            <el-scrollbar class="tree-scroll">
                <el-tree
                    v-if="menuTree.length"
                    ref="treeRef"
                    :key="treeKey"
                    :data="menuTree"
                    :props="treeProps"
                    node-key="id"
                    :expand-on-click-node="true"
                    :filter-node-method="filterNode"
                    :default-expanded-keys="defaultExpandedKeys"
                    :indent="24"
                    accordion
                    highlight-current
                    class="menu-tree">
                    <template #default="{ node, data }">
                        <div class="menu-tree-node">
                            <div class="menu-tree-node__main">
                                <span class="menu-tree-node__icon" :class="{ 'is-leaf': !data.children?.length }">
                                    <SvgIcon v-if="data.icon" :name="data.icon" />
                                    <el-icon v-else>
                                        <Folder v-if="data.children?.length" />
                                        <Document v-else />
                                    </el-icon>
                                </span>
                                <span class="menu-tree-node__content">
                                    <span class="menu-tree-node__name">{{ data.name }}</span>
                                    <span class="menu-tree-node__path">{{ data.path || '-' }}</span>
                                </span>
                            </div>
                            <div class="menu-tree-node__actions">
                                <el-tooltip content="新增子菜单" placement="top">
                                    <el-button link type="primary" @click.stop="handleAddMenu(data)">
                                        <el-icon><Plus /></el-icon>
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip content="编辑" placement="top">
                                    <el-button link type="primary" @click.stop="handleEditMenu(data)">
                                        <el-icon><Edit /></el-icon>
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip content="删除" placement="top">
                                    <el-button link type="danger" @click.stop="handleDeleteMenu(data)">
                                        <el-icon><Delete /></el-icon>
                                    </el-button>
                                </el-tooltip>
                            </div>
                        </div>
                    </template>
                </el-tree>
                <el-empty v-else description="暂无菜单数据" :image-size="72" />
            </el-scrollbar>
        </div>
    </div>

    <el-dialog
        :title="dialogTitle"
        v-model="createMenuVisible"
        width="480"
        :close-on-click-modal="false"
        class="menu-dialog">
        <el-form
            :model="createMenuObj"
            :rules="createMenuRules"
            ref="createMenuFormRef"
            label-width="100px"
            class="menu-form">
            <el-form-item v-if="dialogType === 'add' && parentMenuName" label="上级菜单">
                <el-tag type="info" effect="plain">{{ parentMenuName || '根菜单' }}</el-tag>
            </el-form-item>
            <el-form-item label="菜单名称" prop="name">
                <el-input v-model="createMenuObj.name" placeholder="请输入菜单名称" class="custom-input" />
            </el-form-item>
            <el-form-item label="菜单路径" prop="path">
                <el-input v-model="createMenuObj.path" placeholder="请输入菜单路径，如 /system/user" class="custom-input" />
            </el-form-item>
            <el-form-item label="组件路径" prop="component">
                <el-input v-model="createMenuObj.component" placeholder="请输入组件路径，如 views/Set/MenuManagement" class="custom-input" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number v-model="createMenuObj.sort" :min="0" :max="999" controls-position="right" class="w-full" />
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-input v-model="createMenuObj.icon" placeholder="请输入图标名称" class="custom-input">
                    <template #suffix>
                        <SvgIcon v-if="createMenuObj.icon" :name="createMenuObj.icon" class="icon-suffix" />
                    </template>
                </el-input>
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
import { ref, shallowRef, onMounted, nextTick, watch } from 'vue'
import { getMenuTree, addMenu, setMenu, deleteMenu } from '@/api/menus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Edit, Refresh, Search, Folder, Document } from '@element-plus/icons-vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

interface MenuItem {
    id: number | string
    name: string
    path: string
    component: string
    sort: number
    icon?: string
    parentId?: number | string
    children?: MenuItem[]
}

interface MenuFormData {
    id?: number | string
    parentId?: number | string
    name: string
    path: string
    component: string
    sort: number
    icon?: string
}

const treeRef = ref<any>(null)
const filterText = ref('')
const loading = ref(false)
const menuTree = shallowRef<MenuItem[]>([])
const createMenuVisible = ref(false)
const createMenuFormRef = ref<any>(null)

const dialogTitle = ref('新增菜单')
const dialogType = ref<'add' | 'edit'>('add')
const parentMenuName = ref('')

const treeProps = {
    children: 'children',
    label: 'name'
}

const createMenuObj = ref<MenuFormData>({
    name: '',
    path: '',
    component: '',
    sort: 0,
    icon: ''
})

const createMenuRules = {
    name: [
        { required: true, message: '请输入菜单名称', trigger: 'blur' }
    ],
    path: [
        { required: true, message: '请输入菜单路径', trigger: 'blur' }
    ]
}

const filterNode = (value: string, data: MenuItem): boolean => {
    if (!value) return true
    return data.name.includes(value) || data.path.includes(value)
}

watch(filterText, val => {
    treeRef.value?.filter(val)
})

const treeKey = ref(0)
const defaultExpandedKeys = ref<(number | string)[]>([])

const saveExpandedKey = (): void => {
    const nodes = treeRef.value?.store?.nodesMap || {}
    const expanded = Object.keys(nodes).find(key => nodes[key].expanded)
    defaultExpandedKeys.value = expanded ? [expanded] : []
}

const getMenusList = (preserveExpand = true): void => {
    if (preserveExpand) {
        saveExpandedKey()
    }
    loading.value = true
    getMenuTree().then((res: any) => {
        if (res.code === 200) {
            menuTree.value = res.data || []
            if (preserveExpand && defaultExpandedKeys.value.length) {
                treeKey.value++
            }
            nextTick(() => {
                treeRef.value?.setCurrentKey(null)
            })
        }
    }).finally(() => {
        loading.value = false
    })
}

const expandAll = (): void => {
    const nodes = treeRef.value?.store?.nodesMap || {}
    Object.keys(nodes).forEach(key => {
        nodes[key].expanded = true
    })
}

const collapseAll = (): void => {
    const nodes = treeRef.value?.store?.nodesMap || {}
    Object.keys(nodes).forEach(key => {
        nodes[key].expanded = false
    })
}

const handleAddMenu = (row: MenuItem | null): void => {
    dialogTitle.value = row ? '新增子菜单' : '新建菜单'
    dialogType.value = 'add'
    parentMenuName.value = row?.name || ''
    createMenuObj.value = {
        name: '',
        path: '',
        component: '',
        sort: 0,
        icon: '',
        parentId: row?.id || undefined
    }
    createMenuVisible.value = true
}

const handleEditMenu = (row: MenuItem): void => {
    dialogTitle.value = '编辑菜单'
    dialogType.value = 'edit'
    parentMenuName.value = ''
    createMenuObj.value = { ...row, sort: row.sort ?? 0 }
    createMenuVisible.value = true
}

const handleDeleteMenu = (row: MenuItem): void => {
    const hasChildren = row.children?.length && row.children.length > 0
    const tip = hasChildren
        ? `该菜单下有 ${row.children?.length} 个子菜单，删除后子菜单也将被删除，确认继续吗？`
        : '确认删除该菜单吗？'

    ElMessageBox.confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteMenu({ id: row.id }).then((res: any) => {
            if (res.code === 200) {
                ElMessage.success('删除成功')
                getMenusList()
            } else {
                ElMessage.error(res.msg || '删除失败')
            }
        })
    }).catch(() => {})
}

const handleCreateMenu = (): void => {
    createMenuFormRef.value.validate((valid: boolean) => {
        if (!valid) {
            ElMessage.error('请填写完整信息')
            return
        }

        const params = {
            ...createMenuObj.value,
            icon: createMenuObj.value.icon || 'default'
        }

        const request = dialogType.value === 'add' ? addMenu(params) : setMenu(params)

        request.then((res: any) => {
            if (res.code === 200) {
                createMenuVisible.value = false
                ElMessage.success(dialogType.value === 'add' ? '新增成功' : '更新成功')
                getMenusList()
            } else {
                ElMessage.error(res.msg || (dialogType.value === 'add' ? '新增失败' : '更新失败'))
            }
        })
    })
}

onMounted(() => {
    getMenusList()
})
</script>

<style scoped lang="scss">
.menu-management-container {
    padding: 20px;
    background-color: var(--bg-primary);
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.tree-card {
    background-color: var(--bg-elevated);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;

    &__header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        padding: 20px 24px 16px;
        border-bottom: 1px solid var(--border-color);
    }

    &__heading {
        display: flex;
        flex-direction: column;
        gap: 4px;

        h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
        }
    }

    &__eyebrow {
        font-size: 12px;
        color: var(--text-tertiary);
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    &__actions {
        display: flex;
        gap: 10px;
        align-items: center;
    }
}

.filter-input {
    width: 240px;
}

.tree-scroll {
    flex: 1;
    min-height: 0;
    overflow: auto;
}

.menu-tree {
    background: transparent;
    color: var(--text-primary);
    padding: 12px 8px;

    :deep(.el-tree-node__content) {
        height: 48px;
        border-radius: 8px;
        margin: 2px 0;
        padding: 0 8px;
        transition: background-color var(--transition-fast);

        &:hover {
            background-color: var(--bg-secondary) !important;
        }
    }

    :deep(.el-tree-node.is-current > .el-tree-node__content) {
        background-color: var(--menu-bg-active) !important;
        color: var(--primary);
    }

    :deep(.el-tree-node__expand-icon) {
        color: var(--text-tertiary);
    }
}

.menu-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-right: 8px;

    &__main {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
    }

    &__icon {
        width: 30px;
        height: 30px;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: linear-gradient(135deg, rgba(93, 186, 171, 0.15), rgba(99, 102, 241, 0.12));
        color: var(--primary);
        font-size: 16px;

        &.is-leaf {
            background: rgba(148, 163, 184, 0.12);
            color: var(--text-secondary);
        }

        :deep(.el-icon) {
            font-size: 16px;
        }
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    &__name {
        font-size: 14px;
        font-weight: 500;
        color: inherit;
        line-height: 1.3;
    }

    &__path {
        font-size: 12px;
        color: var(--text-tertiary);
        font-family: "SF Mono", "Monaco", "Consolas", monospace;
        line-height: 1.2;
    }

    &__actions {
        flex-shrink: 0;
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity var(--transition-fast);
    }

    &:hover &__actions {
        opacity: 1;
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

    :deep(.el-input-number) {
        width: 100%;
    }

    .icon-suffix {
        font-size: 18px;
        color: var(--primary);
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
