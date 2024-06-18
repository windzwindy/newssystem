import {configureStore} from '@reduxjs/toolkit';
// 折叠菜单
import CollapsedReducer from './reducers/CollapsedReducer';
// 加载框
import LoadingReducer from './reducers/LoadingReducer';

// 合并 reducers，如果不合并会报错...
import {combineReducers} from "redux";

// 导入 redux-persist 和一堆忽略检查错误的东西...
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage';

// 持久化配置
const persistConfig = {
    // localStorage 中的名字
    key: 'root',
    storage,
    blacklist: ['LoadingReducer'] // 黑名单，不会持久化。
}

// 合并成 reducers
const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer,
})

// 持久化后的 reducers
const persistedReducer = persistReducer(persistConfig, reducer)

// 创建 store
const store = configureStore({
    reducer: persistedReducer,
    // 使用中间件，忽略一些错误检查，如果不加 console 会出现错误...
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

// persistor
const persistor = persistStore(store);

export {
    store,
    persistor,
};

/*
  store.dispatch() 分发
  store.subscribe() 订阅
*/