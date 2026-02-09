
<template>
    <div>
        <p>toRef：把一个响应式对象的属性，转换为一个 ref。</p>
        <p>toRefs：把一个响应式对象里的每个属性，都“拆”成单独的 ref，而且还保持响应式联动。</p>
        <div>
            <p>angleCount: {{ angleCount }}</p>
            <p>angleCountA: {{ angleCountA }}</p>
            <p>count: {{ count }}</p>
            <p>count2: {{ count2 }}</p>
            <dx-button type="primary" @click="count++">增加count</dx-button>
            <dx-button type="danger" @click="count--">减少count</dx-button>
            <dx-button type="primary" @click="count2++">增加count2</dx-button>
            <dx-button type="danger" @click="count2--">减少count2</dx-button>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref,toRef,toRefs } from 'vue'
import { dxButton } from '@1994-du/vue3-ui'
const objA = reactive({
    count: 0,
    name: '张三',
})
const obj = ref({
    count: 0,
    name: '张三',
})
const obj2 = reactive({
    count: 0,
    name: '张三',
})
const angleCount = toRef(obj.value,'count')
const angleCountA = toRef(objA,'count')
const { count,name } = toRefs(obj.value)  
const { count:count2,name:name2 } = toRefs(obj2)
</script>