import {Card, Col, Row, List, Avatar, Drawer} from 'antd';
import {EditOutlined, EllipsisOutlined, SettingOutlined} from '@ant-design/icons';
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import * as echarts from "echarts";
import _ from 'lodash'

const {Meta} = Card;

export default function Home() {
    // 浏览量前 6 的数组
    const [viewList, setViewList] = useState([]);
    // 点赞量前 6 的数组
    const [starList, setStarList] = useState([]);
    // 所有已发布新闻数据
    const [allList, setAllList] = useState([]);
    // 抽屉状态
    const [open, setOpen] = useState(false);
    const [pieChart, setPieChart] = useState(null);

    // echarts ref
    const barRef = useRef();
    const pieRef = useRef();

    useEffect(() => {
        // 查询浏览量前 6 的新闻数据
        axios(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
            // console.log(res.data);
            setViewList(res.data);
        });
    }, []);

    useEffect(() => {
        // 查询点赞量前 6 的新闻数据
        axios(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res => {
            // console.log(res.data);
            setStarList(res.data);
        });
    }, []);

    useEffect(() => {
        axios.get("http://localhost:5000/news?publishState=2&_expand=category").then(res => {
            // console.log(res.data);
            renderBarView(_.groupBy(res.data, item => item.category.title));

            setAllList(res.data);
        });

        // 组件销毁时删除 resize 事件
        return () => {
            window.onresize = null;
        }

    }, []);

    const renderBarView = (obj) => {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(barRef.current);

        // 指定图表的配置项和数据
        let option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: "45",
                    interval: 0,
                }
            },
            yAxis: {
                minInterval: 1,
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(obj).map(item => item.length)
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        // 添加事件，宽度自适应，在页面销毁后要删除这个事件
        window.onresize = () => {
            // console.log("resize");
            myChart.resize();
        }
    };

    const renderPieView = () => {
        // 数据处理工作，过滤出当前登录用户发布的文章
        let currentList = allList.filter(item => item.author === username);
        // console.log(currentList);
        // 按照新闻分类进行分组并存到 groupObj 中
        let groupObj = _.groupBy(currentList, item => item.category.title);
        // console.log(groupObj);
        let list = [];
        for (let i in groupObj) {
            list.push({
                name: i,
                value: groupObj[i].length,
            });
        }
        console.log(list);

        // 基于准备好的dom，初始化echarts实例
        // let myChart = echarts.init(pieRef.current);
        let myChart;
        // 解决多次初始化
        if (!pieChart) {
            myChart = echarts.init(pieRef.current);
            setPieChart(myChart);
        } else {
            myChart = pieChart
        }

        // 指定图表的配置项和数据
        let option = {
            title: {
                text: '当前用户新闻分类图示',
                // subtext: 'Fake Data',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    // 获取当前用户数据
    const {username, region, role: {roleName}} = JSON.parse(localStorage.getItem('token'));

    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            size="small"
                            // bordered
                            dataSource={viewList}
                            renderItem={(item) => <List.Item>
                                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            size="small"
                            // bordered
                            dataSource={starList}
                            renderItem={(item) => <List.Item>
                                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={async () => {
                                // 打开抽屉
                                await setOpen(true);
                                setTimeout(() => {
                                    // init 初始化 echarts 图表
                                    renderPieView();
                                });
                            }}/>,
                            <EditOutlined key="edit"/>,
                            <EllipsisOutlined key="ellipsis"/>,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8"/>}
                            title={username}
                            description={
                                <div>
                                    <b>{region ? region : '全球'}</b>
                                    <span style={{
                                        paddingLeft: '30px',
                                    }}>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>

            {/*抽屉*/}
            <Drawer title="个人新闻分类" placement="right" onClose={() => {
                setOpen(false)
            }} open={open} width="500px">
                <div ref={pieRef} style={{
                    width: "100%",
                    height: "400px",
                    marginTop: '30px',
                }}></div>
            </Drawer>

            <div ref={barRef} style={{
                width: "100%",
                height: "400px",
                marginTop: '30px',
            }}></div>

        </div>
    )
}
