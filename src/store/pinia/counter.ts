import { defineStore } from 'pinia'

interface CounterState {
    count: number
}

const useCounterStore = defineStore('counter', {
    state: (): CounterState => {
        return {
            count: 0
        }
    },
    getters: {
        doubleCount: (state): number => {
            return state.count * 2
        }
    },
    actions: {
        increment(): void {
            this.count++
        },
        decrement(): void {
            this.count--
        }
    }
})

export default useCounterStore
