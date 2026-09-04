interface MenuData {
    username: string
    menus: any
}

interface IndexedDBService {
    openDatabase(): Promise<IDBDatabase>
    closeDatabase(): void
    addMenu(username: string, menu: MenuData): Promise<boolean>
}

const IndexDB: IndexedDBService = {
    // 打开数据库
    openDatabase(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('DataBaseDemo', 1)

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBOpenDBRequest).result
                if (!db.objectStoreNames.contains('menus')) {
                    db.createObjectStore('menus', {
                        keyPath: 'username',
                        autoIncrement: false
                    })
                }
            }

            request.onsuccess = (event: Event) => {
                window.db = (event.target as IDBOpenDBRequest).result
                resolve((event.target as IDBOpenDBRequest).result)
            }

            request.onerror = (event: Event) => {
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

    // 添加菜单数据
    addMenu(username: string, menu: MenuData): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const db = window.db as IDBDatabase
            const transaction = db.transaction('menus', 'readwrite')
            const objectStore = transaction.objectStore('menus')
            const isExist = objectStore.get(username)
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
            transaction.oncomplete = () => {}
        })
    }
}

export default IndexDB
