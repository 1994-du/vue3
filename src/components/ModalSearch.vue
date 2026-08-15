<template>
    <div class="modal_wrap" role="dialog" aria-modal="true" aria-label="搜索菜单" @click.self="closeModal">
        <div class="modal_inner">
            <div class="modal_input">
                <el-icon class="modal_search_icon"><Search /></el-icon>
                <el-input
                    v-focus
                    v-model="menuIpt"
                    @compositionstart="setIpt(true)"
                    @compositionend="setIpt(false)"
                    @input="menuSearch(menuIpt)"
                    placeholder="搜索菜单名称">
                </el-input>
                <button type="button" class="modal_close" aria-label="关闭搜索" title="关闭搜索" @click="closeSearch">
                    <el-icon><Close /></el-icon>
                </button>
            </div>
            <div class="modal_content">
                <button
                    type="button"
                    class="modal_item"
                    v-for="item in filterMenu"
                    :key="item.menuLink"
                    @click="toMenu(item.menuLink)">
                    <span>{{ item.menuName }}</span>
                    <el-icon><ArrowRight /></el-icon>
                </button>
                <div v-if="menuIpt && !filterMenu.length" class="modal_empty">未找到匹配菜单</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Close, Search } from '@element-plus/icons-vue'
import useUserInfoStore from '@/store/pinia/userInfo'
import { resolveMenuFullPath } from '@/utils/menuRoute'

const router = useRouter()
const userInfoStore = useUserInfoStore()
const emit = defineEmits(['update:modelValue'])

let menuIpt = ref('')
let menuData = ref([])
let filterMenu = ref([])
let isComposition = ref(false)

const setIpt = (val) => {
    isComposition.value = val
}

const menuSearch = (val) => {
    if (val === '') {
        filterMenu.value = []
        return
    }
    if (isComposition.value) return
    filterMenu.value = menuData.value.filter(item => item.menuName.includes(val) && !item.children)
}

const clearSearch = () => {
    menuIpt.value = ''
    filterMenu.value = []
}

const closeModal = () => {
    emit('update:modelValue', false)
}

const closeSearch = () => {
    clearSearch()
    closeModal()
}

const transformData = (data, parentPath = '', arr = []) => {
    let newData = [...arr]
    data.forEach(item => {
        const fullPath = resolveMenuFullPath(parentPath, item.path)
        newData.push({
            menuName: item.name,
            menuLink: fullPath,
            children: !!item.children?.length
        })
        if (item.children?.length) {
            newData = [...transformData(item.children, fullPath, newData)]
        }
    })
    return newData
}

const getMenuDataBtn = () => {
    menuData.value = transformData(userInfoStore.menus)
}

const toMenu = (link) => {
    router.push(link)
    emit('update:modelValue', false)
}

onMounted(() => {
    getMenuDataBtn()
})
</script>
<style scoped lang='scss'>
@use '@/styles/ModalSearch.scss';
</style>
