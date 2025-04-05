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
                <el-input 
                    v-focus
                    v-model="menuIpt" 
                    @compositionstart="setIpt(true)" 
                    @compositionend="setIpt(false)" 
                    @input="menuSearch(menuIpt)" 
                    placeholder="搜索文档">
                </el-input>
                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" @click="clearSearch">
                    <!-- 画一条黑色的直线 -->
                    <line x1="0" y1="0" x2="20" y2="20" stroke="#42b883" stroke-width="2"/>
                    <line x1="20" y1="0" x2="0" y2="20" stroke="#42b883" stroke-width="2"/>
                </svg>
            </div>
            <div class="modal_content">
                <div class="modal_item" v-for="(item,index) in filterMenu" :key="index+'r'" @click="toMenu(item.menuLink)">
                    {{ item.menuName }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref,defineEmits,onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const emit = defineEmits(['update:modelValue'])
let menuIpt = ref('')
// 菜单数据
let menuData = ref([])
// 筛选结果
let filterMenu = ref([])
// 输入框状态
let isComposition = ref(false)
const setIpt = (val) => {
    isComposition.value = val
}
// 搜索
const menuSearch = (val) => {
    if(val === '')return
    if(isComposition.value)return
    // 获取菜单数据并过滤
    filterMenu.value = menuData.value.filter(item => item.menuName.includes(val)&&!item.children)
    console.log('filterMenu',filterMenu.value);
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
const  transformData = (data,arr=[]) =>{
    let newData = [...arr]
    data.forEach(item => {
        newData.push({
            menuName:item.menuName,
            menuLink:item.menuLink,
            children:item.children?true:false
        })
        if(item.children){
            newData = [...transformData(item.children,newData)]
        }
    })
    return newData
}
// 获取菜单数据
const getMenuDataBtn = async () => {
    try {
        const transaction = window.db.transaction(['menus'], 'readonly');
        const objectStore = transaction.objectStore('menus');
        const request = await objectStore.getAll();
        request.onsuccess = (e) => {
            let result = e.target.result
            let currentMenus = result.filter(item => item.username === localStorage.getItem('username'))[0]
            menuData.value = transformData(currentMenus.menus)
        }
    }
    catch (e) {
        console.log('获取菜单数据失败',e);
    }
}
// 跳转菜单
const toMenu = (link) => {
    router.push(link)
    emit('update:modelValue',false)
}
onMounted(() => {
    getMenuDataBtn()
})
</script>
<style scoped lang='scss'>
@use '@/styles/ModalSearch.scss';
</style>