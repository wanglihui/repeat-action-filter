import repeatActionFilter from "..";

async function request(url: string, params?: any): Promise<any> { 
    let key = getUniquekey(url, params);
    return repeatActionFilter.doAction(key, function () { 
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("请求到我了", key);
                resolve(true);
            }, 0);
        })
    })
}

function getUniquekey(url: string, params: any) { 
    if (!params) { 
        return url;
    }
    let keys = Object.keys(params);
    keys.sort();
    let sortParams: any = {};
    for (let key of keys) { 
        sortParams[key] = params[key];
    }
    return `${url}-${JSON.stringify(params)}`;
}

async function main() { 
    let ps = [];
    for (var i = 0; i < 1000; i++) {
        ps.push(request('/test', {}));
        ps.push(request('/test', {key: 1}))
    }
    let ret = await Promise.all(ps);
    return ret;
}

main()
    .then((ret) => { 
        console.log(ret);
    })
    .catch((err) => { 
        console.error(err);
    })