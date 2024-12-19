<template>
    <div ref="wrapperRef" class="text_popover">
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
			<template #default>
				<div class="popover_textover">
					<p>{{ content }}</p>
				</div>
			</template>
		</el-popover>
		<!-- 不溢出时直接渲染 -->
		<div ref="textRef" class="text_overflow" :class="isOverflow?'opct0':''">{{ content }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, nextTick,onBeforeUnmount } from 'vue';
  let wrapperRef = ref(null);
  let textRef = ref(null);
  // 接收外部传入的文字内容
  const props = defineProps(['content']);
  const isOverflow = ref(false); // 是否文本溢出
  
  // 检测文本是否溢出
  const checkOverflow = () => {
    const el = textRef.value;
	console.log('el',el);
	
    if (el) {
		console.log('scrollHeight',el.scrollHeight);
		console.log('offsetHeight',el.offsetHeight);
		// 判断内容的实际高度是否大于容器高度
		isOverflow.value = el.scrollHeight > el.offsetHeight;
    }
  };
  // 监听内容变化重新检测
  watch(() => props.content, () => {
	console.log('watch');
	
    nextTick(() => checkOverflow());
  });
  const resizeObserver = new ResizeObserver(() => {
      nextTick(() => checkOverflow());
  })
  // 初次渲染时检查是否溢出
  onMounted(() => {
    nextTick(() => checkOverflow());
	resizeObserver.observe(wrapperRef.value);
  });
  onBeforeUnmount(() => {
    resizeObserver.unobserve(wrapperRef.value);
  })
  
  </script>
  
  <style lang="scss" scoped>
  .text_popover {
    position: relative;
    .opct0{
        opacity: 0;
		position: absolute;
		z-index: -1;
    }
  }
  .ellipsis-text {
	text-align: left;
	line-height: 21px;
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
    height: 42px;
	line-height: 21px;
	text-align: left;
	overflow: auto;
  }
  .popover_textover{
	max-height: 100px;
	overflow-y: auto;
  }
  .popover_textover::-webkit-scrollbar {
      width:5px;
  }
  .popover_textover::-webkit-scrollbar-thumb {
      background:rgb(224, 224, 224);
	  border-radius: 50px;
  }
  </style>