<template>
    <h2>浅拷贝：只拷贝已存在对象的对象属性的引用，非对象占用新的内存空间不与原对象共享</h2>
    <h4>浅拷贝方法</h4>
    <code>
        <pre>数组：Array.slice()、Array.concat()、[...arr]</pre>
        <pre>对象：Object.assign()、{...obj}</pre>
    </code>
    <div class="shallow_copy">
        <div class="item">
            <p>解构赋值</p>
        </div>
    </div>
    <h4>深拷贝方法</h4>
    <code>
        <pre>1.使用 JSON.parse(JSON.stringify(obj))（这种方式有局限，无法拷贝 undefined、function、symbol 等特殊值，也不能处理循环引用）。
const original = { a: 1, b: { c: 2 } };
const deepCopy = JSON.parse(JSON.stringify(original)); // 使用 JSON 方法进行深拷贝
console.log(deepCopy); // { a: 1, b: { c: 2 } }
console.log(deepCopy.b === original.b); // false，b 被完全复制了，不再指向同一个对象
2.使用递归方法手动实现深拷贝，逐层复制每个对象或数组
function deepClone(obj) {
  // 如果 obj 不是对象或者是 null，则直接返回
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 创建一个空对象或数组作为拷贝容器
  let copy;

  // 如果是数组，创建一个新的数组
  if (Array.isArray(obj)) {
    copy = [];
    for (let i = 0; i < obj.length; i++) {
      copy[i] = deepClone(obj[i]); // 递归拷贝每个元素
    }
  } else {
    // 如果是对象，创建一个新的对象
    copy = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = deepClone(obj[key]); // 递归拷贝每个属性
      }
    }
  }

  return copy;
}
3.使用第三方库（如 lodash 的 cloneDeep）</pre>
    </code>
</template>

<script setup>
</script>
<style lang="less" scoped>
h2,h4,p{
    text-align: left;
}
img{
    width: 200px;
    display: block;
    transition: all 2s;
}
.shallow_copy{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    .item{
        margin-right: 10px;
    }
}
</style>