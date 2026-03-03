<template>
    <div class="menu_management_wrap">
        <header>
            <el-button type="primary" @click="createMenu">新建菜单</el-button>
        </header>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMenus, setMenus} from '../api/api'
const defaultProps = {
  children: 'children',
  label: 'menuName',
}
const createMenu = ()=>{
    console.log('创建菜单')
}
</script>
