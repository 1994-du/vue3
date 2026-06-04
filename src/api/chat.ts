import axios from './index'

/**
 * @description 聊天
 */
export const toChatDeepSeek = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/deepseek/chat',
            method: 'post',
            needAuth: true,
            operationType: 'operate',
            data
        } as any).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}
