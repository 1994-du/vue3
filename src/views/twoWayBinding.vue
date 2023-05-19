<!--  -->
<template>
    <h4>数据劫持和发布订阅者模式</h4>
    <h4>数据劫持:Vue2---Object.defineProperty</h4>
<highlightjs code="
const dep = new Dep()
Object.defineProperty(obj,key,
get(){
    //收集依赖
    dep.depend()
},
set(){
    //发布消息
    dep.notify()
})
"></highlightjs>
    <h4>数据劫持:Vue3---Proxy</h4>
<highlightjs code="const proxy=new Proxy(Obj,
{
    get(target,key){
        return target[key]
    }
    set(target,key,value){
        return Reflect.set(target,key,value)
    }
})"></highlightjs>
    <h1>发布订阅者模式（观察者模式）</h1>
    <h4>发布者</h4>
    <h4>订阅者</h4>
    <h4>订阅收集</h4>
<highlightjs code="
class Dep{
    constructor(){
        this.subs=[]
    },
    depend(){
        this.subs.push()
    },
    notify(){
        sbus.forEach(el=>{
            el.update()
        })
    }
}"></highlightjs>
</template>

<script setup>
</script>
<style lang="less" scoped>

</style>