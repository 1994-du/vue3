<template>
    <h4>手写一个new函数</h4>
    <div class="tip">
        <el-text type="primary">1.创建对象，并且将对象的__proto__指向构造函数的原型对象</el-text>
        <el-text type="primary">2.绑定构造函数的this，并且执行构造函数</el-text>
        <el-text type="primary">3.如果构造函数返回的是一个对象，则返回这个对象，否则返回创建的对象</el-text>
    </div>
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
.tip{
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    .vue3-text{
        align-self: flex-start;
    }
}
</style>