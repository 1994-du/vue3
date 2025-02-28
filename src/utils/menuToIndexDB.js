import menuRoutes from './menuRoutes.js'
import indexedDB from './indexedDB.js';

let db=null;

const openMenu = async () => {
    return new Promise((resolve,reject)=>{
        resolve(indexedDB.openDatabase())
    })
}
const saveMenu = async (db) => {
    try {
        const transaction = db.transaction('menus','readwrite');
        const store = transaction.objectStore('menus');
        if(store){
            await store.put('menu',menuRoutes)
        }
    }
    catch (e) {
        console.log('菜单保存失败',e);
        
    }
}
export{
    openMenu,
    saveMenu
}