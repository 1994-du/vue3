<template>
    <el-popover
        v-model="isShowPopover"
        placement="bottom-start"
        width="400"
        trigger="click"
        :persistent="false"
        :show-arrow="false"
        :offset="5">
        <template #reference>
            <el-button><slot/></el-button>
        </template>
        <template #default>
            <div class="user_checked">
                <el-input v-model="userForm.searchUser" placeholder="请输入搜索内容"></el-input>
                <el-checkbox-group v-model="userForm.chooseUser" @change="handleCheckedChange">
                    <el-checkbox key="1" label="1l" value="1v"></el-checkbox>
                    <el-checkbox key="2" label="2l" value="2v"></el-checkbox>
                    <el-checkbox key="3" label="3l" value="3v"></el-checkbox>
                </el-checkbox-group>
                <div class="user_btns">
                    <el-button>取消</el-button>
                    <el-button type="primary">确定</el-button>
                </div>
            </div>
        </template>
    </el-popover>
</template>

<script setup>
import { reactive, ref } from 'vue'
const isShowPopover = ref(false)
const userForm = reactive({
    searchUser: "",
    chooseUser: []
})
const handleCheckedChange = (val) => {
    console.log(val);
}
</script>

<style lang='scss' scoped>
.user_checked{
    display: flex;
    flex-direction: column;
    .el-checkbox-group{
        display: flex;
        flex-direction: column;
    }
    .user_btns{
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>