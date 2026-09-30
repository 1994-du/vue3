<template>
    <div class="page">
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Element Plus</span>
                    <h2 class="panel__title">el-popover 弹层与表格选择</h2>
                </div>
                <span class="panel__meta">勾选多个经办人时弹层会被拦截，提示「经办人不是同一个」</span>
            </div>
            <div class="panel__body">
                <popButton>测试</popButton>

                <el-table :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column prop="handler" label="经办人"></el-table-column>
                </el-table>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref,reactive } from 'vue'
import popButton from '../../components/popButton.vue';
import { ElMessage } from 'element-plus';
const userList = ref([
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
const tableData = reactive([
    { handler: '张三' },
    { handler: '李四' },
    { handler: '王五' },
])
const selectData = ref<any[]>([])
const userBtnRef1 = ref<any>(null)
const userBtnRef2 = ref<any>(null)
const handleSelectionChange = (val: any[]) => {
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
const userSelect = (data: any) => {
}
</script>

<style lang='scss' scoped>
.head-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

/* 表格紧跟在按钮下方，给它一点呼吸空间 */
.panel__body .el-table {
    margin-top: 12px;
}
</style>