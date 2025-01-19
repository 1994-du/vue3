<template>
  <div class="setInterval">
    <h4>为啥setInterval不精确</h4>
    <code>
        <pre>1. 事件循环和执行栈</pre>
        <pre>JavaScript 是单线程的，这意味着它只有一个线程来执行代码。如果某个任务已经在执行，新的定时任务就必须等待，直到当前任务执行完毕。因此，即使设置了定时器，也可能由于任务的阻塞或执行栈的压满，导致定时器的回调被延迟执行。
•例如：如果在 setInterval 调用的时间点有其他长时间运行的操作（比如计算密集型的循环），setInterval 回调会被推迟。</pre>
        <pre>2. 定时器的最小精度</pre>
        <pre>浏览器对定时器的精度有一定的限制。在现代浏览器中，定时器的最小精度通常是 4ms（以前有的浏览器更长，通常为 10ms 或更长）。这意味着即使你设置了 setInterval 的时间间隔为 1ms，实际上可能会间隔 4ms 或更长。
•浏览器的优化：为防止大量频繁调用回调函数对性能造成影响，浏览器会进行优化。例如，当多个定时器的时间间隔非常短时，浏览器会合并它们，减少回调调用的频率</pre>
        <pre>3. 任务延迟</pre>
        <pre>setInterval 在每次间隔到达时会把回调函数放入事件队列（event queue）中，事件队列的执行取决于当前执行栈是否空闲。如果当前栈中的任务比较多，或者浏览器在进行重绘、重排等渲染任务时，定时器的回调会被推迟。
•例如：如果你每秒钟请求一次网络数据，而在每个请求回调的同时浏览器进行页面渲染或者其他计算，定时器的执行会受到影响，导致间隔变长。</pre>
    </code>
    <h1>如何实现精确的setInterval</h1>
    <code>
        <pre>1. 使用 requestAnimationFrame</pre>
        <pre>对于需要精确控制执行间隔的场景，requestAnimationFrame 是一个比 setInterval 更为精确的选择。
它会根据浏览器的重绘周期来调度回调函数，使得回调函数的执行时机更加精确。requestAnimationFrame 主要用于动画帧的更新，但也可以用于周期性任务。</pre>
        <pre>2. 使用 Date.now() 或 performance.now()</pre>
        <pre>可以结合 Date.now() 或 performance.now() 来手动计算回调之间的时间差，从而确保任务按照预期的时间间隔执行：</pre>
    </code>
    <code>
        <pre>function preciseInterval(callback, interval) {</pre>
        <pre>   let lastTime = Date.now();</pre>
        <pre>   function loop() {</pre>
        <pre>       let now = Date.now();</pre>
        <pre>       let delta = now - lastTime;</pre>
        <pre>       if (delta >= interval) {</pre>
        <pre>           callback();</pre>
        <pre>           lastTime = now - (delta % interval);  // 确保精确的间隔</pre>
        <pre>       }</pre>
        <pre>       requestAnimationFrame(loop);</pre>
        <pre>   }</pre>
        <pre>   loop();</pre>
        <pre>}</pre>
        <pre>preciseInterval(() => {</pre>
        <pre>   console.log('执行');</pre>
        <pre>}, 1000); // 每隔 1000ms 执行一次</pre>
    </code>
  </div>
</template>
<script setup>
</script>
<style lang='scss' scoped>
p{
    text-align: left;
    margin: 0;
}
</style>