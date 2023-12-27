export class IndexedDBDAO {
    _factory!: IDBFactory;
    _dbName: string = ""
    _ver: number = 1;
    _request!: IDBOpenDBRequest;

    constructor(dbName: string = "store", version: number = 1) {
        this._dbName = dbName;
        this._ver = 1;
    }

    async init() {
        this._request = indexedDB.open(this._dbName, this._ver)
        const upgrade = (ev: IDBVersionChangeEvent) => {
            this.upgrade(ev);
        }
        // this._request.db
        this._request.addEventListener("upgradeneeded", upgrade);
        const onerror = (ev:Event)=>{

        }
        const onsuccsee = (ev:Event)=>{
            // this._
        }
        this._request.addEventListener("success", onsuccsee);
    }

    upgrade(event: IDBVersionChangeEvent) {
        // DBを定義する
        if( event.target instanceof IDBOpenDBRequest &&  event.target.result instanceof IDBDatabase){
            const db　:IDBDatabase =<IDBDatabase> event.target.result;

            db.onerror = () => {
                console.log("データベースの作成中にエラー発生");
            };

            // オブジェクトストアを作成する
            var objectStore = db.createObjectStore("toDoList", { keyPath: "taskTitle" });

            // オブジェクトストアが保有するデータを定義する
            objectStore.createIndex("hours", "hours", { unique: false });
            objectStore.createIndex("minutes", "minutes", { unique: false });
            objectStore.createIndex("day", "day", { unique: false });
            objectStore.createIndex("month", "month", { unique: false });
            objectStore.createIndex("year", "year", { unique: false });
        }


    }


    private createDataBase() {

    }
}