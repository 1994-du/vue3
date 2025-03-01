// src/services/indexedDBService.js
export default {
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
    }
  };