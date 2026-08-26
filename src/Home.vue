<template>
    <ModalSearch v-if="isShowSearch" v-model="isShowSearch" />
    <div ref="layoutRootRef" class="layout">
        <button
            v-if="isMobileMenuOpen"
            type="button"
            class="menu-overlay"
            aria-label="关闭导航"
            @click="isMobileMenuOpen = false">
        </button>

        <aside
            class="layout_menu"
            :class="{
                collapsed: effectiveMenuCollapse,
                'mobile-open': isMobileMenuOpen
            }">
            <button type="button" class="layout_menu_logo" @click="goHome">
                <span class="brand-mark">KE</span>
                <span v-show="!effectiveMenuCollapse" class="brand-copy">
                    <strong>Knowledge Engine</strong>
                    <small>Workspace</small>
                </span>
            </button>

            <div class="menu_scroll_container" ref="menuScrollContainerRef">
                <NativeMenu
                    :menu-config="menuConfig"
                    :collapse="effectiveMenuCollapse"
                    :active-path="onRoutes"
                    @menu-click="handleMenuClick"
                />
            </div>

            <button
                type="button"
                class="custome_menu_btn"
                :aria-label="isCollapse ? '展开导航' : '收起导航'"
                :title="isCollapse ? '展开导航' : '收起导航'"
                @click="collapse">
                <el-icon v-if="!isCollapse"><ArrowLeft /></el-icon>
                <el-icon v-else><ArrowRight /></el-icon>
                <span v-if="!isCollapse">收起导航</span>
            </button>
        </aside>

        <section class="layout_container">
            <header class="topbar">
                <div class="header_left">
                    <button
                        type="button"
                        class="mobile-menu-button"
                        aria-label="打开导航"
                        title="打开导航"
                        @click="isMobileMenuOpen = true">
                        <el-icon><Menu /></el-icon>
                    </button>
                    <div class="route-heading">
                        <span>Workspace</span>
                        <strong>{{ currentPageTitle }}</strong>
                    </div>
                </div>

                <div class="header_right">
                    <HeaderSearch @click="openSearchModal" />
                    <ThemeSwitch />
                    <span class="topbar-divider" aria-hidden="true"></span>
                    <el-dropdown placement="bottom-end" @command="handleCommand">
                        <button type="button" class="user-trigger">
                            <el-avatar :size="34" :src="avatarUrl">
                                {{ userInitial }}
                            </el-avatar>
                            <span class="user-copy">
                                <strong>{{ userInfoStore.userInfo.name || '用户' }}</strong>
                                <small>当前账号</small>
                            </span>
                            <el-icon class="user-chevron"><ArrowDown /></el-icon>
                        </button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="userInfo">
                                    <el-icon><User /></el-icon>
                                    个人信息
                                </el-dropdown-item>
                                <el-dropdown-item divided command="loginOut">
                                    <el-icon><SwitchButton /></el-icon>
                                    退出登录
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </header>

            <main ref="contentShellRef" class="layout_content">
                <router-view v-slot="{ Component, route: renderedRoute }">
                    <Transition
                        :css="false"
                        mode="out-in"
                        appear
                        @enter="handleRouteEnter"
                        @leave="handleRouteLeave">
                        <div :key="renderedRoute.fullPath" class="route-stage">
                            <component :is="Component" />
                        </div>
                    </Transition>
                </router-view>
            </main>
        </section>
    </div>
</template>

<script setup>
import ModalSearch from '@/components/ModalSearch.vue'
import HeaderSearch from '@/components/HeaderSearch.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import NativeMenu from '@/components/NativeMenu.vue'
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Menu,
    SwitchButton,
    User
} from '@element-plus/icons-vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { gsap } from 'gsap'
import useUserInfoStore from '@/store/pinia/userInfo'
import { loginOutEffect } from '@/utils/tokenManager'
import { toLoginOut } from '@/api/auth'
import { findDefaultPath } from '@/utils/generateRoutes'
import { resolveMenuFullPath } from '@/utils/menuRoute'

const preUrl = `${import.meta.env.VITE_PROXY}`.replace(/\/$/, '')
const userInfoStore = useUserInfoStore()
const router = useRouter()
const route = useRoute()
const layoutRootRef = ref(null)
const contentShellRef = ref(null)
const menuScrollContainerRef = ref(null)
const isShowSearch = ref(false)
const isMobileMenuOpen = ref(false)
const isCollapse = ref(JSON.parse(localStorage.getItem('menuCollapse') || 'false'))
let layoutAnimationMedia = null
let routeTween = null

const onRoutes = computed(() => route.path)
const menuConfig = computed(() => userInfoStore.menus)
const effectiveMenuCollapse = computed(() => isCollapse.value && !isMobileMenuOpen.value)
const avatarUrl = computed(() => {
    const avatar = userInfoStore.userInfo.avatar
    if (!avatar) return ''
    if (/^(https?:)?\/\//.test(avatar) || avatar.startsWith('data:')) return avatar
    return `${preUrl}${avatar.startsWith('/') ? avatar : `/${avatar}`}`
})
const userInitial = computed(() => (userInfoStore.userInfo.name || 'U').trim().slice(0, 1).toUpperCase())

const findMenuTitle = (menus, targetPath, parentPath = '') => {
    for (const menu of menus) {
        const fullPath = resolveMenuFullPath(parentPath, menu.path)
        if (fullPath === targetPath) return menu.name
        if (menu.children?.length) {
            const childTitle = findMenuTitle(menu.children, targetPath, fullPath)
            if (childTitle) return childTitle
        }
    }
    return ''
}

const currentPageTitle = computed(() => {
    return route.meta.title || findMenuTitle(userInfoStore.menus, route.path) || '知识工作台'
})

const collapse = () => {
    isCollapse.value = !isCollapse.value
    localStorage.setItem('menuCollapse', JSON.stringify(isCollapse.value))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    nextTick(() => {
        const mark = layoutRootRef.value?.querySelector('.brand-mark')
        if (!mark) return
        gsap.fromTo(
            mark,
            { scale: 0.84, rotation: -8 },
            {
                scale: 1,
                rotation: 0,
                duration: 0.42,
                ease: 'back.out(2.2)',
                clearProps: 'transform',
                overwrite: 'auto'
            }
        )
    })
}

const handleRouteEnter = (element, done) => {
    contentShellRef.value?.scrollTo({ top: 0, left: 0 })
    routeTween?.kill()

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(element, { clearProps: 'all' })
        done()
        return
    }

    routeTween = gsap.fromTo(
        element,
        { autoAlpha: 0, y: 18, scale: 0.995 },
        {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.48,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
            overwrite: 'auto',
            onComplete: done
        }
    )
}

const handleRouteLeave = (element, done) => {
    routeTween?.kill()

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        done()
        return
    }

    routeTween = gsap.to(element, {
        autoAlpha: 0,
        y: -8,
        duration: 0.18,
        ease: 'power2.in',
        overwrite: 'auto',
        onComplete: done
    })
}

const initLayoutAnimations = () => {
    if (!layoutRootRef.value) return

    layoutAnimationMedia = gsap.matchMedia()
    layoutAnimationMedia.add(
        {
            isDesktop: '(min-width: 901px)',
            reduceMotion: '(prefers-reduced-motion: reduce)'
        },
        context => {
            const { isDesktop, reduceMotion } = context.conditions
            if (reduceMotion) return

            const timeline = gsap.timeline({
                defaults: { duration: 0.46, ease: 'power3.out' }
            })

            if (isDesktop) {
                timeline
                    .from('.layout_menu', { autoAlpha: 0, x: -28, duration: 0.62 }, 0)
                    .from('.layout_menu_logo > *', { autoAlpha: 0, x: -10, stagger: 0.07 }, 0.16)
                    .from(
                        '.menu_scroll_container .dx-menu > *',
                        { autoAlpha: 0, x: -12, duration: 0.36, stagger: 0.025 },
                        0.26
                    )
                    .from('.custome_menu_btn', { autoAlpha: 0, y: 10, duration: 0.36 }, 0.38)
            }

            timeline
                .from('.topbar', { autoAlpha: 0, y: -18, duration: 0.56 }, 0.08)
                .from('.route-heading > *', { autoAlpha: 0, y: 8, stagger: 0.06 }, 0.2)
                .from('.header_right > *', { autoAlpha: 0, x: 10, stagger: 0.055 }, 0.24)
        },
        layoutRootRef.value
    )
}

const goHome = async () => {
    const defaultPath = findDefaultPath(userInfoStore.menus)
    isMobileMenuOpen.value = false
    if (route.path !== defaultPath) {
        await router.push(defaultPath)
    }
}

const saveScrollPosition = () => {
    if (!menuScrollContainerRef.value) return
    localStorage.setItem('menuScrollPosition', JSON.stringify({
        scrollTop: menuScrollContainerRef.value.scrollTop,
        scrollLeft: menuScrollContainerRef.value.scrollLeft
    }))
}

const restoreScrollPosition = () => {
    let savedPosition = {}
    try {
        savedPosition = JSON.parse(localStorage.getItem('menuScrollPosition') || '{}')
    } catch {
        savedPosition = {}
    }

    nextTick(() => {
        if (menuScrollContainerRef.value && savedPosition.scrollTop !== undefined) {
            menuScrollContainerRef.value.scrollTop = savedPosition.scrollTop
            menuScrollContainerRef.value.scrollLeft = savedPosition.scrollLeft || 0
        }
    })
}

const handleMenuClick = async (path) => {
    isMobileMenuOpen.value = false
    if (route.path === path) return
    localStorage.setItem('currentMenuPath', path)
    saveScrollPosition()
    await router.push(path)
}

const openSearchModal = () => {
    isShowSearch.value = true
}

const handleCommand = async (command) => {
    if (command === 'loginOut') {
        try {
            const res = await toLoginOut({})
            if (res.code === 200) await loginOutEffect()
        } catch {
            await loginOutEffect()
        }
        return
    }

    if (command === 'userInfo') {
        await router.push('/userInfo')
    }
}

const handleGlobalKeydown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') {
        event.preventDefault()
        isShowSearch.value = true
    }
    if (event.key === 'Escape') {
        isShowSearch.value = false
        isMobileMenuOpen.value = false
    }
}

onMounted(() => {
    restoreScrollPosition()
    menuScrollContainerRef.value?.addEventListener('scroll', saveScrollPosition)
    window.addEventListener('keydown', handleGlobalKeydown)
    initLayoutAnimations()
})

onBeforeUnmount(() => {
    layoutAnimationMedia?.revert()
    routeTween?.kill()
    menuScrollContainerRef.value?.removeEventListener('scroll', saveScrollPosition)
    window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style lang="scss">
@use '@/styles/home.scss';
</style>
