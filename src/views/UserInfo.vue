<template>
    <div class="page">
        <section class="panel">
            <header class="panel__head">
                <div>
                    <h2 class="panel__title">个人信息</h2>
                    <p class="panel__meta">读自本地持久化存储，非实时接口数据</p>
                </div>
            </header>
            <div class="panel__body">
                <div class="stat-grid">
                    <div class="stat">
                        <span class="stat__label">NAME</span>
                        <span class="stat__value">{{ userInfo.name }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">USERNAME</span>
                        <span class="stat__value">{{ userInfo.username || '—' }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat__label">AVATAR</span>
                        <span class="stat__value">{{ userInfo.avatar ? '已设置' : '未设置' }}</span>
                    </div>
                </div>

                <div class="kv-grid user-info__kv">
                    <div class="kv">
                        <span class="kv__k">avatar.url</span>
                        <span class="kv__v" :class="{ 'is-bad': !userInfo.avatar }">
                            {{ userInfo.avatar || '空' }}
                        </span>
                    </div>
                </div>
            </div>
        </section>
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
    username?: string
}

const userInfoStore = useUserInfoStore()
const userInfo = ref<UserInfo>(userInfoStore.userInfo)
</script>
<style scoped>
/* 页面根节点不写 padding：.layout_content 已统一负责 16px，再叠会变成 36px。 */
.user-info__kv {
    margin-top: 12px;
}
</style>
