<template>
    <h4>WebGL</h4>
    <div>
        <p>fill：<input type="color" v-model="fillColor"></p>
        <p>stroke<input type="color" v-model="strokeColor"></p>
    </div>
    <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref,onMounted,watch } from 'vue'
let canvas = ref(null)
let ctx = ref(null)
let cvsWidth = ref(100)
let cvsHeight = ref(100)

let fillColor = ref()
let strokeColor = ref()

watch([fillColor,strokeColor],(newVal,oldVal)=>{
    ctx.value.fillStyle = fillColor.value
    ctx.value.strokeStyle = strokeColor.value
    ctx.value.fillRect(0, 0, cvsWidth.value, cvsHeight.value);
    ctx.value.strokeRect(cvsWidth.value/4,cvsHeight.value/4,cvsWidth.value/2,cvsHeight.value/2)
})
onMounted(()=>{
    ctx.value = canvas.value.getContext('2d')
    canvas.value.width = cvsWidth.value
    canvas.value.height = cvsHeight.value
    // 绘制矩形
    ctx.value.fillStyle = fillColor.value
    ctx.value.fillRect(0, 0, cvsWidth.value, cvsHeight.value);
    // 绘制矩形边框
    ctx.value.strokeStyle = strokeColor.value
    ctx.value.strokeRect(cvsWidth.value/4,cvsHeight.value/4,cvsWidth.value/2,cvsHeight.value/2)
})

</script>
<style scoped lang='less'>
</style>