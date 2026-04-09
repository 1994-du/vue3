<template>
    <h2>DeepSeek</h2>
    <div class="msg_box">
        <div v-for="item in msg_box" :key="item.id" class="text-left my-[10px]">
            <div v-if="item.type==='user'" class="flex user">
                <span>{{item.content}}</span>
                <img :src="`${preUrl}${avatar}`" alt="">
            </div>
            <div v-else class="flex assistant">
                <SvgIcon name="deepseek" />
                <span>{{item.content}}</span>
            </div>
        </div>
    </div>
    <div class="flex gap-[10px]">
        <el-input v-model="input" placeholder="请输入" @keyup.enter="send"></el-input>
        <el-button type="primary" @click="send">发送</el-button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { toChatDeepSeek } from '@/api/chat'
import useUserInfoStore from '@/store/pinia/userInfo'
const userInfoStore = useUserInfoStore()
const avatar = userInfoStore.userInfo.avatar
const input = ref('')
const preUrl = `${import.meta.env.VITE_PROXY}`.replace(/\/$/, '')
const msg_box = ref([])
const send = async () => {
    msg_box.value.push({
        type: 'user',
        id: Date.now(),
        content: input.value
    })
    await toChatDeepSeek({
        message: input.value
    }).then(res=>{
        console.log('聊天成功',res)
        let content = JSON.parse(res.data).choices[0].message.content
        msg_box.value.push({
            type: 'assistant',
            id: Date.now(),
            content
        })

        input.value = ''
    }).catch(err=>{
        console.log('聊天失败',err)
   })
}
</script>
<style scoped lang="scss">
@import '@/styles/deepseek.scss';
</style>
