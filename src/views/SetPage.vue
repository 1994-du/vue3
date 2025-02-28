<template>
    <h4>设置</h4>
    <el-button @click="saveMenuBtn">保存菜单</el-button>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { openMenu,saveMenu } from '@/utils/menuToIndexDB'
let db=null;
const saveMenuBtn = async () => {
    const menu = await saveMenu(db)
    console.log(menu)
}
onMounted(async () => {
    try{
        db =  await openMenu() 
    }
    catch(err){
        console.log('打开数据库失败',err);
    } 
})
</script>
<style lang='scss' scoped>
</style>