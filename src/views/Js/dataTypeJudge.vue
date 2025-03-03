<!--  -->
<template>
    <h2>数据类型判断</h2>
    <p>typeof、instanceof、constructor、Object.toString.call</p>
    <h4>typeof:只能判断基本数据类型和function；数组、对象、null返回都是object</h4>
    <code>
        <pre>console.log('typeof [] --- ',typeof []) //object</pre>
        <pre>console.log('typeof {} --- ',typeof {}) //object</pre>
        <pre>console.log('typeof null --- ',typeof null) //object</pre>
    </code>
    
    <h4>instanceof：判断是不是构造函数的实例对象；或者 用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。不能判断基本数据类型和null、undefined。</h4>
    <code>
        <pre>object instanceof constructor即object.__proto__==constructor.prototype</pre>
        <pre>let myObj = {}</pre>
        <pre>myObj instanceof Object // true</pre>
    </code>
    <h4>constructor:查看目标构造函数。不能判断null和undefined.</h4>
    <code>
        <pre>[].constructor==Array</pre>
        <pre>let num = 123;
console.log(num.constructor === Number); // true

let str = "Hello";
console.log(str.constructor === String); // true

let bool = true;
console.log(bool.constructor === Boolean); // true

let arr = [1, 2, 3];
console.log(arr.constructor === Array); // true

let obj = {name: "Alice"};
console.log(obj.constructor === Object); // true

let date = new Date();
console.log(date.constructor === Date); // true

let regex = /abc/;
console.log(regex.constructor === RegExp); // true

let func = function() {};
console.log(func.constructor === Function); // true</pre>
    </code>
</template>

<script setup>

</script>
<style scoped>
h2,h4,p{
    text-align: left;
}
</style>