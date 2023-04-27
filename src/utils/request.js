import axios from 'axios'
import store from '@/store'
import router from '../router'

// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// axios.defaults.headers['Platform'] = 'web'
// 需要取消请求的集合
const cancelTokens = []

// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: 'api',
    // 超时
    timeout: 30 * 1000,
})

// 请求拦截器
service.interceptors.request.use(
    async config => {
        const now = new Date().getTime()
        if (store.getters['expiryTime'] <= now && !validateUrlNotAuthentication(config.url)) {
            // 刷新token的函数,这需要添加一个开关，防止重复请求
            if (!isTokenRefreshing) {
                refreshTokenRequst()
            }
            isTokenRefreshing = true;
            // 将当前的请求保存在观察者数组中,以便刷新完Token后回调
            const retryOriginalRequest = new Promise((resolve) => {
                addSubscriber(() => {
                    config.headers['Authorization'] = `Bearer ${store.getters['accessToken']}`
                    resolve(config)
                })
            });
            return retryOriginalRequest;
            // const CancelToken = axios.CancelToken;
            // const source = CancelToken.source();
            // config.cancelToken = source.token; 
            // config.cancel = source.cancel;
            // // 将本次请求放入待取消请求集合
            // config.cancelToken = source.token;
            // cancelTokens.push(() => source.cancel("令牌无效取消请求"));
            // source.cancel()
            // config.cancel()
            // return config
        } else {
            // 让每个请求携带自定义token 请根据实际情况自行修改
            config.headers['Authorization'] = `Bearer ${store.getters['accessToken']}`
            return config;
        }
    },
    error => {
        console.log('err：' + error);
        return Promise.reject(error);
    }
)

let isTokenRefreshing = false;
// 响应拦截器
service.interceptors.response.use(
    response => {
        return response;
        // 未设置状态码则默认成功状态
        // const code = response.data.code || 200;
        // // 获取错误信息
        // const errorCode = {
        //     '401': '认证失败，无法访问系统资源',
        //     '403': '当前操作没有权限',
        //     '404': '访问资源不存在',
        //     'default': '系统未知错误,请反馈给管理员'
        // };
        // const msg = errorCode[code] || response.data.msg || errorCode['default'];
        // if (code === 500) {
        //     return Promise.reject(new Error(msg))
        // } else if (code !== 200) {
        //     return Promise.reject('error')
        // }else{
        //     return response.data
        // }
    },
    error => {
        // 取消请求之后,会进入error,如果是取消请求处理一下
        if (axios.isCancel(error)) {
            console.log('request cancel ', JSON.stringify(error))
            return new Promise(() => { })
        }
        const config = error.config
        const response = error.response
        if (response && response.status === 401 && !validateUrlNotAuthentication(config.url)) {
            // 刷新token的函数,添加一个开关，防止重复请求
            if (!isTokenRefreshing) {
                refreshTokenRequst()
            }
            isTokenRefreshing = false;
            // 将当前的请求保存在观察者数组中
            const retryOriginalRequest = new Promise((resolve) => {
                addSubscriber(() => {
                    resolve(config)
                })
            });
            return retryOriginalRequest;
        }
        console.log('err:' + error)
        let { message } = error;
        if (message == "Network Error") {
            message = "后端接口连接异常";
        }
        else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        }
        else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        return Promise.reject(message)
    }
)

function checkStatus(response) {
    if (response && response.status === 401 && !validateUrlNotAuthentication(config.url)) {
        // 刷新token的函数,这需要添加一个开关，防止重复请求
        if (!isTokenRefreshing) {
            refreshTokenRequst()
        }
        isTokenRefreshing = false;
        // 将当前的请求保存在观察者数组中
        const retryOriginalRequest = new Promise((resolve) => {
            addSubscriber(() => {
                resolve(response.config)
            })
        })
        return retryOriginalRequest
    }
    else {
        return response;
    }
}

function refreshTokenRequst() {
    store.dispatch('refreshToken', { accessToken: store.getters['accessToken'], refreshToken: store.getters['refreshToken'] })
        .then(() => {
            console.log('refreshToken 成功')
            // 将所有存储到观察者数组中的请求重新执行。
            onAccessTokenFetched()
        })
        .catch(() => {
            console.log('refreshToken 失败')
            router.push({
                path: 'login'
            })
        })
        .finally(() => {
            // 撕掉标记 
            isTokenRefreshing = false;
        });
}

// 观察者
let subscribers = [];
function onAccessTokenFetched() {
    console.log(`挂起请求：${subscribers.length}个`)
    subscribers.forEach((callback) => {
        callback();
        console.log('挂起请求执行' + callback)
    })
    subscribers = [];
}

function addSubscriber(callback) {
    subscribers.push(callback)
}
function validateUrlNotAuthentication(url) {
    if (url && (url.includes('/api/Auth/GetToken') || url.includes('/api/Auth/RefreshToken') ||
    url.includes('login')))
        return true
    else false
}

export function validateRouteNotAuthentication(routePath) {
    if (routePath && routePath.includes('login'))
        return true
    else false
}
export default service
