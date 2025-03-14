<template>
    <div class="header_inner">
        <button class="header_search">
            <span class="search_icon">
                <el-icon><Search/></el-icon>
                <span class="search_text">搜索</span>
            </span>
            <span class="search_btn">
                <span>{{currentKey}}F</span>
            </span>
        </button>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
let currentKey = ref('Ctrl')
// 键盘事件
onMounted(()=>{
    if(window.navigator.userAgent.includes('Macintosh')){
        currentKey.value = '\u2318';
    }else{
        currentKey.value = 'Ctrl'
    }
})
</script>
<style scoped lang='less'>
@headerTextColor:rgba(235,235,235,0.6);

.header_inner{
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 32px;
    border-bottom: 1px solid rgba(84, 84, 84, .48);
    .header_search{
        height: 100%;
        border: none;
        background: transparent;
        display: flex;
        align-items: center;
        outline: none;
        .search_icon{
            display: flex;
            align-items: center;
            font-size: 13px;
            color: @headerTextColor;
            .el-icon{
                margin-right: 10px;
            }
            .search_text{
                margin-right: 10px;
            }
        }
        .search_btn{
            color: @headerTextColor;
            height: 22px;
            line-height: 22px;
            padding: 0 6px;
            border-width: 1px;
            border-style: solid;
            border-color: rgba(235, 235, 235, .38);
            border-radius: 4px;
            font-size: 12px;
        }
        &:hover{
            color: #42b883;
            .search_icon{
                color: white;
            }
            .search_btn{
                border-color: #42b883;
                color: #42b883;
            }
        }
    }
}
</style>