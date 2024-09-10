<template>
  <div v-click-outside="onClickOutSide">
    <!-- 绑定到按钮上的el-popover -->
    <el-popover
      ref="popoverRef"
      placement="top"
      title="标题"
      width="200"
      virtual-triggering
      trigger="click">
      <span> Some content </span>
    </el-popover>
    <!-- 触发popover的按钮 -->
    <el-button v-popover="popoverRef">悬停我</el-button>
  </div>
</template>
 
<script setup>
import { ref } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'
let popoverRef = ref(null)
const onClickOutSide = () => {
  popoverRef.value.hide()
}
</script>