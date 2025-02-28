// src/services/indexedDBService.js
export default {
  // 打开数据库
    openDatabase() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open('DataBaseDemo1', 1);
  
        request.onerror = (event) => {
          console.error('打开数据库失败:', event.target.error);
          reject(event.target.error);
        };
  
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('customers')) {
            const objectStore = db.createObjectStore(['customers'], {
              keyPath: 'username',
              autoIncrement: false
            });
            // objectStore.createIndex('nameIndex', 'name', { unique: false });
            // objectStore.createIndex('ageIndex', 'age', { unique: false });
          }
          if(!db.objectStoreNames.contains('menus')){
            const objectStore = db.createObjectStore('menus', {
              keyPath: 'menuLink',
              autoIncrement: true
            });
          }
        };
  
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
      });
    },
  // 添加用户数据
    addCustomer(db, customer) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction('customers', 'readwrite');
        const objectStore = transaction.objectStore('customers');
  
        const addRequest = objectStore.add(customer);
        addRequest.onsuccess = () => {
          console.log(`数据 ${customer.username} 添加成功`);
          resolve();
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
    queryCustomers(db, username) {
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
    }
  };