import {useEffect, useState} from "react";
import axios from "axios";
import {Button, notification, Table, Tag} from "antd";
import {useNavigate} from "react-router-dom";

export default function AuditList() {
    const [dataSource, setDataSource] = useState([]);
    const {username} = JSON.parse(localStorage.getItem("token"));

    const navigate = useNavigate();

    useEffect(() => {
        axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            // console.log(res.data);
            setDataSource(res.data);
        });
    }, [username]);

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            },
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return <div>{category.title}</div>
            },
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => {
                const colorList = ["red", "orange", "green"];
                const auditList = ["草稿箱", "审核中", "已通过", "未通过"];
                return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            },
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    {item.auditState === 1 && <Button type="primary" onClick={() => handleRevert(item)}>撤销</Button>}
                    {item.auditState === 2 && <Button type="primary" onClick={() => handlePublish(item)}>发布</Button>}
                    {item.auditState === 3 && <Button type="primary" onClick={() => handleUpdate(item)}>更新</Button>}
                </div>
            },
        },
    ];

    // 撤销新闻方法
    const handleRevert = (item) => {
        const {id} = item;
        // 本地更新
        setDataSource(dataSource.filter(data => data.id !== id));

        // 发送请求更改后端数据
        axios.patch(`/news/${id}`, {
            auditState: 0,
        }).then(res => {
            notification.info({
                message: "通知",
                description: "您可以到草稿箱中查看您的新闻",
                placement: "bottomRight",
            });
        });
    }

    // 更新新闻的函数
    const handleUpdate = (item) => {
        const {id} = item;
        // 往更新页面跳转
        navigate(`/news-manage/update/${id}`, {replace: true});
    }

    // 发布新闻的方法
    const handlePublish = (item) => {
        const {id} = item;
        axios.patch(`/news/${id}`, {
            publishState: 2,
            publishTime: Date.now(),
        }).then(res => {
            // 跳转到发布管理页面
            navigate('/publish-manage/published', {replace: true});

            notification.info({
                message: '通知',
                description: '您可以到【发布管理/已经发布】中查看您的新闻',
                placement: "bottomRight",
            });
        });
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}} rowKey={item => item.id}/>
        </div>
    )
}
