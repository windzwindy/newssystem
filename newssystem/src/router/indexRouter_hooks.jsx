// 有 bug
// 有 bug
// 有 bug
// 有 bug
// 有 bug
// 有 bug
// 有 bug
// 有 bug
// 有 bug

import {
    createHashRouter, Navigate,
} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import LocalRouterPathMap from "./RouterPathMapList";
import Auth from "../components/Auth/Auth.jsx";
import NewsSandBox from "../views/sandbox/NewsSandBox.jsx";

export default function indexRouter() {

    const [backRouteList, setBackRouteList] = useState([]);
    const [routeList, setRouteList] = useState([])

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

    useEffect(() => {

        const token = localStorage.getItem('token');

        let rights = [];

        if (token) {
            const {role} = JSON.parse(token);
            rights = role.rights;
        }

        const checkRoute = (item) => {
            // 如果没有这个路由或者这个路由被关了就无法访问
            // 如果有 routerpermisson 也可以访问
            return LocalRouterPathMap[item.key] && (item.pagepermisson || item.routepermisson);
        }

        const checkUserPermission = (item) => {
            // 判断当前用户是否有权限访问
            return rights.includes(item.key);
        }

        const lazyImport = (path) => {
            return async () => {
                return {Component: (await import(/* @vite-ignore */ path)).default};
            }
        }

        let list = []

        backRouteList.forEach(item => {
            if (checkRoute(item) && checkUserPermission(item)) {
                list.push({
                    key: item.key,
                    path: item.key.substring(1),
                    lazy: lazyImport(LocalRouterPathMap[item.key]),
                });
            }
        })
        // console.log(list)
        setRouteList([...list]);
    }, [backRouteList]);

    const lazyImport = (path) => {
        return async () => {
            return {Component: (await import(/* @vite-ignore */ path)).default};
        }
    }

    const router = createHashRouter([
            {
                // https://stackoverflow.com/questions/76340518/lazy-loading-routes-in-react-router-v6
                path: "/news",
                lazy: lazyImport("../views/News/News"),
            },
            {
                path: "/detail/:id",
                lazy: lazyImport("../views/News/Detail"),
            },
            {
                path: "/login",
                lazy: lazyImport("../views/Login/Login"),
            },
            {
                path: "/",
                element: <Auth>
                    {/*{lazyImport("../views/sandbox/NewsSandBox")}*/}
                    <NewsSandBox/>
                </Auth>,
                children: [
                    {
                        index: true,
                        element: <Navigate to='/home'/>,
                    },
                    ...routeList,
                    {
                        path: "*",
                        lazy: lazyImport("../views/sandbox/nopermission/NoPermission.jsx"),
                    },
                ],
            },
            {
                path: "*",
                lazy: lazyImport("../views/sandbox/nopermission/NoPermission.jsx"),
            }
            ,
        ])
    ;

    return router;

}