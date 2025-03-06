<template>
  <div class="audio_visualization">
    <h4>音频可视化</h4>
    <canvas width="800" height="200"></canvas>

    <audio controls>
      <source src="@/assets/demo1.mp3" type="audio/mpeg">
      您的浏览器不支持 audio 元素。
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
let audio = null; // 音频对象
let canvas = null; // 画布对象
let ctx = null; // 画布上下文对象
let isInit = false; // 是否已经初始化

let analyser = null
let buffer = null
let animationFrameId = null
// 初始化
const initCvs = () => {
  audio = document.querySelector('audio');
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = 400*devicePixelRatio;
  canvas.height = 200*devicePixelRatio;
  registerEvent()
};
// 注册事件
const registerEvent = () => {
  audio.addEventListener('play', () => {
    draw()
    if(isInit) return;
    const audioCtx = new AudioContext();// 音频上下文
    const source = audioCtx.createMediaElementSource(audio);// 音频源节点
    analyser = audioCtx.createAnalyser(); // 分析器
    source.connect(analyser); // 音频源节点连接到分析器节点
    analyser.fftSize = 512;
    buffer = new Uint8Array(analyser.frequencyBinCount) // 类型化数组  512/2
    analyser.connect(audioCtx.destination); // 分析器节点连接到音频上下文的输出节点
    isInit = true;
  });
  audio.addEventListener('pause',stopDraw)
};
// 绘画
const draw = () => {
  animationFrameId = requestAnimationFrame(draw);
  if(!isInit) return;
  // 清空画布
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  analyser.getByteFrequencyData(buffer);
  const len = buffer.length / 2.5;
  const count = len * 2;
  const barWidth = width / count;
  ctx.fillStyle = 'rgb(0, 0, 255)';
  for (let i = 0; i < len; i++) {
    const barHeight = buffer[i] / 255 * height;
    const x1 = i * barWidth + width / 2;
    const x2 = width / 2 - (i + 1)* barWidth;
    const y = height - barHeight;
    ctx.fillRect(x1, y, barWidth-2, barHeight);
    ctx.fillRect(x2, y, barWidth-2, barHeight);
  }
  
};
const stopDraw = () => {
  cancelAnimationFrame(animationFrameId);
};
onMounted(()=>{
  initCvs();
})
</script>

<style scoped lang='less'>
.audio_visualization{
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}
canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>