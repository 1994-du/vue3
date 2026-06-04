<template>
  <div class="audio_visualization">
    <h4>音频可视化</h4>
    <canvas width="800" height="200"></canvas>

    <audio controls id="test-audio">
      <source src="@/assets/demo1.mp3" type="audio/mpeg">
      <!-- http://172.26.32.52:1234/file/demo1.mp3 -->
      您的浏览器不支持 audio 元素。
    </audio>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
let audio: HTMLAudioElement | null = null; // 音频对象
let canvas: HTMLCanvasElement | null = null; // 画布对象
let ctx: CanvasRenderingContext2D | null = null; // 画布上下文对象
let isInit = false; // 是否已经初始化

let analyser: AnalyserNode | null = null
let buffer: Uint8Array<ArrayBuffer> | null = null
let animationFrameId: number | null = null
const ys = getComputedStyle(document.documentElement).getPropertyValue('--color').trim();
// 初始化
const initCvs = () => {
  audio = document.querySelector('audio');
  canvas = document.querySelector('canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  canvas.width = 400*devicePixelRatio;
  canvas.height = 200*devicePixelRatio;
  registerEvent()
};
// 注册事件
const registerEvent = () => {
  if (!audio) return;
  audio.addEventListener('play', () => {
    draw()
    if(isInit) return;
    const audioCtx = new AudioContext();// 音频上下文
    if (!audio) return;
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
  if (!canvas || !ctx || !analyser || !buffer) return;
  // 清空画布
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  analyser.getByteFrequencyData(buffer as any);
  const len = buffer.length / 2.5;
  const count = len * 2;
  const barWidth = width / count;
  ctx.fillStyle = ys;
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
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
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