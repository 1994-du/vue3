<template>
  <div class="theme-img" :style="{ borderColor: mainColor }">
    <img ref="imgRef" :src="src" crossorigin="anonymous" alt="" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  src: { type: String, required: true }
})

const mainColor = ref('#fff')
const imgRef = ref(null)

function extractDominantColor() {
  const img = imgRef.value
  if (!img) return

  // 缩小采样，既快又能去噪
  const size = 64
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = size
  canvas.height = size

  // 画到小画布（用 naturalWidth/Height 更稳）
  const w = img.naturalWidth || img.width
  const h = img.naturalHeight || img.height
  if (!w || !h) return

  ctx.drawImage(img, 0, 0, w, h, 0, 0, size, size)

  let imgData
  try {
    imgData = ctx.getImageData(0, 0, size, size)
  } catch (e) {
    // 跨域未设置或被拒会 taint canvas
    console.warn('getImageData failed:', e)
    return
  }

  mainColor.value = getDominantColor(imgData.data)
}

// 颜色量化 + 频次统计（按饱和度加权）
function getDominantColor(data) {
  const bins = new Map()
  const stride = 8 // 采样步长（可调大一点进一步加速，如 8、12）

  for (let i = 0; i < data.length; i += 4 * stride) {
    const a = data[i + 3]
    if (a < 125) continue // 忽略半透明

    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // 跳过接近白色的像素
    if (r > 240 && g > 240 && b > 240) continue

    // 只要不是白色就计入桶
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3)
    let v = bins.get(key)
    if (!v) v = { count: 0, r: 0, g: 0, b: 0 }
    v.count++
    v.r = r
    v.g = g
    v.b = b
    bins.set(key, v)
  }

  if (bins.size === 0) return '#888' // 兜底

  // 找出现次数最多的桶
  let best = null
  let bestCount = -1
  bins.forEach((v) => {
    if (v.count > bestCount) {
      bestCount = v.count
      best = v
    }
  })

  return `rgb(${best.r},${best.g},${best.b})`
}

function tryExtract() {
  const img = imgRef.value
  if (!img) return
  // 如果缓存命中，onload 不一定触发；用 complete 兜底
  if (img.complete) extractDominantColor()
  else img.onload = extractDominantColor
}

onMounted(tryExtract)
watch(() => props.src, tryExtract)
</script>

<style scoped lang="less">
.theme-img {
    width: 300px;
    height: 300px;
    border-style: dashed;
    border-width: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
        width: 60%;
        height: 60%;
        object-fit: contain;
    }
}
</style>