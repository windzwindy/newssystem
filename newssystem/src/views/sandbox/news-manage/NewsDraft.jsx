import {Table, Button, Modal, notification} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled, UploadOutlined} from '@ant-design/icons';
import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const {confirm} = Modal;

export default function NewsDraft() {

    const [dataSource, setDataSource] = useState([]);

    const {username} = JSON.parse(localStorage.getItem('token'));

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            const list = res.data;
            setDataSource(list);
        });
    }, [username])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            },
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '分类',
            dataIndex: 'category',
            render: (category) => {
                return category.title;
            },
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => confirmMethod(item)}/>
                    <Button type="primary" shape="circle" icon={<EditOutlined/>} onClick={() => {
                        navigate(`/news-manage/update/${item.id}`);
                    }}/>
                    <Button type='primary' shape='circle' icon={<UploadOutlined/>}
                            onClick={() => handleCheck(item.id)}/>
                </div>
            }
        },
    ];

    const handleCheck = (id) => {
        axios.patch(`/news/${id}`, {
            auditState: 1,
        }).then(res => {
            // 跳转页面
            navigate('/audit-manage/list', {replace: true});

            // 右下角弹出通知
            notification.info({
                message: `通知`,
                description: `您可以到审核列表中查看您的新闻`,
                placement: 'bottomRight',
            });
        });
    }

    // 删除选项函数
    const confirmMethod = (item) => {
        confirm({
            title: '你确定要删除？',
            icon: <ExclamationCircleFilled/>,
            // content: 'When clicked the OK button, this dialog will be closed after 1 second',
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
            },
        });
    }

    // 删除
    const deleteMethod = (item) => {
        // console.log(item);
        // 当前页面同步状态 + 后端同步
        // 用 filter 过滤 不会改变原数组，再 setDataSource 改变原数组
        setDataSource(dataSource.filter(data => data.id !== item.id)); // 当前页面同步状态
        // 发送请求删除数据库中的数据
        axios.delete(`/news/${item.id}`);
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}} rowKey={item => item.id}/>
        </div>
    )
}
