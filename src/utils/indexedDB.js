// src/services/indexedDBService.js
export default {
    // 打开数据库
    openDatabase() {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open('DataBaseDemo', 1);
          
          request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // if (!db.objectStoreNames.contains('customers')) {
            //     const customerStore = db.createObjectStore('customers', {
            //     keyPath: 'username',
            //     autoIncrement: false
            // });
            // //   objectStore.createIndex('nameIndex', 'username', { unique: false });
            // //   objectStore.createIndex('ageIndex', 'age', { unique: false });
            // }
            if(!db.objectStoreNames.contains('menus')){
              const menuStore = db.createObjectStore('menus', {
                keyPath: 'username',
                autoIncrement: false
              });
            }
          };
    
          request.onsuccess = (event) => {
            // 保存数据库实例到window对象上，方便全局使用
            window.db = event.target.result;
            resolve(event.target.result);
          };

          request.onerror = (event) => {
            console.error('打开数据库失败:', event.target.error);
            reject(event.target.error);
          };

        });
    },
    // 关闭数据库
    closeDatabase() {
        if (window.db) {
          window.db.close();
          window.db = null;
        }
    },
    // 添加用户数据
    addCustomer(customer) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction('customers', 'readwrite');
        const objectStore = transaction.objectStore('customers');
  
        const addRequest = objectStore.add(customer);
        addRequest.onsuccess = () => {
          console.log(`数据 ${customer.username} 添加成功`);
          resolve(true);
        };
        addRequest.onerror = (e) => {
          console.error(`数据 ${customer.username} 添加失败:`, e.target.error);
          reject(e.target.error);
        };
  
        transaction.oncomplete = () => {
          console.log('所有数据添加完成');
        //   db.close();
        };
      });
    },
    // 查询用户数据
    queryCustomers(username) {
        return new Promise((resolve, reject) => {
          const transaction = db.transaction('customers', 'readonly');
          const objectStore = transaction.objectStore('customers');
          const request = objectStore.get(username);

          request.onsuccess = (event) => {
            console.log('查询结果:', event);
            resolve(event.target.result);
          }
          request.onerror = (event) => {
            console.error('查询失败:', event.target.error);
            reject(event.target.error);
          }
          transaction.oncomplete = () => {
            // db.close();
          }
        });
    },
    // 添加菜单数据
    addMenu(username,menu) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction('menus', 'readwrite');
        const objectStore = transaction.objectStore('menus');
        const isExist = objectStore.get('admin');
        if(isExist){
          console.log('数据已存在');
          resolve(true);
          return;
        }
        const addRequest = objectStore.add({
          username:username,
          menus:menu.menus
        });
        addRequest.onsuccess = () => {
          console.log(`数据 ${menu.username} 添加成功`);
          resolve(true);
        };
        addRequest.onerror = (e) => {
          console.error(`数据 ${menu.username} 添加失败:`, e.target.error);
          reject(e.target.error);
        };
        transaction.oncomplete = () => {
          console.log('所有数据添加完成');
        };
      });
    },
  };