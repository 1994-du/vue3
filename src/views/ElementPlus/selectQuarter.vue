<template>
<el-popover
    :visible="isPopoverVisible"
    :show-arrow="false"
    :offset="0"
    placement="bottom-start"
    width="300"
    trigger="click">
    <template #reference>
        <el-input v-model="searchForm.estmExit" clearable @click="showPopover"></el-input>
    </template>
    <template #default>
        <div class="select_quarter">
            <el-date-picker v-model="quarterObj.year" type="year" value-format="YYYY"></el-date-picker>
            <el-select v-model="quarterObj.quarter">
                <el-option v-for="quarter in quarters" :key="quarter.value" :label="quarter.label" :value="quarter.value"></el-option>
            </el-select>
        </div>
        <div class="dialog-footer">
            <el-button @click="isPopoverVisible = false">取消</el-button>
            <el-button type="primary" @click="handleQuarter">确定</el-button>
        </div>
    </template>
</el-popover>
</template>
<script setup>
import { watch } from 'vue';
import { 
    reactive,
    ref 
} from 'vue'
let isPopoverVisible = ref(false)
let quarterObj = reactive({
    year: '',
    quarter: ''
})
let quarters = reactive([
    { value: 1, label: '第一季度' },
    { value: 2, label: '第二季度' },
    { value: 3, label: '第三季度' },
    { value: 4, label: '第四季度' }
])
let searchForm = reactive({
    estmExit: ''
})
const showPopover = () => {
    isPopoverVisible.value = true
}
const handleQuarter = () => {
    searchForm.estmExit = `${quarterObj.year}年第${quarterObj.quarter}季度`
    isPopoverVisible.value = false
}
watch(searchForm, (newVal) => {
    console.log('watch',newVal);
    reviewData()
})
const reviewData = ()=>{
    let arr = searchForm.estmExit.split('年第') || []
    quarterObj.year = arr[0]
    quarterObj.quarter = arr[1]?.split('季度')[0]
}
</script>
<style lang='scss' scoped>
.select_quarter{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-date-picker{
        width: 150px;
    }
    .el-select{
        width: 150px;
    }
}
</style>