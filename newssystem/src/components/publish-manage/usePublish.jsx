import {useEffect, useState} from "react";
import axios from "axios";
import {notification} from "antd";
import {useNavigate} from "react-router-dom";

// 自定义 hooks 用于取数据
// 不建议在组件中取数据?
function usePublish(type) {

    // 拿到用户名
    const {username} = JSON.parse(localStorage.getItem('token'));

    // 存储数据,用于传给子组件
    const [dataSource, setDataSource] = useState([]);

    const navigate = useNavigate();

    // 请求数据
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then((res) => {
            // console.log(res.data);
            setDataSource(res.data);
        })
    }, [username, type]);

    // 发布新闻
    const handlePublish = (id) => {
        // console.log(id);
        // 本地数据更新
        setDataSource(dataSource.filter(item => item.id !== id));

        // 后端更新数据
        axios.patch(`/news/${id}`, {
            publishState: 2,
            publishTime: Date.now(),
        }).then(res => {
            notification.info({
                message: '通知',
                description: '您可以到【发布管理/已经发布】中查看您的新闻',
                placement: "bottomRight",
            });
        });
    };

    // 下线新闻
    const handleSunset = (id) => {
        // console.log(id);
        // 本地数据更新
        setDataSource(dataSource.filter(item => item.id !== id));

        // 后端更新数据
        axios.patch(`/news/${id}`, {
            publishState: 3,
        }).then(res => {
            notification.info({
                message: '通知',
                description: '您可以到【发布管理/已下线】中查看您的新闻',
                placement: "bottomRight",
            });
        });
    };

    // 删除新闻
    const handleDelete = (id) => {
        // console.log(id);
        // 本地数据更新
        setDataSource(dataSource.filter(item => item.id !== id));

        // 后端删除数据
        axios.delete(`/news/${id}`).then(res => {
            notification.info({
                message: '通知',
                description: '您已经删除了已下线的新闻',
                placement: "bottomRight",
            });
        });

    };

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete,
    }
}

export default usePublish