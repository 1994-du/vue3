<template>
    <div class="modal_wrap" @click="closeModal">
        <div class="modal_inner">
            <div class="modal_input">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 1024 1024">
                    <path 
                        fill="#42b883" 
                        d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704">
                    </path>
                </svg>
                <el-input v-model="menuIpt" @keydown="menuSearch(menuIpt)" placeholder="搜索文档"></el-input>
                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" @click="clearSearch">
                    <!-- 画一条黑色的直线 -->
                    <line x1="0" y1="0" x2="20" y2="20" stroke="#42b883" stroke-width="2"/>
                    <line x1="20" y1="0" x2="0" y2="20" stroke="#42b883" stroke-width="2"/>
                </svg>
            </div>
            <div class="modal_content">
                <div class="modal_item">casca</div>
                <div class="modal_item"></div>
                <div class="modal_item"></div>
                <div class="modal_item"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref,defineEmits } from 'vue'
const emit = defineEmits(['update:modelValue'])
let menuIpt = ref('')
// 筛选结果
let filterMenu = ref([])
// 搜索
const menuSearch = (val) => {
    console.log('val',val);
    // 获取菜单数据并过滤
    

}
// 清空搜索
const clearSearch = () => {
    menuIpt.value = ''
}
// 关闭弹窗
const closeModal = (e) => {
    if(e.target.className === 'modal_wrap'){
        emit('update:modelValue',false)
    }
}
</script>
<style scoped lang='less'>
.modal_wrap{
    width: 100%;
    height: 100%;
    background: rgba(101,108,133,.8);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    .modal_inner{
        width: 560px;
        min-height: 208px;
        margin: 60px auto;
        background-color: #242424;
        padding: 12px;
        border-radius: 6px;
        .modal_input{
            width: 100%;
            height: 56px;
            border: 1px solid #42b883;
            border-radius: 4px;
            display: flex;
            align-items: center;
            background-color: #2f2f2f;
            :deep(.el-input){
                background-color: #2f2f2f;
                height: 100%;
                // border: none;
                .el-input__wrapper{
                    background-color: #2f2f2f;
                    box-shadow: none;
                    padding: 0;
                    .el-input__inner{
                        height: 100%;
                        font-size: 20px;
                        font-weight: 400;
                    }
                }
            }
            svg{
                margin: 0 10px;
                cursor: pointer;
            }
        }
        .modal_content{
            margin-top: 10px;
            max-height: 300px;
            overflow-y: auto;
            .modal_item{
                width: 100%;
                height: 56px;
                line-height: 56px;
                padding: 0 12px;
                font-size: 20px;
                font-weight: 400;
                color: rgba(235,235,235,.6);
                cursor: pointer;
                border-radius: 4px;
                background-color: #2f2f2f;
                margin: 5px 0;
                &:hover{
                    background-color: #42b883;
                    color: #fff;
                }
            }
        }
    }
}
</style>