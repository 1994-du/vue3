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
                    placeholder="搜索菜单">
                </el-input>
                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" @click="clearSearch">
                    <line x1="0" y1="0" x2="20" y2="20" stroke="#42b883" stroke-width="2"/>
                    <line x1="20" y1="0" x2="0" y2="20" stroke="#42b883" stroke-width="2"/>
                </svg>
            </div>
            <div class="modal_content">
                <div class="modal_item" v-for="(item,index) in filterMenu" :key="index + 'r'" @click="toMenu(item.menuLink)">
                    {{ item.menuName }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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

const closeModal = (e) => {
    if (e.target.className === 'modal_wrap') {
        emit('update:modelValue', false)
    }
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
