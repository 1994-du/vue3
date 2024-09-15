<template>
    <el-button>{{ msg }}</el-button>
</template>
<script setup>
import { ElButton } from 'element-plus';
const props = defineProps({
  msg: String
})
</script>