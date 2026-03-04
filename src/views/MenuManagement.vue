<template>
    <div class="menu_management_wrap">
        <header>
            <el-button type="primary" @click="createMenu">新建菜单</el-button>
        </header>
        <el-table row-key="id" :data="menusList" style="width: 100%">
            <el-table-column prop="name" label="菜单名称"></el-table-column>
            <el-table-column prop="path" label="菜单路径"></el-table-column>
            <el-table-column prop="component" label="组件"></el-table-column>
            <el-table-column prop="icon" label="图标"></el-table-column>

            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" size="mini" @click="handleEditMenu(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="handleDeleteMenu(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <el-dialog title="新建菜单" v-model="createMenuVisible" width="50%">
        <el-form :model="createMenuObj" :rules="createMenuRules" ref="createMenuFormRef" label-width="120px">
            <el-form-item label="菜单名称" prop="menuName">
                <el-input v-model="createMenuObj.menuName" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
            <el-form-item label="菜单路径" prop="menuPath">
                <el-input v-model="createMenuObj.menuPath" placeholder="请输入菜单路径"></el-input>
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
import { getMenus, setMenus } from '@/api/menus'
const createMenuVisible = ref(false)
const createMenuObj = ref({
    menuName: '',
    menuPath: ''
})
const createMenuRules = ref({
    menuName: [
        { required: true, message: '请输入菜单名称', trigger: 'blur' }
    ],
    menuPath: [
        { required: true, message: '请输入菜单路径', trigger: 'blur' }
    ]
})
const createMenuFormRef = ref(null)
const handleCreateMenu = ()=>{
    createMenuFormRef.value.validate((valid) => {
        if (valid) {
            // 表单验证通过，提交数据
            setMenus(createMenuObj.value).then(res=>{
                if(res.code===200){
                    createMenuVisible.value = false
                    getMenusList()
                }
            })
        } else {
            // 表单验证不通过，提示用户
            ElMessage.error('请填写完整信息');
        }
    });
}
const createMenu = ()=>{
    console.log('创建菜单')
    createMenuVisible.value = true
}

const menusList = shallowRef([])
const getMenusList = ()=>{
    getMenus().then(res=>{
        if(res.code===200){
            menusList.value = res.data
        }
    })
}
onMounted(()=>{
    getMenusList()
})
</script>
