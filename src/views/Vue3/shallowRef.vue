<template>
    <div>
        <p>shallowRef：创建一个响应式引用，但是不会深度响应式对象的属性。</p>
        <p>shallowRef 是一个“只关心 .value 变化，不关心内部属性变化”的 ref。</p>
    </div>
</template>
<script setup>
import { shallowRef,shallowReactive } from 'vue'

</script>
