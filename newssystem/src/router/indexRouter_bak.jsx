import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "../views/Login/Login";
import NewsSandBox from "../views/sandbox/NewsSandBox"
import Auth from "../components/Auth/Auth";
import Home from "../views/sandbox/home/Home";
import UserList from "../views/sandbox/user-manage/UserList";
import RoleList from "../views/sandbox/right-manage/RoleList";
import RightList from "../views/sandbox/right-manage/RightList";
import NoPermission from "../views/sandbox/nopermission/NoPermission";
import NewsAdd from "../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../views/sandbox/news-manage/NewsDraft";
import NewsCategory from "../views/sandbox/news-manage/NewsCategory";
import NewsPreview from "../views/sandbox/news-manage/NewsPreview.jsx";
import NewsUpdate from "../views/sandbox/news-manage/NewsUpdate.jsx";
import Audit from "../views/sandbox/audit-manage/Audit";
import AuditList from "../views/sandbox/audit-manage/AuditList";
import Unpublished from "../views/sandbox/publish-manage/Unpublished";
import Published from "../views/sandbox/publish-manage/Published";
import Sunset from "../views/sandbox/publish-manage/Sunset";
import News from "../views/News/News";
import Detail from "../views/News/Detail";
import {useEffect, useState} from "react";
import axios from "axios";

const LocalRouterMap = {
    "/home": <Home/>,
    "/user-manage/list": <UserList/>,
    "/right-manage/role/list": <RoleList/>,
    "/right-manage/right/list": <RightList/>,
    "/news-manage/add": <NewsAdd/>,
    "/news-manage/draft": <NewsDraft/>,
    "/news-manage/category": <NewsCategory/>,
    "/news-manage/preview/:id": <NewsPreview/>,
    "/news-manage/update/:id": <NewsUpdate/>,
    "/audit-manage/audit": <Audit/>,
    "/audit-manage/list": <AuditList/>,
    "/publish-manage/unpublished": <Unpublished/>,
    "/publish-manage/published": <Published/>,
    "/publish-manage/sunset": <Sunset/>,
}

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