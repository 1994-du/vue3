<template>
    <el-popover
        :visible="isPopoverVisible">
        <template #reference>
            <el-input @click="showPopover"></el-input>
        </template>
        <template #default>
            <el-form>
                <el-form-item>
                    <el-input v-model="formObj.name"></el-input>
                </el-form-item>
            </el-form>
        </template>
    </el-popover>
</template>
<script setup>
const formObj = ref({
    name: ''
})
const isPopoverVisible = ref(false)
const showPopover = () => {
    isPopoverVisible.value = true
}
</script>