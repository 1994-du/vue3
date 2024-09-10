<template>
<el-button v-popover="popoverRef" v-click-outside="onClickOutside"><slot/></el-button>
<el-popover
    ref="popoverRef"
    placement="bottom-start"
    trigger="click">
</el-popover>
</template>
<script setup>
import { ref } from "vue";
let popoverRef = ref(null);
let onClickOutside = () => {
    popoverRef.value.hide();
};
</script>
<style lang='scss' scoped>
</style>