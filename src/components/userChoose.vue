<template>
    <div class="user_choose" v-click-outside="closePopover">
        <el-button><slot/></el-button>
        <div class="user_popover" v-if="isShowPopover">
            <div class="user_search">
                <el-input v-model="userForm.searchKey" placeholder="请输入搜索内容" clearable></el-input>
            </div>
            <div class="user_list">
                <!-- 小于2.6版本 只有label -->
                <el-checkbox-group v-model="userForm.chooseUser">
                    <el-checkbox
                        v-for="item in currentUsers"
                        :key="item.id"
                        :label="item.name">
                        </el-checkbox>
                </el-checkbox-group>
            </div>
            <div class="user_footer">
                <el-button>取消</el-button>
                <el-button @click.stop="handleChoose" type="primary">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ClickOutside as vClickOutside} from 'element-plus';
import { ref,reactive,computed, watch } from 'vue'
const props = defineProps(['data','cancel'])
const emits = defineEmits(['select'])
let isShowPopover = ref(false)
let userForm = reactive({
    searchKey:'',
    chooseUser:[]
})
// 模糊搜索
let currentUsers = computed(()=>{
    return props.data.filter((item)=>{
        return item.name.toLocaleLowerCase().includes(userForm.searchKey.toLocaleLowerCase())
    })
})
// 关闭Popover
const closePopover = ()=>{
    isShowPopover.value = false
}
// 打开Popover
const openPopover = ()=>{
    isShowPopover.value = true
}
// 确定
const handleChoose = ()=>{
    emits('select',userForm.chooseUser)
    closePopover()
}
watch(()=>userForm.chooseUser,(val,oldVal)=>{
    if(val.length>1){
        userForm.chooseUser = [val[val.length-1]]
    }
    if(!props.cancel){
        console.log(val,oldVal);
        if(val.length==0){
            userForm.chooseUser = [oldVal[0]]
        }
    }
})
defineExpose({
    openPopover
})
</script>

<style lang='scss' scoped>
.user_choose{
    width: max-content;
    position: relative;
    .user_popover{
        position: absolute;
        top: 32px;
        left: 0;
        width: 200px;
        height: 200px;
        background-color: #fff;
        border: 1px solid #ccc;
        z-index: 10;
        box-shadow: 0 0 12px #ccc;
        display: flex;
        flex-direction: column;
        .user_search{
            padding: 10px 10px 0 10px;;
        }
        .user_list{
            padding:0 10px;
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            .el-checkbox-group{
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                .el-checkbox{
                    width: 100%;
                    margin: 0;
                }
            }
        }
        .user_list::-webkit-scrollbar{
            display: none;;
        }
        .user_footer{
            padding: 10px;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
    }
    
}
</style>