<template>
    <div class="role_management_wrap">
        <h4 style="margin-bottom:0">角色管理</h4>
        <div class="role_management">
            <div class="role_list">
                <el-table :data="tableData">
                    <el-table-column label="角色名称" prop="roleName"></el-table-column>
                    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                    <el-table-column label="操作">
                        <el-button link>编辑</el-button>
                    </el-table-column>
                </el-table>
            </div>
            <div class="role_tree">
                <el-input placeholder="请输入角色描述"></el-input>
                <el-tree
                    ref="treeRef"
                    style="max-width: 600px"
                    :data="data"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    highlight-current
                    :props="defaultProps"
                />
                <el-button type="primary" @click="getTreeData">保存</el-button>
            </div>
        </div>
    </div>
    
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
const defaultProps = {
  children: 'children',
  label: 'menuName',
}
let tableData = ref([])
let data = ref([])


const getRoles = async () => {
    axios.get('/api/getRoles').then(res=>{
        if(res.status === 200){
            console.log('roleList',res);
            tableData.value = res.data.data
            data.value = res.data.data[0].menus
        }
    })
}
const getTreeData = ()=>{
    console.log('tree',data.value);    
}
onMounted(()=>{
    getRoles()
})
</script>
<style scoped lang='less'>
.role_management_wrap{
    height: 100%;
    display: flex;
    flex-direction: column;
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