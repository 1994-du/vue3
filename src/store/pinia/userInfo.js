import { defineStore } from 'pinia'
const useUserInfoStore = defineStore('userInfo',{
    state:()=>{
        return {
            userInfo:{
                name:'default',
                age:0
            }
        }
    },
    getters:{
        doubleCount:(state)=>{
            return state.age*2
        }
    },
    actions:{
        increment(){
            this.userInfo.age++
        },
        decrement(){
            this.userInfo.age--
        }
    }
})
export default useUserInfoStore