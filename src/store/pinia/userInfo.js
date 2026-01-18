import { defineStore } from 'pinia'
const useUserInfoStore = defineStore('userInfo',{
    state:()=>{
        return {
            userInfo:{
                name:'default',
                age:0
            },
            menus:[]
        }
    },
    getters:{
        doubleCount:(state)=>{
            return state.age*2
        }
    },
    actions:{
        setMenus(menus){
            this.menus = menus
        },
        setUserInfo(userInfo){
            this.userInfo = Object.assign({},this.userInfo,userInfo)
        },
        increment(){
            this.userInfo.age++
        },
        decrement(){
            this.userInfo.age--
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'userInfo',
                storage: localStorage,
                paths: ['userInfo']
            },
            {
                key: 'menus',
                storage: localStorage,
                paths: ['menus']
            }
        ]
    }
})
export default useUserInfoStore