<template>
   <div class="file_upload">
    <h1>文件上传</h1>
    <h4>window.showDirectoryPicker()打开文件夹选择框</h4>
    <el-button @click="openFile">打开文件选择框</el-button>
    <el-button @click="openFloder">打开文件夹选择框</el-button>
    <div v-for="item in imgs" :key="item+1">
        <img :src="item.src" alt="">
        <p>{{ item.name }}</p>
    </div>
   </div>
   
</template>
<script setup>
import { reactive } from 'vue';

let flodeFile=reactive({})
let imgs=reactive([])
//打开文件夹选择框
const openFloder = async()=>{
    try{
        const handle =await window.showDirectoryPicker()
        const files =await processHandle(handle)
        flodeFile=files
        
        files.children.forEach (async el=>{
            // 文件
            if(el.kind=='file'){
                const file = await el.getFile()
                console.log(file)
                
                //图片
                if(file.type==='image/jpeg'){
                    const reader = new FileReader()
                    //读取文件地址
                    reader.readAsDataURL(file)
                    //读取文件内容
                    // reader.readAsText(file,'utf-8')
                    reader.onload=(e)=>{
                        console.log(e)
                        imgs.push({
                            name:file.name,
                            src:e.target.result
                        })
                    }
                }
               
            }
            
        })
        const reder = new FileReader()
        console.log(reder(files))
    }
    catch{
        console.log('拒绝查看')
    }
    async function processHandle(handle){
        if(handle.kind==='file'){
            return handle
        }
        handle.children=[]
        const iter =  handle.entries()
        for await(const item of iter){
            handle.children.push(await processHandle(item[1]))
        }
        return handle
    }
}
//打开文件选择框
const openFile = ()=>{
    window.showOpenFilePicker()
}
</script>
<style lang="less" scoped>
</style>