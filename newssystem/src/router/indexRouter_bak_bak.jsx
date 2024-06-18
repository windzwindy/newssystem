import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
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
import Audit from "../views/sandbox/audit-manage/Audit";
import AuditList from "../views/sandbox/audit-manage/AuditList";
import Unpublished from "../views/sandbox/publish-manage/Unpublished";
import Published from "../views/sandbox/publish-manage/Published";
import Sunset from "../views/sandbox/publish-manage/Sunset";
import { useEffect, useState } from "react";
import axios from "axios";


const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/category": <NewsCategory />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />,
}

export default function IndexRouter() {
    const [backRouteList, setBackRouteList] = useState([])
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

    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={
                    <Auth>
                        <NewsSandBox />
                    </Auth>
                }>
                    <Route index element={<Navigate to='/home' />} />
                    <Route path="home" element={<Home />} />
                    <Route path="user-manage/list" element={<UserList />} />
                    <Route path="right-manage/role/list" element={<RoleList />} />
                    <Route path="right-manage/right/list" element={<RightList />} />
                    <Route path="*" element={<NoPermission />} />
                </Route>
            </Routes>
        </HashRouter>
    )
}