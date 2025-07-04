<template>
   <div class="dominant_color">
        <el-upload
            class="upload-demo"
            :show-file-list="false"
            :http-request="uploadFile">
            <el-button>上传文件</el-button>
        </el-upload>
        <img ref="imgRef" :src="imgSrc" alt="" style="width: 200px;height: 200px;">
   </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
let imgSrc = ref('')
let imgRef = ref<HTMLImageElement | null>(null);
const uploadFile = async (options:any)=>{
    const { file, onSuccess, onError } = options;
    imgSrc.value = URL.createObjectURL(file)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        onError(new Error('Canvas context not available'));
        return;
    }
    const img = new Image();
    img.src = imgSrc.value;
    img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, img.width, img.height);
        console.log('Image data', data);
        document.documentElement.style.setProperty('--background2', `rgb(${data.data[0]}, ${data.data[1]}, ${data.data[2]})`);
    }   
};
</script>
<style scoped lang='less'>

.dominant_color {
    background-color: var(--background2);
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 4px;
}
</style>