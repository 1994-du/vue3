import {createStore} from 'vuex';
export default createStore({
    //全局变量
    state:{
        name:'张三',
        age:0,
        userInfo:{},//用户信息
        menuRoute:null,//菜单路由
        menuData:[],//菜单数据
        breadCrumb:[],//面包屑
    },
    //同步操作
    mutations:{
        // 菜单数据
        SYNC_SET_MENUDATA(state,arg){
            state.menuData=arg
        },
        // 添加面包屑
        SYNC_PUSH_BREADCRUMB(state,arg){
            state.breadCrumb.push(arg)
        },
        // 移除面包屑
        SYNC_POP_BREADCRUMB(state){
            state.breadCrumb.pop()
        },
        // 重置面包屑
        SYNC_SET_BREADCRUMB(state,arg){
            state.breadCrumb=arg
        },
        // 保存状态
        SAVE_STATE(state){
            localStorage.setItem('store',JSON.stringify(state))
        },
        // 读取状态
        READ_STATE(state){
            let local = JSON.parse(localStorage.getItem('store'))  
            state = Object.assign(state,local)
        },
        // 初始化状态
        SYNC_INIT_STATE(state){
            state = Object.assign(state,{
                userInfo:{},//用户信息
                menuRoute:null,
                menuData:[],//菜单数据
                breadCrumb:[],//面包屑
            })
        },
        // 设置用户信息
        SYNC_SET_USERINFO(state,arg){
            state.userInfo=arg
        },
        CHANGE_AGE(state,arg){
            state.age+=arg.num
        }
    },
    //异步操作
    actions:{
        ASYNC_SET_USERINFO({commit},arg){
            commit('SYNC_SET_USERINFO',arg)
        },
        ASYNC_CHANGE_AGE({commit},arg){
            commit('CHANGE_AGE',arg)
        }
    },
    // 计算属性
    getters:{
        info:(state)=>state.age+state.name,
        moreinfo:(state,gettets)=>state.age+state.name+gettets.info,
        setName:(state=>((p)=>state.name+p))
    }
})