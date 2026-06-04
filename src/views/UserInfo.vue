<template>
    <div class="user_info">
        <div class="user_info_title">
            个人信息--{{ userInfo }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import useUserInfoStore from '../store/pinia/userInfo'

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