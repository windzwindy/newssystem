import {PageHeader} from "@ant-design/pro-layout";
import {Descriptions} from "antd";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import moment from "moment";

export default function NewsPreview() {

    const [newsInfo, setNewsInfo] = useState(null);

    // 从 params 中解构 id 出来
    const {id} = useParams();

    useEffect(() => {
        // console.log(id)
        axios.get(`/news/${id}?_expand=category&_expand=role`).then(res => {
            // console.log(res.data);
            setNewsInfo(res.data);
        });
    }, [id]);

    const auditList = ["未审核", "审核中", "已通过", "未通过"];
    const publishList = ["未发布", "待发布", "已上线", "已下线"];

    // 正常，审核中，已通过，未通过
    const colorList = ["black", "orange", "green", "red"];

    return (
        <div>
            {
                newsInfo && <div>
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={newsInfo.category.title}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item
                                label="创建时间">{moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{
                                newsInfo.publishTime ? moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss') : "-"
                            }</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="审核状态"><span
                                style={{color: colorList[newsInfo.auditState]}}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
                            <Descriptions.Item label="发布状态"><span
                                style={{color: colorList[newsInfo.publishState]}}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
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