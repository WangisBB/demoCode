export default class indexedDB {
  //name:表名  key:主键 ,cursorIndex 索引

  request = null;
  db = null;
  constructor(dbName, dbVersion, stores) {
    // indexedDB兼容
    const indexedDB =
      window.indexedDB ||
      window.webkitindexedDB ||
      window.msIndexedDB ||
      window.mozIndexedDB;
    this.request = indexedDB.open(dbName, dbVersion);
    this.request.onerror = () => {
      console.log("打开数据库失败");
    };

    this.request.onsuccess = (event) => {
      this.db = event.target.result;

      console.log("数据库打开成功");
    };
    this.request.onupgradeneeded = (event) => {
      const db = (this.db = event.target.result);
      console.log("onupgradeneeded", event.target.result, stores);

      Object.keys(stores).forEach((store) => {
        console.log(stores[store]);
        if (!db.objectStoreNames.contains(store)) {
          const val = stores[store];
          const objectStore = db.createObjectStore(store, val.option);
          if (Array.isArray(val.tableIndex)) {
            val.tableIndex.forEach((tableIndex) => {
              objectStore.createIndex(
                tableIndex.indexName,
                tableIndex.indexName,
                tableIndex.option
              );
            });
          }
        }
      });
    };
  }
  // 打开数据库

  // 删除表
  deleteDB(table, key) {
    console.log(table, this.request);
    this.request.result
      .transaction([table], "readwrite")
      .objectStore(table)
      .delete(1);
  }
  // 关闭数据库
  async closeDB(db) {
    try {
      let d;
      if (!db) {
        d = await this.request;
      }
      let closeQuest = d.closeDB();
      return new Promise((resolve) => {
        closeQuest.onerror = function () {
          resolve(false);
        };
        closeQuest.onsuccess = function () {
          resolve(true);
        };
      });
    } catch (error) {
      return Promise.resolve(false);
    }
  }
  // 添加数据，add添加新值

  save(tableName, data) {
    let db = this.request.result;
    let request = db
      .transaction(tableName, "readwrite")
      .objectStore(tableName)
      .put(data);

    return new Promise((resolve) => {
      request.onerror = function () {
        resolve(false);
      };
      request.onsuccess = function () {
        resolve(true);
      };
    });
  }
  // 新增数据
  add(storeName, data) {
    var result = this.db
      .transaction(storeName, "readwrite")
      .objectStore(storeName)
      .add(data);
    result.onsuccess = function (e) {
      console.log("create note success!");
    };
    result.onerror = function (e) {
      console.log("can't create database,error:" + result.error);
    };
  }
  // 删除数据
  delete(storeName, keyValue) {
    try {
      let request = this.db
        .transaction(storeName, "readwrite")
        .objectStore(storeName)
        .delete(keyValue);
      return new Promise((resolve) => {
        request.onerror = function () {
          resolve(false);
        };
        request.onsuccess = function () {
          resolve(true);
        };
      });
    } catch (error) {
      return Promise.resolve(false);
    }
  }
  // 清空数据
  async clear(table) {
    let db = await this.openDB();
    let store = db.transaction(table.name, "readwrite").objectStore(table.name);
    store.clear();
  }
  // 查询数据 表名 索引值 索引 key  没有value key为key 而不是索引
  async get(table, keyValue, indexCursor) {
    try {
      let db = await this.openDB();
      let store = db
        .transaction(table.name, "readonly")
        .objectStore(table.name);
      let request;
      request = !keyValue
        ? store.openCursor()
        : indexCursor
        ? store.index(indexCursor).get(keyValue)
        : store.get(keyValue);
      let data = [];
      return new Promise((resolve) => {
        request.onerror = function () {
          resolve("查询数据失败");
        };
        request.onsuccess = function (event) {
          if (!keyValue && !indexCursor) {
            if (event.target.result) {
              data.push(event.target.result.value);
              event.target.result.continue();
            } else {
              resolve(data);
            }
          } else {
            resolve([event.target.result]);
          }
        };
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  //   通过游标操作数据, callback中要有游标移动方式
  async handleDataByCursor(table, keyRange) {
    try {
      let kRange = keyRange || "";
      let db = await this.openDB();
      let store = db.transaction(table, "readwrite").objectStore(table),
        request;
      request = store.openCursor(kRange);
      return new Promise((resolve) => {
        request.onerror = function () {
          resolve("通过游标获取数据报错");
        };
        request.onsuccess = function (event) {
          let cursor = event.target.result;
          resolve(cursor);
        };
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  // 通过索引游标操作数据, callback中要有游标移动方式
  async handleDataByIndex(table, keyRange, sursorIndex) {
    try {
      let kRange = keyRange || "";
      let db = await this.openDB();
      let store = db.transaction(table, "readwrite").objectStore(table),
        request;
      request = store.index(sursorIndex).openCursor(kRange);
      return new Promise((resolve) => {
        request.onerror = function () {
          resolve("通过索引游标获取数据报错");
        };
        request.onsuccess = function (event) {
          let cursor = event.target.result;
          if (cursor) {
            resolve(cursor);
          }
        };
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  // 创建游标索引
  async createCursorIndex(table, cursorIndex, unique) {
    var db = await this.openDB();
    let store = db.transaction(table, "readwrite").objectStore(table);
    store.createIndex(cursorIndex, cursorIndex, {
      unique: unique,
    });
    return Promise.resolve();
  }
}
