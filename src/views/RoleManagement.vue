<template>
    <div class="role_management_wrap">
        <h4 style="margin-bottom:0">角色管理</h4>
        <el-table style="width: 100%;" border :data="tableData">
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作">
                <el-button link>编辑</el-button>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 10px;"
            v-model:current-page="currentPage4"
            v-model:page-size="pageSize4"
            :page-sizes="[100, 200, 300, 400]"
            :size="size"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            />
    </div>
    
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRoles } from '../api/api'
import axios from 'axios'
const defaultProps = {
  children: 'children',
  label: 'menuName',
}
let tableData = ref([])
let currentPage4 = ref(1)
let pageSize4 = ref(100)
let size = ref('small')
let disabled = ref(false)
let background = ref(false)
const handleSizeChange = (val) => {
    console.log(`每页 ${val} 条`)
}
const handleCurrentChange = (val) => {
    console.log(`当前页: ${val}`)
}

const getRoleList = async () => {
    getRoles({
        page: currentPage4.value,
        pageSize: pageSize4.value
    }).then(res=>{
        tableData.value = res.data
    }).catch(err=>{
        console.error('获取角色数据失败',err)
    })
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