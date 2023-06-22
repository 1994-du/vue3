<!-- keyframes -->
<template>
    <div class="use_keyframes">
        <h1>animation:动画</h1>
        <el-table :data="animation" style="width: 100%;margin:10px 0;" border>
            <el-table-column prop="name" label="属性"></el-table-column>
            <el-table-column prop="content" label="描述"></el-table-column>
            <el-table-column label="值">
                <template #default="scope">
                    <div v-for="(item, index) in scope.row.values" :key="item + index">
                        <span>{{ item }}</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <h4>keyframes:关键帧</h4>
<highlightjs code="
@keyframes animationName{
    from{}
    percentage{}
    to{}
    //或者
    0%{}
    percentage{}
    100%{}
}"></highlightjs>
        <el-button @click="drawer = true">展开{{ drawer }}</el-button>
    </div>
    <div class="el-drawer-wrap">
        <el-drawer :withHeader="false" v-model="drawer" :direction="direction" size="50%">
            <div class="container">
                <div class="img_transform">
                    <img src="/static/image/smallportal.webp" alt="">
                </div>
                <div class="icon1"></div>
                <div class="login">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span>登录</span>
                </div>
                <div class="item"></div>
                <div class="light_ball"></div>
                <bg :width="100"></bg>
                <div class="nxhz">
                    <div class="box1"></div>
                    <div class="box2"></div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>
<script setup>
import bg from '@/components/bg.vue'
import animations from "@/json/animation.json"
import { onActivated, onDeactivated, onUnmounted, ref } from "vue";
let animation = ref(animations)
let drawer = ref(false)
let direction = ref('rtl')

</script>
<style lang="less" scoped>
@import "@/styles/animation.less";
</style>