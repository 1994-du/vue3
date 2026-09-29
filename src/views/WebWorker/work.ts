// work.ts —— 这段代码跑在 Worker 线程里，和主线程互不干扰
self.onmessage = (e) => {
  const { loops } = e.data as { loops: number }
  const start = performance.now()
  let sum = 0
  for (let i = 0; i < loops; i++) {
    sum += i
  }
  // 计算结果 + 耗时一起发回主线程
  self.postMessage({ sum, ms: Math.round(performance.now() - start) })
}
