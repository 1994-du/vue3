<template>
  <div class="timg" :style="{ borderColor: mainColor }">
    <div class="timg__stage">
      <img ref="imgRef" :src="src" crossorigin="anonymous" alt="" />
    </div>
    <div class="timg__meta">
      <span class="timg__dot" :style="{ background: mainColor }" aria-hidden="true"></span>
      <span class="timg__val">{{ mainColor }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  src: { type: String, required: true }
})

const mainColor = ref('…')
const imgRef = ref<HTMLImageElement | null>(null)

function extractDominantColor() {
  const img = imgRef.value
  if (!img) return

  // 缩小采样，既快又能去噪
  const size = 64
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  canvas.width = size
  canvas.height = size

  // 画到小画布（用 naturalWidth/Height 更稳定）
  const w = img.naturalWidth || img.width
  const h = img.naturalHeight || img.height
  if (!w || !h) return

  ctx.drawImage(img, 0, 0, w, h, 0, 0, size, size)

  let imgData: ImageData | null = null
  try {
    imgData = ctx.getImageData(0, 0, size, size)
  } catch {
    // 跨域未配置 CORS 时画布被污染，getImageData 抛 SecurityError
    mainColor.value = '受跨域限制'
    return
  }
  if (!imgData) return

  mainColor.value = getDominantColor(imgData.data)
}

// 颜色量化 + 频次统计
function getDominantColor(data: Uint8ClampedArray) {
  const bins = new Map<number, { count: number; r: number; g: number; b: number }>()
  const stride = 8 // 采样步长（可调大进一步加速）

  for (let i = 0; i < data.length; i += 4 * stride) {
    const a = data[i + 3]
    if (a < 125) continue // 忽略半透明

    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // 跳过接近白色的像素，避免白底图提出白色
    if (r > 240 && g > 240 && b > 240) continue

    // r/g/b 各取高 5 位拼 key 分桶
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3)
    let v = bins.get(key)
    if (!v) {
      v = { count: 0, r: 0, g: 0, b: 0 }
      bins.set(key, v)
    }
    v.count++
    v.r = r
    v.g = g
    v.b = b
  }

  if (bins.size === 0) return '#888' // 兜底

  // 找出现次数最多的桶
  let best = { r: 136, g: 136, b: 136 }
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
  // 缓存命中时 onload 不再触发，用 complete 兜底
  if (img.complete) extractDominantColor()
  else img.onload = extractDominantColor
}

onMounted(tryExtract)
watch(() => props.src, tryExtract)
</script>

<style scoped lang="scss">
.timg {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px dashed var(--hairline);
    padding: 10px;
    background: var(--surface-subtle);
    transition: border-color 120ms linear;
}

.timg__stage {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 150px;

    img {
        max-width: 80%;
        max-height: 100%;
        object-fit: contain;
    }
}

.timg__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    border-top: 1px solid var(--hairline);
    padding-top: 8px;
}

.timg__dot {
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    border: 1px solid var(--hairline);
}

.timg__val {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
