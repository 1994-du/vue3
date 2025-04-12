<template>
   <div class="file_upload">
    <h1>文件上传</h1>
    <h4>window.showOpenFilePicker() 打开文件选择框</h4>
    <el-button @click="openFile">打开文件选择框</el-button>
    <h4>window.showDirectoryPicker()打开文件夹选择框</h4>
    <el-button @click="openFloder">打开文件夹选择框</el-button>
    <div v-for="item in imgs" :key="item+1">
        <img :src="item.src" alt="">
        <p>{{ item.name }}</p>
    </div>
    <h4>分片上传</h4>
    <el-upload
        class="upload-demo"
        drag
        multiple
        :show-file-list="false"
        :http-request="uploadFile"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :on-error="handleError"
    >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
            拖拽或 <em>点击上传</em>
        </div>
        <template #tip>
            <div class="el-upload__tip">
                分片上传
            </div>
        </template>
    </el-upload>
    <h4>分片下载</h4>
    <el-button @click="downloadFragmentDownload">分片下载</el-button>
   </div>
   
</template>
<script setup>
import { reactive } from 'vue';
import { fragmentUpload } from '@/api/api.js'
import { he } from 'element-plus/es/locales.mjs';
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

// 分片上传
const uploadFile = (file) => {
    const chunkSize = 1024 * 1024 * 10; // 1MB
    const totalChunks = Math.ceil(file.file.size / chunkSize);
    let currentChunk = 0;
    const uploadChunk = () => {
        const start = currentChunk * chunkSize;
        const end = Math.min(file.file.size, start + chunkSize);
        const chunk = file.file.slice(start, end);
        if (chunk.size === 0) {
            console.error('Chunk is empty');
            return;
        }
        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('filename', file.file.name);
        formData.append('chunkNumber', currentChunk + 1);
        formData.append('totalChunks', totalChunks);
        formData.append('chunkSize', chunkSize);
        formData.append('currentChunkSize', chunk.size);

        console.log('FormData', formData.get('file')); // 添加调试信息

        // 检查 FormData 中的文件对象
        formData.forEach((value, key) => {
            console.log('FormData key:', key, 'value:', value);
        });

        // {
        //     file:chunk,
        //     filename: file.file.name,
        //     chunkNumber: currentChunk + 1,
        //     totalChunks: totalChunks,
        //     chunkSize: chunkSize,
        //     currentChunkSize: chunk.size
        // }
        fragmentUpload(formData).then((res) => {
            console.log('上传成功', res);
            currentChunk++;
            if (currentChunk < totalChunks) {
                uploadChunk();
            }
        }).catch((err) => {
            console.error('上传失败', err);
        });
    };

    uploadChunk();
}
const handleChange = (file, fileList) => {
    console.log('文件改变', file, fileList)
}
const handleSuccess = (response, file, fileList) => {
    console.log('上传成功', response, file, fileList)
}
const handleError = (error, file, fileList) => {
    console.log('上传失败', error, file, fileList)
}
// 分片下载
const downloadFragmentDownload = ()=>{
    console.log(flodeFile)
}
</script>
<style lang="less" scoped>
</style>