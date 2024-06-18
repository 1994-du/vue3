<!--  -->
<template>
    <h2>浅拷贝：只拷贝已存在对象的对象属性的引用，非对象占用新的内存空间不与原对象共享</h2>
    <h4>浅拷贝方法</h4>
    <div class="shallow_copy">
        <div class="item">
            <p>Array.slice()</p>
        </div>
        <div class="item">
            <p>Array.concat()</p>
            <img src="/static/image/copy_array.concat.png" alt="">
        </div>
        
        <div class="item">
            <p>Object.assign()</p>
            <img src="/static/image/copy_object.assign.png" alt="">
        </div>
        <div class="item">
            <p>解构赋值</p>
            <img src="/static/image/copy_3.png" alt="">
        </div>
    </div>
    <h4>深拷贝方法</h4>
    <div class="deep_copy">
        <div class="item">
            <p>JSON.parse(JSON.stringify())</p>
            <img src="/static/image/copy_deep_json.png">
        </div>
        <!-- <div class="item">
            <p>Array.concat()</p>
            <img src="/static/image/copy_array.concat.png" alt="">
        </div>
        
        <div class="item">
            <p>Object.assign()</p>
            <img src="/static/image/copy_object.assign.png" alt="">
        </div>
        <div class="item">
            <p>解构赋值</p>
            <img src="/static/image/copy_3.png" alt="">
        </div> -->
    </div>
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