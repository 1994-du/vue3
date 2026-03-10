<template>
    <div class="flex flex-col items-start">
        <el-button type="primary" @click="handleAddMenu(null)">新建菜单</el-button>
        <el-table class="my-[10px]" border row-key="id" :data="menusList" style="width: 100%">
            <el-table-column prop="name" label="菜单名称"></el-table-column>
            <el-table-column prop="path" label="菜单路径"></el-table-column>
            <el-table-column prop="component" label="组件"></el-table-column>
            <el-table-column prop="sort" label="排序"></el-table-column>
            <el-table-column prop="icon" label="图标"></el-table-column>

            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" link @click="handleAddMenu(scope.row)">新增</el-button>
                    <el-button type="primary" link @click="handleEditMenu(scope.row)">编辑</el-button>
                    <el-button type="danger" link @click="handleDeleteMenu(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-model:current-page="currentPage4"
            v-model:page-size="pageSize4"
            :page-sizes="[20, 30, 40]"
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
    
    <el-dialog :title="dialogTitle" v-model="createMenuVisible" width="400" :close-on-click-modal="false">
        <el-form :model="createMenuObj" :rules="createMenuRules" ref="createMenuFormRef" label-width="70px">
            <el-form-item label="菜单名称" prop="name">
                <el-input v-model="createMenuObj.name" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
            <el-form-item label="菜单路径" prop="path">
                <el-input v-model="createMenuObj.path" placeholder="请输入菜单路径"></el-input>
            </el-form-item>
            <el-form-item label="组件" prop="component">
                <el-input v-model="createMenuObj.component" placeholder="请输入组件"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-input v-model="createMenuObj.icon" placeholder="请输入图标"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="handleCreateMenu">确定</el-button>
            <el-button @click="createMenuVisible = false">取消</el-button>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref,shallowRef, onMounted } from 'vue'
import { getMenus,addMenu, setMenu, deleteMenu } from '@/api/menus'
import { ElMessage, ElMessageBox } from 'element-plus'
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
                    icon: createMenuObj.value.icon
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
                    icon: createMenuObj.value.icon
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
    getMenus().then(res=>{
        if(res.code===200){
            menusList.value = res.data
            total.value = res.data.length
        }
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
