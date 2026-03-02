<template>
  <div
    ref="containerRef"
    class="editor-container"
  >
    <MonacoEditor
      :value="props.code"
      language="javascript"
      theme="vs-dark"
      :options="editorOptions"
      @mount="handleMount"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import MonacoEditor from "@guolao/vue-monaco-editor"
import type * as monaco from "monaco-editor"
const props = defineProps({
  code: {
    type: String,
    default: `function hello() {
      console.log("Hello Monaco")
    }`
  },
  readOnly: {
    type: Boolean,
    default: true
  },
})

const containerRef = ref<HTMLElement | null>(null)
let editorInstance: monaco.editor.IStandaloneCodeEditor

const editorOptions = {
  readOnly: props.readOnly,
  automaticLayout: true, // 🔥 关闭自动布局
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  padding:{
    top: 20,
    bottom: 20
  },
  scrollbar: {
    handleMouseWheel:false
  }
}

const handleMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
  editorInstance = editor

  const updateHeight = () => {
    const contentHeight = editor.getContentHeight()
    containerRef.value!.style.height = contentHeight + "px"
    editor.layout()
  }

  updateHeight()

  editor.onDidContentSizeChange(() => {
    updateHeight()
  })
}
</script>

<style>
.editor-container {
  width: 100%;
  overflow: hidden; /* 🔥 关键：隐藏滚动条 */
}
</style>