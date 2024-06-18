import {useEffect, useState} from "react";
import axios from "axios";
import {PageHeader} from "@ant-design/pro-layout";
import {Card, Col, List, Row} from "antd";
import _ from "lodash";

export default function News() {
    const [list, setList] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/news?publishState=2&_expand=category").then(res => {
            // console.log(res.data);
            // console.log(Object.entries(_.groupBy(res.data, item => item.category.title)));
            setList(Object.entries(_.groupBy(res.data, item => item.category.title)));
        });
    }, []);

    return (
        <div style={{
            width: '95%',
            margin: "0 auto",
        }}>
            <PageHeader
                className="site-page-header"
                title="全球大新闻"
                subTitle="查看新闻"
            />

            <Row gutter={[16, 16]}>
                {
                    list.map(item =>
                        <Col span={8} key={item[0]}>
                            <Card title={item[0]} bordered={true} hoverable>
                                <List
                                    size="small"
                                    pagination={{
                                        pageSize: 3,
                                    }}
                                    dataSource={item[1]}
                                    renderItem={(data) => <List.Item><a
                                        href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                                />
                            </Card>
                        </Col>
                    )
                }
            </Row>
        </div>
    )
}