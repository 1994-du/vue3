<!--  -->
<template>
    <h1>一、什么是原型？</h1>
    <p>原型是指每个 JavaScript 对象都与另一个对象相关联，这个关联对象就是原型。在对象内部，这种关联通过 [[Prototype]] 实现。开发者可以通过 __proto__ 或 Object.getPrototypeOf(obj) 访问对象的原型。</p>
    <h2>1. 函数的 prototype 属性</h2>
	<p>每个函数对象都有一个 prototype 属性，指向一个对象。</p>
	<p>这个对象（即 prototype）被称为 原型对象，它是由该函数创建的实例共享的原型。</p>
    <h2>2. 对象的 __proto__ 属性</h2>
	<p>每个对象都有一个隐式原型属性 __proto__（某些浏览器中也叫 [[Prototype]]）。</p>
	<p>__proto__ 指向该对象的原型（即构造函数的 prototype）。</p>
    <h1>二、什么是原型链？</h1>
    <p>原型链是 JavaScript 中对象之间的继承机制。通过原型链，JavaScript 对象可以从其他对象继承属性和方法。</p>
    <h2>1. 属性查找规则</h2>
    <p>当访问对象的某个属性时，JavaScript 引擎会：</p>
    <p>1.首先检查对象自身是否存在该属性。</p>
    <p>2.如果对象自身不存在，就会沿着原型链向上查找。</p>
    <p>3.如果找到顶层（即 Object.prototype）仍然没有该属性，则返回 undefined。</p>
</template>
<script>
export default{
    name:'prototype-proto'
}
</script>
<script setup>

</script>
<style scoped>
*{
    text-align: left;
}
</style>