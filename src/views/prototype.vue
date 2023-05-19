<!--  -->
<template>
    <h1>原型及原型链</h1>
    <h4>构造函数Cat</h4>
    <highlightjs code="function Cat(name){
    this.name=name;
    this.species='猫科'
}"></highlightjs>
<h4>使用构造函数生成一个实例对象，实例对象的__proto__指向构造函数的prototype</h4>
<highlightjs code="tom.__proto__ ==> Cat.prototype
    Cat.prototype.__proto__ ==> Object.prototype
        Object.prototype.__proto__ ==> null"></highlightjs>
    <h1>new过程</h1>
    <p>1.创建一个空对象{}</p>
    <p>2.新对象__proto__指向构造函数；obj.constructor=Cat obj.__proto__=Cat.prototype</p>
    <p>3.构造函数的this指向新对象；Cat.call(obj)</p>
    <p>4.返回新对象</p>
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