import {PageHeader} from "@ant-design/pro-layout";
import {Descriptions, message, Space} from "antd";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {HeartTwoTone} from "@ant-design/icons";

export default function Detail() {
    // 新闻信息
    const [newsInfo, setNewsInfo] = useState(null);

    // 是否已点赞
    const [isStar, setIsStar] = useState(false);

    // 从 params 中解构 id 出来
    const {id} = useParams();

    // 请求新闻数据
    useEffect(() => {
        // console.log(id)
        axios.get(`/news/${id}?_expand=category&_expand=role`).then(res => {
            // console.log(res.data);
            setNewsInfo({
                ...res.data,
                view: res.data.view + 1,
            });

            // 同步后端数据
            return res.data
        }).then(res => {
            axios.patch(`/news/${id}`, {
                view: res.view + 1,
            });
        });
    }, [id]);

    const auditList = ["未审核", "审核中", "已通过", "未通过"];
    const publishList = ["未发布", "待发布", "已上线", "已下线"];

    // 正常，审核中，已通过，未通过
    const colorList = ["black", "orange", "green", "red"];

    // 点赞方法
    const handleStar = () => {
        setIsStar(true);
        // 如果没有点过赞，则赞数加 1 否则提示点过赞了
        if (!isStar) {
            setNewsInfo({
                ...newsInfo,
                star: newsInfo.star + 1,
            });

            axios.patch(`/news/${id}`, {
                star: newsInfo.star + 1,
            });
        } else {
            message.error("已经点过赞了!")
        }
    }

    return (
        <div>
            {
                newsInfo && <div>
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={<div>
                            <Space>
                                {newsInfo.category.title}
                                <HeartTwoTone twoToneColor="#eb2f96" onClick={() => handleStar()}/>
                            </Space>
                        </div>
                        }
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{
                                newsInfo.publishTime ? moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss') : "-"
                            }</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">{0}</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>

                    <div dangerouslySetInnerHTML={{
                        __html: newsInfo.content
                    }} style={{
                        margin: "0 16px",
                        border: "1px solid grey",
                    }}>
                    </div>

                </div>
            }
        </div>
    )
}