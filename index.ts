export interface IListners { 
    [index: string]: { (ret: any) : any| Promise<any>}[]
}

export interface IHandle<T> { 
    (...args: any[]): Promise<T>;
}

export class RepeateActionFilter {
    private queues: string[] = [];
    private listeners: IListners = {};
    doAction<T>(action: string, handle: IHandle<T>) :Promise<T> { 
        return new Promise(async (resolve, reject) => { 
            try {
                //已经存在
                let idx = this.queues.indexOf(action)
                if (idx >= 0) {
                    return this.listeners[action].push((ret: any) => {
                        resolve(ret);
                    });
                }
                this.queues.push(action);
                this.listeners[action] = []

                let ret = await handle();
                let fns = this.listeners[action];
                //设置为空
                delete this.listeners[action];
                this.queues.splice(idx, 1);
                //处理注册的函数
                let ps = fns.map(async fn => {
                    return fn(ret);
                });
                await Promise.all(ps);
                resolve(ret);
            } catch (err) { 
                reject(err);
            }
        })
    }
}
const repeatActionFilter = new RepeateActionFilter();
export default repeatActionFilter;