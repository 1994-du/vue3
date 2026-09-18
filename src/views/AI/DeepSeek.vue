<template>
    <section class="ds">
        <header class="ds-head">
            <div class="ds-head__copy">
                <span class="kicker">DeepSeek · Chat</span>
                <h1 class="ds-title grad-text">对话工作台</h1>
                <p class="ds-sub">向 DeepSeek 提问，回复会保留在当前会话中；清空后即可开一段新的对话。</p>
            </div>
            <button v-if="messages.length" type="button" class="ds-reset" @click="reset">
                清空会话
            </button>
        </header>

        <div ref="threadRef" class="ds-thread">
            <div v-if="!messages.length" class="ds-empty">
                <span class="ds-empty__mark" aria-hidden="true">
                    <SvgIcon name="deepseek" />
                </span>
                <h2>还没有消息</h2>
                <p>从一个具体的问题开始，回答会出现在这里。</p>
                <ul class="ds-prompts">
                    <li v-for="prompt in prompts" :key="prompt">
                        <button type="button" @click="applyPrompt(prompt)">{{ prompt }}</button>
                    </li>
                </ul>
            </div>

            <div v-else class="msg_list">
                <article
                    v-for="item in messages"
                    :key="item.id"
                    class="msg"
                    :class="`msg--${item.type}`">
                    <img
                        v-if="item.type === 'user'"
                        class="msg__avatar"
                        :src="`${preUrl}${avatar}`"
                        alt="">
                    <span v-else class="msg__avatar msg__avatar--bot" aria-hidden="true">
                        <SvgIcon name="deepseek" />
                    </span>
                    <div class="msg__body">{{ item.content }}</div>
                </article>
            </div>
        </div>

        <form class="ds-composer" @submit.prevent="send">
            <el-input
                v-model="input"
                :disabled="pending"
                placeholder="给 DeepSeek 发消息…"
                aria-label="消息内容" />
            <el-button type="primary" native-type="submit" :loading="pending">发送</el-button>
        </form>
    </section>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { toChatDeepSeek } from '@/api/chat'
import useUserInfoStore from '@/store/pinia/userInfo'

interface MessageItem {
    id: number
    type: 'user' | 'assistant'
    content: string
}

const userInfoStore = useUserInfoStore()
const avatar = userInfoStore.userInfo.avatar
const preUrl = `${import.meta.env.VITE_PROXY}`.replace(/\/$/, '')

const input = ref('')
const pending = ref(false)
const messages = ref<MessageItem[]>([])
const threadRef = ref<HTMLElement | null>(null)

const prompts = [
    '用三句话解释事件循环',
    '帮我 review 这段 Vue 3 代码',
    '写一个防抖函数并说明边界情况'
]

let seed = 0
const nextId = () => {
    seed += 1
    return Date.now() + seed
}

const scrollToLatest = async () => {
    await nextTick()
    const el = threadRef.value
    if (el) el.scrollTop = el.scrollHeight
}

const applyPrompt = (prompt: string) => {
    input.value = prompt
}

const reset = () => {
    messages.value = []
    input.value = ''
}

const send = async () => {
    const content = input.value.trim()
    if (!content || pending.value) return

    messages.value.push({ id: nextId(), type: 'user', content })
    input.value = ''
    pending.value = true
    await scrollToLatest()

    try {
        const res = await toChatDeepSeek({ message: content }) as { data: string }
        const reply = JSON.parse(res.data)?.choices?.[0]?.message?.content
        messages.value.push({
            id: nextId(),
            type: 'assistant',
            content: reply || '（没有拿到内容，请重试）'
        })
    } catch (error) {
        console.error('DeepSeek request failed:', error)
        messages.value.push({
            id: nextId(),
            type: 'assistant',
            content: '请求失败，请检查网络或稍后重试。'
        })
        ElMessage.error('DeepSeek 请求失败')
    } finally {
        pending.value = false
        await scrollToLatest()
    }
}
</script>

<style scoped lang="scss">
@use '@/styles/deepseek.scss' as *;
</style>
