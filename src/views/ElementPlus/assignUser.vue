<template>
    <div>
        <h4>组件通信</h4>
        <UserChoose 
            ref="userBtnRef1"
            :data="userList"
            :cancel="false" 
            @select="userSelect" 
            @click="testOne1">
            经办人
        </UserChoose>
        <UserChoose 
            ref="userBtnRef2"
            :data="userList"
            :cancel="true" 
            @select="userSelect" 
            @click="testOne2">
            复核人
        </UserChoose>
        <el-table :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="handler" label="经办人"></el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref,reactive } from 'vue'
import UserChoose from '../../components/userChoose.vue';
import { ElMessage } from 'element-plus';
let userList = ref([
    {id:1,name:'张三'},
    {id:2,name:'李四'},
    {id:3,name:'王五'},
    {id:4,name:'赵六'},
    {id:5,name:'钱七'},
    {id:6,name:'孙八'},
    {id:7,name:'周九'},
    {id:8,name:'吴十'},
    {id:9,name:'郑十一'},
    {id:10,name:'王十二'}
])
let tableData = reactive([
    { handler: '张三' },
    { handler: '李四' },
    { handler: '王五' },
])
let selectData = ref([])
let userBtnRef1 = ref(null)
let userBtnRef2 = ref(null)
const handleSelectionChange = (val) => {
    selectData.value = val
}
const testOne1 = ()=>{
    if(selectData.value.map(el => el.handler).length > 1){
        ElMessage({
            message:'经办人不是同一个',
            type:'warning'
        })
    }else{
        userBtnRef1.value.openPopover()
    }
}
const testOne2 = ()=>{
    if(selectData.value.map(el => el.handler).length > 1){
        ElMessage({
            message:'经办人不是同一个',
            type:'warning'
        })
    }else{
        userBtnRef2.value.openPopover()
    }
}
const userSelect = (data) => {
    console.log('确定',data)
}
</script>

<style lang='scss' scoped>

</style>