import { ref } from 'vue'

/* 一个最小的「共享状态 + 改法」组合式 store。
   provideParts 这份文件的作用，是让祖先和后代表面上各自调用 useTicketStore()，
   拿到的是同一份数据——演示 provide/inject 时不必把 store 也塞进 provide。 */
const ticketCount = ref(0)

export function useTicketStore() {
    return {
        count: ticketCount,
        bump: () => {
            ticketCount.value += 1
        },
        reset: () => {
            ticketCount.value = 0
        },
    }
}
