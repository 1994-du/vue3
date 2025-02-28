export default {
    openDatabase() {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open('DataBaseDemo', 1);

          request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('customers')) {
                const customerStore = db.createObjectStore('customers', {
                keyPath: 'username',
                autoIncrement: false
            });
            //   objectStore.createIndex('nameIndex', 'username', { unique: false });
            //   objectStore.createIndex('ageIndex', 'age', { unique: false });
            }
            if(!db.objectStoreNames.contains('menus')){
              const menuStore = db.createObjectStore('menus', {
                keyPath: 'menuLink',
                autoIncrement: true
              });
            }
          };
    
          request.onsuccess = (event) => {
            resolve(event.target.result);
          };

          request.onerror = (event) => {
            console.error('打开数据库失败:', event.target.error);
            reject(event.target.error);
          };

        });
    },   
}