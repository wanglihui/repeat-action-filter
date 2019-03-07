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
                if (this.queues.indexOf(action) >= 0) {
                    return this.listeners[action].push((ret: any) => {
                        resolve(ret);
                    });
                }
                this.queues.push(action);
                this.listeners[action] = []
                let ret = await handle();
                let fns = this.listeners[action];
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