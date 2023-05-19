<!--  -->
<template>
    <h2>数据类型判断</h2>
    <p>typeof、instanceof、constructor、Object.toString.call</p>
    <h4>typeof:只能判断基本数据类型和function；数组、对象、null返回都是object</h4>
<highlightjs code="console.log('typeof [] --- ',typeof []) //object
console.log('typeof {} --- ',typeof {}) //object
console.log('typeof null --- ',typeof null) //object"></highlightjs>
    <h4>instanceof：判断是不是构造函数的实例对象；或者 用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。不能判断基本数据类型和null、undefined。</h4>
<highlightjs code="object instanceof constructor即object.__proto__==constructor.prototype"></highlightjs>
    <h4>constructor:查看目标构造函数。不能判断null和undefined。例如：[].constructor==Array</h4>
</template>

<script setup>

</script>
<style scoped>
h2,h4,p{
    text-align: left;
}
</style>