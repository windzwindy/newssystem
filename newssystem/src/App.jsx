import IndexRouter from "./router/indexRouter";
import './App.css';
import {Provider} from 'react-redux';
import {store, persistor} from './redux/store';
import {PersistGate} from 'redux-persist/integration/react'

// import {RouterProvider} from "react-router-dom";

function App() {
    return <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <IndexRouter></IndexRouter>
            {/*<RouterProvider router={IndexRouter()}/>*/}
        </PersistGate>
    </Provider>
}

export default App