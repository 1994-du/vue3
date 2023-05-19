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
            </div>
        </el-drawer>
    </div>
</template>

<script>
import animation from "@/json/animation.json"
export default {
    name: 'KeyFrames',
    components: {},
    data() {
        return {
            animation: animation,
            drawer: false,
            direction: 'rtl'
        };
    },
    computed: {},
    watch: {},
    methods: {

    },
    created() {
        // this.$axios.get('/user', {
        //     params: {
        //     ID: 12345
        //     }
        // })
        // .then(function (response) {
        //     console.log(response);
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
    },
    mounted() {
        console.log(animation)
    },
    beforeCreate() { },
    beforeMount() { },
    beforeUpdate() { },
    updated() { },
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="less" scoped>
@import "@/styles/animation.less";
</style>