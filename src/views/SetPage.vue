<template>
  <div class="set_page">
    <h4 @click="router.back()">设置</h4>
    <el-tabs
      v-model="activeName"
      @tab-change="tabChange">
      <el-tab-pane label="用户设置" name="userManagement"></el-tab-pane>
      <el-tab-pane label="角色设置" name="roleManagement"></el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>
<script setup>
import { ref ,watch} from 'vue';
import { useRouter } from 'vue-router';
import menuRoutes from '@/utils/menuRoutes';
import indexedDB from '@/utils/indexedDB';
const router = useRouter();
// const gData = ref([]);
// const defaultProps = {
//   children: 'children',
//   label: 'title',
// }
// gData.value = [
//   {
//     title: 'parent 0',
//     key: '0-0',
//     children: [
//       {
//         title: 'leaf 0-0',
//         key: '0-0-0',
//         isLeaf: true,
//       },
//       {
//         title: 'leaf 0-1',
//         key: '0-0-1',
//         isLeaf: true,
//       },
//     ],
//   },
//   {
//     title: 'parent 1',
//     key: '0-1',
//     children: [
//       {
//         title: 'leaf 1-0',
//         key: '0-1-0',
//         isLeaf: true,
//       },
//       {
//         title: 'leaf 1-1',
//         key: '0-1-1',
//         isLeaf: true,
//       },
//     ],
//   },
// ];
// watch(()=>gData.value,()=>{
//     console.log('gData',gData.value);  
// })
// const expandedKeys = ref([]);
// const searchValue = ref('');
// const autoExpandParent = ref(true);
// const onExpand = keys => {
// //   expandedKeys.value = keys;
// //   autoExpandParent.value = false;
// };


// const openDBBtn = async () => {
//     try {
//         window.db = await indexedDB.openDatabase();
//     }
//     catch (e) {
//         console.log('打开数据库失败',e);
//     }
// }
// const saveMenuBtn = async () => {
//     try {
//         const transaction = window.db.transaction(['menus'], 'readwrite');
//         const objectStore = transaction.objectStore('menus');
//         menuRoutes.forEach(async (el) => {
//             const request = await objectStore.add(el);
//         });
//         // const request = await objectStore.add(menuRoutes);
//     }
//     catch (e) {
//         console.log('菜单保存失败',e);
//     }
// }
// const  transformData = (data) =>{
//   return data.map(item => {
//     let newItem = {
//       title: item.menuName,
//       key: item.menuLink,
//       children: [],
//     };
//     if (item.children) {
//       newItem.children = transformData(item.children);
//     }
//     return newItem;
//   });
// }
// const getMenuDataBtn = async () => {
//     try {
//         const transaction = window.db.transaction(['menus'], 'readonly');
//         const objectStore = transaction.objectStore('menus');
//         const request = await objectStore.getAll();
//         request.onsuccess = (e) => {
//             console.log('获取菜单数据成功',e.target.result);
//             let result = e.target.result
//             gData.value = transformData(result)
//         }
        
//     }
//     catch (e) {
//         console.log('获取菜单数据失败',e);
//     }
// }
// const closeDBBtn = () => {
//     indexedDB.closeDatabase();
// }
// tab切换
const activeName = ref('userManagement');
const tabChange = (tab) => {
    router.replace('/set/'+tab)
}
</script>
<style lang='scss' scoped>
@use '@/styles/setPage.scss';
</style>