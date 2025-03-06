<template>
    <h4>Generator生成器</h4>
    <code>
        <pre>生成器就是个特殊的迭代器，他可以返回一个值，并且可以暂停，然后继续执行。</pre>
        <pre>生成器函数 使用 function* 定义。</pre>
        <pre>yield 用于 暂停执行，next() 让它 继续执行。</pre>
        <pre>生成器返回一个 可迭代对象（Iterator），可以手动 .next() 控制执行。</pre>
        <pre>function* numberGenerator() {
    let num = yield "Please provide a number";
    console.log(`You provided: ${num}`);
}

const gen = numberGenerator();
console.log(gen.next().value);  // "Please provide a number"
console.log(gen.next(42).value); // "You provided: 42"</pre>
    </code>
</template>

<script setup>

</script>
<style scoped lang='less'>
</style>