// kerwin
import {createStore, combineReducers} from "redux";
import CollapsedReducer from './reducers/CollapsedReducer';
import LoadingReducer from "./reducers/LoadingReducer";

import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
}

// 合并 reducer
const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer)

// 创建 store 并传入 reducer
const store = createStore(reducer);

let persistor = persistStore(store);

export {
    store,
    persistor,
};

// export default store;

/*
  store.dispatch()
  store.subscribe()
*/