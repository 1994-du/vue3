<template>
    <div class="ellipsis-container">
        <!-- 判断是否溢出 -->
        <el-popover
            :content="content"
            placement="top"
            width="400"
            trigger="hover"
            v-if="isOverflow">
            <template #reference>
                <div class="ellipsis-text">
                    {{ content }}
                </div>
            </template>
        </el-popover>
      <!-- 不溢出时直接渲染 -->
      <div v-else class="text_overflow" ref="textRef">
        {{ content }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, nextTick } from 'vue';
  
  // 接收外部传入的文字内容
  const props = defineProps({
    content: {
      type: String,
      required: true
    }
  });
  
  const textRef = ref(null); // 文本元素的 DOM 引用
  const isOverflow = ref(false); // 是否文本溢出
  
  // 检测文本是否溢出
  const checkOverflow = () => {
    const el = textRef.value;
    if (el) {
        console.log('scrollHeight',el.scrollHeight);
        console.log('offsetHeight',el.offsetHeight);
        
        
      // 判断内容的实际高度是否大于容器高度
      isOverflow.value = el.scrollHeight > el.offsetHeight;
    }
  };
  
  // 初次渲染时检查是否溢出
  onMounted(() => {
    nextTick(() => checkOverflow());
  });
  
  // 监听内容变化重新检测
  watch(() => props.content, () => {
    nextTick(() => checkOverflow());
  });
  </script>
  
  <style scoped>
  .ellipsis-container {
    position: relative;
    max-width: 100%;
  }
  
  .ellipsis-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    -webkit-line-clamp: 2; /* 限制显示两行 */
    line-clamp: 2; /* Modern browsers */
    white-space: normal; /* 防止单行文本溢出 */
  }
  .text_overflow{
    text-align: left;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: auto;
    text-overflow: ellipsis;
    word-break: break-word;
    -webkit-line-clamp: 2; /* 限制显示两行 */
    line-clamp: 2; /* Modern browsers */
    white-space: normal; /* 防止单行文本溢出 */
  }
  .text_overflow::-webkit-scrollbar {
    display: none; /* 隐藏滚动条 */
  }
  </style>