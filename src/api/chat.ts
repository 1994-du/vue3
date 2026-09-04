import axios from './index'

/**
 * @description 聊天
 */
export const toChatDeepSeek = (data: any) => {
    return axios({
        url: '/deepseek/chat',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    } as any)
}
