<template>
    <div class="user_info">
        <div class="user_info_title">
            个人信息--{{ userInfo }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { inject, ref } from 'vue'
import useUserInfoStore from '../store/pinia/userInfo'
import { breadcrumbKey } from '@/utils/breadcrumb'

inject(breadcrumbKey)?.setItems([
    { label: '工作台', to: '/home' },
    { label: '个人信息' }
])

// 定义用户信息接口
interface UserInfo {
    name: string
    avatar: string
}

const userInfoStore = useUserInfoStore()
const userInfo = ref<UserInfo>(userInfoStore.userInfo)
</script>
<style scoped>
.user_info {
    height: 100%;
    padding: 20px;
    background-color: var(--background);
    color: var(--fontColor);
}
.user_info_title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
}
</style>