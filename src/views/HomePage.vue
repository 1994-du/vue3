<template>
  <div>
    <!-- 绑定到按钮上的el-popover -->
    <el-popover
      ref="popover"
      placement="top"
      title="标题"
      width="200"
      trigger="hover"
      content="这是一段内容, 这是一段内容, 这是一段内容。"
    >
    </el-popover>
    
    <!-- 触发popover的按钮 -->
    <el-button v-popover:popover>悬停我</el-button>
  </div>
</template>
 
<script>
export default {
  // 你的组件数据和方法
};
</script>