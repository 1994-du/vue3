<script setup>
import { ref } from 'vue'
import dataSource from "../../json/menuTree.json"
const treeRef = ref()
const props = ref({
  label:"menuName",
  children:"children"
})
const defaultCheckedKeys = ref([])
const handleClick = (node,checked)=>{
  console.log(node,checked);
  if(checked){
    if(node.actions&&(!node.checkedKeys || (node.checkedKeys&&node.checkedKeys.length==0))){
      node.checkedKeys = node.actions.map(item=>item.authId)
    }
  }else{
    if(node.actions){
      node.checkedKeys = []
    }
  }
}
const setCheck = ()=>{
  console.log('treeRef.value',treeRef.value);
  
}
const handleCheckedGroupChange = (node,data)=>{
  console.log(node,data);
  if(data.checkedKeys.length>0){
    // treeRef.value.setCheckedKeys([data.menuId])
    treeRef.value.setChecked(data.menuId,true)
  }else{
    // treeRef.value.setCheckedKeys([])
    treeRef.value.setChecked(data.menuId,false)
  }
}

const getChecked = ()=>{
  let nodes = treeRef.value.getCheckedNodes()
  console.log('nodes',nodes);
}
</script>

<template>
<el-button @click="setCheck">查看tree Dom</el-button>--{{ defaultCheckedKeys }}
<el-button @click="getChecked">获取当前选中的节点</el-button>
<el-tree
  ref="treeRef"
  :data="dataSource"
  show-checkbox
  node-key="menuId"
  :props="props"
  @check-change="handleClick"
  :default-checked-keys="defaultCheckedKeys">
    <template #default="{ node, data }">
      <span>{{ node.label }}</span>
      <div class="checkbox_group">
        <el-checkbox-group v-model="data.checkedKeys" @change="handleCheckedGroupChange(node,data)">
          <el-checkbox v-for="item in data.actions" :label="item.authId" :key="item.authId">{{ item.authName }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </template>
</el-tree>
</template>

<style lang="scss" scoped>

</style>
