import { defineStore } from 'pinia'
const useCounterStore = defineStore('counter',{
    state:()=>{
        return {
            count:0
        }
    },
    getters:{
        doubleCount:(state)=>{
            return state.count*2
        }
    },
    actions:{
        increment(){
            this.count++
        },
        decrement(){
            this.count--
        }
    }
})
export default useCounterStore