import {createStore} from 'vuex';
export default createStore({
    //全局变量
    state:{
        islogin:0,
        name:'dxx',
        age:28,
        message:[]
    },
    //同步操作
    mutations:{
        addMessage(state,arg){
            console.log('arg',arg);
            state.message.push(arg.msg)
        },
        clearMessage(state,arg){
            state.message=[]
        },
        changAge(state,arg){
            state.age+=arg.num
        },
        changLogin(state,arg){
            state.islogin=arg.val
        }
    },
    //异步操作
    actions:{
        asyncChangeAge(context,arg){
            console.log(context)
            return new Promise(()=>{
                setTimeout(()=>{
                    context.commit('changAge',{num:arg.num})
                },1000)
            })
        }
    },
    // 计算属性
    getters:{
        
        info:(state)=>state.age+state.name,
        moreinfo:(state,gettets)=>state.age+state.name+gettets.info,
        setName:(state=>((p)=>state.name+p))
    }
})