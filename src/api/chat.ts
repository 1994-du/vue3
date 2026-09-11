import axios from './index'
import type { ApiResponse } from './types'

/**
 * @description 聊天
 */
export interface ChatRequest {
    message: string
}

export const toChatDeepSeek = (data: ChatRequest): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/deepseek/chat',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    })
}
