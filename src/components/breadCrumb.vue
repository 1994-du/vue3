<template>
    <el-breadcrumb :separator-icon="ArrowRight" class="bread_crumb">
        <el-breadcrumb-item v-for="(item,index) in paths" :key="index">{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import menuConfig from '../router/menuConfig'
import { ref } from 'vue'
let paths=ref([])
const getPath = (path)=>{
    paths.value = []
    path.forEach(el=>{
        getPathName(menuConfig,el)
    })
}

const getPathName = (list,name)=>{
    list.forEach(el=>{
        if(el.path==name){
            paths.value.push(el.title)
        }
        if(el.children){
            getPathName(el.children,name)
        }
    })
}
defineExpose({
    getPath
})
</script>
<style lang="less" scoped>
.bread_crumb{
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
</style>