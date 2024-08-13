<script setup>
import { onMounted, ref } from 'vue'
// import dataSource from "../../json/menuTree.json"
// import backData from "../../json/resJson.json"
const treeRef = ref()
const props = ref({
  label:"menuName",
  children:"children"
})
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
const handleCheckedGroupChange = (node,data)=>{
  console.log(node,data);
  if(data.checkedKeys.length>0){
    treeRef.value.setChecked(data.menuId,true)
  }else{
    treeRef.value.setChecked(data.menuId,false)
  }
}

const getChecked = ()=>{
  let nodes = treeRef.value.getCheckedNodes()
  console.log('nodes',nodes);
}


// 将后端数据转换为 el-tree 所需的格式
const convertToTreeData = (data) => {
  const result = [];
  for (let key in data) {
    const value = data[key];
    if (Array.isArray(value)) {
      let arr=[]
      value.forEach(item=>{
        arr.push({
          label:'{}',
          children:convertToTreeData(item)
        })
      })
      // 处理数组
      result.push({
        label: key,
        children: arr
      });
      console.log('---',value.map(item =>convertToTreeData(item)));
    } else if (typeof value === 'object' && value !== null) {
      // 处理对象
      result.push({
        label: key,
        children: convertToTreeData(value)
      });
    } else {
      // 处理基本数据类型
      result.push({
        label: `${key}: ${value}`,
        children: []
      });
    }
  }
  return result;
};
let treeData2 = ref([])
onMounted(()=>{
  treeData2.value = convertToTreeData(backData)
  console.log('treeData2',treeData2.value);
})

</script>

<template>
  <div class="cnm_main">
    <p>权限菜单按钮</p>
    <el-button @click="getChecked">获取当前选中的节点</el-button>
    <el-tree
      ref="treeRef"
      :data="dataSource"
      show-checkbox
      node-key="menuId"
      :props="props"
      @check-change="handleClick">
        <template #default="{ node, data }">
          <span>{{ node.label }}</span>
          <div class="checkbox_group">
            <el-checkbox-group v-model="data.checkedKeys" @change="handleCheckedGroupChange(node,data)">
              <el-checkbox v-for="item in data.actions" :label="item.authId" :key="item.authId">{{ item.authName }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </template>
    </el-tree>
    <el-divider></el-divider>
    <p>后端返回数据预览结构</p>
    <el-tree :data="treeData2" :props="{label:'label',children:'children'}"></el-tree>
  </div>
</template>

<style lang="scss" scoped>
.cnm_main{
  background: white;
}
</style>
