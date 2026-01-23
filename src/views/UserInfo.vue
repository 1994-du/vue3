<template>
    <div class="user_info">
        <div class="user_info_title">
            个人信息--{{ userInfo }}
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import useUserInfoStore from '../store/pinia/userInfo'
const userInfoStore = useUserInfoStore()
const userInfo = ref(userInfoStore.userInfo)
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