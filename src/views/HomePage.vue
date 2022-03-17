<template>
    <div class="home_wrap">
        <div class="home_page">
            <p>当前 <span>node</span> 版本为 16.7.0</p>
            <p>当前 <span>npm</span> 版本为 7.20.3</p>
            <p>当前 <span>@vue/cli</span> 版本为 5.0.1</p>
            <p>当前 <span>vue</span> 版本为 3.2.31-->2.6.14</p>
            <p>当前 <span>vue-router</span> 版本为 4.0.12-->3.5.3</p>
            <p>当前 <span>vuex</span> 版本为 4.0.2-->3.6.2</p>
        </div>
        <div class="layout">
            <div class="layout_menu">
                <ul>
                    <li
                        v-for="(menu, index) in menus"
                        :key="menu + index"
                        @click="toPage(menu)"
                    >
                        {{ menu.meta.name }}
                    </li>
                </ul>
            </div>
            <div class="layout_content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    computed: {
        //菜单列表
        menus() {
            return this.$router.options.routes[0].children
        },
    },
    mounted() {
        console.log(this.$router.options.routes[0].children)
    },
    methods: {
        toPage(menu) {
            this.$router.push(menu.path)
        },
    },
}
</script>

<style lang="less">
@import './../styles/home_page.less';
</style>
