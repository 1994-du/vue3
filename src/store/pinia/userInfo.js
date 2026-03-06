import { defineStore } from 'pinia'
const useUserInfoStore = defineStore('userInfo',{
    state:()=>{
        return {
            userInfo:{
                name:'default',
                age:0,
                avatar:''
            },
            menus:[]
        }
    },
    getters:{},
    actions:{
        setMenus(menus){
            this.menus = menus
        },
        setUserInfo(userInfo){
            this.userInfo = Object.assign({},this.userInfo,userInfo)
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