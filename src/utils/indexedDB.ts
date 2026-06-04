interface MenuData {
    username: string
    menus: any
}

interface Customer {
    username: string
    [key: string]: any
}

interface IndexedDBService {
    openDatabase(): Promise<IDBDatabase>
    closeDatabase(): void
    addCustomer(customer: Customer): Promise<boolean>
    queryCustomers(username: string): Promise<Customer | undefined>
    addMenu(username: string, menu: MenuData): Promise<boolean>
}

const IndexDB: IndexedDBService = {
    // 打开数据库
    openDatabase(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('DataBaseDemo', 1)

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBOpenDBRequest).result
                // if (!db.objectStoreNames.contains('customers')) {
                //     const customerStore = db.createObjectStore('customers', {
                //     keyPath: 'username',
                //     autoIncrement: false
                // });
                // //   objectStore.createIndex('nameIndex', 'username', { unique: false });
                // //   objectStore.createIndex('ageIndex', 'age', { unique: false });
                // }
                if (!db.objectStoreNames.contains('menus')) {
                    db.createObjectStore('menus', {
                        keyPath: 'username',
                        autoIncrement: false
                    })
                }
            }

            request.onsuccess = (event: Event) => {
                // 保存数据库实例到window对象上，方便全局使用
                window.db = (event.target as IDBOpenDBRequest).result
                resolve((event.target as IDBOpenDBRequest).result)
            }

            request.onerror = (event: Event) => {
                console.error('打开数据库失败:', (event.target as IDBOpenDBRequest).error)
                reject((event.target as IDBOpenDBRequest).error)
            }
        })
    },

    // 关闭数据库
    closeDatabase(): void {
        if (window.db) {
            window.db.close()
            window.db = null as any
        }
    },

    // 添加用户数据
    addCustomer(customer: Customer): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const db = window.db as IDBDatabase
            const transaction = db.transaction('customers', 'readwrite')
            const objectStore = transaction.objectStore('customers')

            const addRequest = objectStore.add(customer)
            addRequest.onsuccess = () => {
                console.log(`数据 ${customer.username} 添加成功`)
                resolve(true)
            }
            addRequest.onerror = (e: Event) => {
                console.error(`数据 ${customer.username} 添加失败:`, (e.target as IDBRequest).error)
                reject((e.target as IDBRequest).error)
            }

            transaction.oncomplete = () => {
                console.log('所有数据添加完成')
                //   db.close();
            }
        })
    },

    // 查询用户数据
    queryCustomers(username: string): Promise<Customer | undefined> {
        return new Promise((resolve, reject) => {
            const db = window.db as IDBDatabase
            const transaction = db.transaction('customers', 'readonly')
            const objectStore = transaction.objectStore('customers')
            const request = objectStore.get(username)

            request.onsuccess = (event: Event) => {
                console.log('查询结果:', event)
                resolve((event.target as IDBRequest).result)
            }
            request.onerror = (event: Event) => {
                console.error('查询失败:', (event.target as IDBRequest).error)
                reject((event.target as IDBRequest).error)
            }
            transaction.oncomplete = () => {
                // db.close();
            }
        })
    },

    // 添加菜单数据
    addMenu(username: string, menu: MenuData): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const db = window.db as IDBDatabase
            const transaction = db.transaction('menus', 'readwrite')
            const objectStore = transaction.objectStore('menus')
            const isExist = objectStore.get(username)
            console.log('isExist:', isExist)
            isExist.onsuccess = (event: Event) => {
                if ((event.target as IDBRequest).result) {
                    resolve(true)
                    return
                }
                const addRequest = objectStore.add({
                    username: username,
                    menus: menu.menus
                })
                addRequest.onsuccess = () => {
                    resolve(true)
                }
                addRequest.onerror = (e: Event) => {
                    reject((e.target as IDBRequest).error)
                }
            }
            transaction.oncomplete = () => {
                console.log('所有数据添加完成')
            }
        })
    }
}

export default IndexDB
