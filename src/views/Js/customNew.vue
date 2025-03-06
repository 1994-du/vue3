<template>
    <h4>手写一个new函数</h4>
    <code>
        <pre>function myNew(constructor,...args){
    let obj = Object.create(constructor.prototype) // 创建一个对象，对象.__proto__ = constructor.prototype

    let result = constructor.apply(obj,args) // 绑定构造函数的this，并且执行
    
    return result instanceof Object ? result : {} // 如果构造函数返回的是一个对象，则返回这个对象，否则返回创建的对象
}

const Person = function(name){
    this.name = name
    this.getName = function(){
        return this.name
    }
    return this
}

let p1 = myNew(Person,'zhangsan')
console.log(p1);
console.log(p1.getName());
</pre>
    </code>
</template>

<script setup>
</script>
<style scoped lang='less'>
</style>