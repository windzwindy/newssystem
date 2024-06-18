import axios from "axios";
import {store} from "../redux/store";

axios.defaults.baseURL = "http://localhost:5000"

// axios.defaults.headers

// 拦截器
// axios.interceptors.request.use()
// axios.interceptors.response.use()

// 请求前进行拦截
axios.interceptors.request.use(function (config) {
    // 显示 loading 加载中...
    store.dispatch({
        type: "change_loading",
        payload: true,
    })
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // 响应成功隐藏 loading
    store.dispatch({
        type: "change_loading",
        payload: false,
    })
    return response;
}, function (error) {
    // 响应失败也隐藏 loading
    store.dispatch({
        type: "change_loading",
        payload: false,
    })
    return Promise.reject(error);
});