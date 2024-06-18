import {Button, Steps, Form, Input, Select, message, notification} from 'antd';
import {PageHeader} from '@ant-design/pro-layout';
import {useEffect, useRef, useState} from "react";
import style from './News.module.css';
import axios from "axios";
import NewsEditor from "../../../components/news-manage/NewsEditor";
import {useNavigate} from "react-router-dom";

export default function NewsAdd() {
    // 步骤条当前所在位置
    const [current, setCurrent] = useState(0);
    // 存储新闻分类的数组
    const [categoryList, setCategoryList] = useState([]);

    // 存储新闻标题和分类 Id
    const [formInfo, setFormInfo] = useState({});
    // 存储新闻内容
    const [content, setContent] = useState("");

    // 表单 Ref 用于验证表单
    const NewsForm = useRef(null);

    // 读取本地用户信息
    const User = JSON.parse(localStorage.getItem('token'));

    // 重定向
    const navigate = useNavigate();

    // 点击下一步按钮时进行操作的函数
    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                // console.log(res);
                // 存储新闻标题和分类 Id
                setFormInfo(res);
                // 步骤条进入下一步
                setCurrent(current + 1);
            }).catch(err => console.log(err));
        } else {
            // console.log(formInfo, content);
            if (content === "" || content.trim() === "<p></p>") {
                // 如果编辑器输入内容为空则不能进入下一步
                message.error("新闻内容不能为空");
            } else {
                // 不为空就继续
                setCurrent(current + 1);
            }
        }
    }

    // 点击上一步时进行操作的方法
    const handlePrevious = () => {
        setCurrent(current - 1);
    }

    // 向后端请求新闻分类的数据并存进新闻分类数组中
    useEffect(() => {
        axios.get('/categories').then((res) => {
            // console.log(res.data);
            setCategoryList(res.data);
        });
    }, []);

    // 点击 保存到草稿箱 或者 审核 时触发的方法
    // auditState: 0(到草稿箱) 1(到审核列表)
    const handleSave = (auditState) => {
        // 解构信息出来
        const {region, roleId, username: author} = User;

        // 向后端发送请求添加新闻
        axios.post('/news', {
            ...formInfo,
            "content": content,
            "region": region ? region : "全球",
            "author": author,
            "roleId": roleId,
            // auditState: 0(到草稿箱) 1(到审核列表)
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "publishTime": 0,
        }).then(res => {
            // 跳转页面
            navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list', {replace: true});

            // 右下角弹出通知
            notification.info({
                message: `通知`,
                description: `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
                placement: 'bottomRight'
            });
        })
    }

    return (
        <div>
            <PageHeader
                className='site-page-header'
                title='撰写新闻'
                subTitle='This is a subtitle'
            />

            <Steps
                current={current}
                items={[
                    {
                        title: '基本信息',
                        description: '新闻标题，新闻分类',
                    },
                    {
                        title: '新闻内容',
                        description: '新闻主体内容',
                    },
                    {
                        title: '新闻提交',
                        description: '保存草稿或者提交审核',
                    },
                ]}
            />

            <div style={{marginTop: '50px'}}>
                <div className={current === 0 ? '' : style.active}>
                    <Form
                        name="basic"
                        labelCol={{span: 4,}}
                        wrapperCol={{span: 20,}}
                        ref={NewsForm}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input news title!',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input news category!',
                                },
                            ]}
                        >
                            <Select
                                options={
                                    categoryList.map(item => ({
                                        value: item.id,
                                        label: item.title,
                                    }))
                                }
                            />
                        </Form.Item>

                    </Form>
                </div>

                {/*新闻主体 richEditor 放富文本编辑器的地方*/}
                <div className={current === 1 ? '' : style.active}>
                    <NewsEditor getContent={(value) => {
                        // console.log(value);
                        setContent(value);
                    }}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : style.active}></div>

            </div>

            <div style={{
                marginTop: '50px',
            }}>
                {
                    current === 2 && <span>
                        <Button type='primary' onClick={() => handleSave(0)}>保存草稿箱</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }
                {
                    current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>
                }
                {
                    current > 0 && <Button onClick={handlePrevious}>上一步</Button>
                }
            </div>
        </div>
    )
}
