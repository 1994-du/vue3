<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
// tab切换
const activeName = ref('menuManagement');
const defaultActive =  computed(()=>{
    return route.path.split('/')[2]
})
// 菜单选择
const handleSelect = (tab) => {
    activeName.value = tab;
    router.replace('/set/'+tab)
}
</script>
<style lang='scss' scoped>
@use '@/styles/setPage.scss';
</style>