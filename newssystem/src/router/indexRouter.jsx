import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "../views/Login/Login";
import NewsSandBox from "../views/sandbox/NewsSandBox"
import Auth from "../components/Auth/Auth";
import NoPermission from "../views/sandbox/nopermission/NoPermission";
import News from "../views/News/News";
import Detail from "../views/News/Detail";
import {useEffect, useState} from "react";
import axios from "axios";
import LocalRouterMap from './RouterMapList'

export default function IndexRouter() {
    const [backRouteList, setBackRouteList] = useState([]);

    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children"),
        ]).then(res => {
            // console.log(res)
            setBackRouteList([...res[0].data, ...res[1].data])
            // console.log([...res[0].data, ...res[1].data])
        })
    }, []);

    const token = localStorage.getItem('token');

    let rights = [];

    if (token) {
        const {role} = JSON.parse(token);
        rights = role.rights;
    }

    const checkRoute = (item) => {
        // 如果没有这个路由或者这个路由被关了就无法访问
        // 如果有 routerpermisson 也可以访问
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson);
    }

    const checkUserPermission = (item) => {
        // 判断当前用户是否有权限访问
        return rights.includes(item.key);
    }

    return (
        <HashRouter>
            <Routes>
                {/*游客访问新闻路由*/}
                <Route path="/news" element={<News/>}/>
                <Route path="/detail/:id" element={<Detail/>}/>

                <Route path="/login" element={<Login/>}/>

                <Route path="/" element={
                    <Auth>
                        <NewsSandBox/>
                    </Auth>
                }>
                    <Route index element={<Navigate to='/home'/>}/>
                    {
                        backRouteList.map(item => {
                            if (checkRoute(item) && checkUserPermission(item)) {
                                return <Route path={item.key.substring(1)} key={item.key}
                                              element={LocalRouterMap[item.key]}/>
                            }
                            // return <Route key={"nopermission"} element={<NoPermission />} />
                            return null;
                        })
                    }
                    {
                        backRouteList.length > 0 && <Route path="*" element={<NoPermission/>}/>
                    }
                </Route>

                <Route path="*" element={<NoPermission/>}/>

            </Routes>
        </HashRouter>
    )
}