import {useOutlet} from "react-router-dom";
import {Layout, theme, Spin} from 'antd';
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";

const {Content} = Layout
import './NewsSandBox.css'
import {useEffect} from "react";
import Nprogress from "nprogress";
import 'nprogress/nprogress.css';
import {connect} from "react-redux";

function NewsSandBox(props) {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    // 为了使用 nprogress 进度条，必须使用 useOutlet。。。
    let Outlet = useOutlet();
    // 是否显示加载中
    const {isLoading} = props;

    // 显示进度条
    Nprogress.start();

    useEffect(() => {
        // 关闭进度条
        // console.log("...............");
        Nprogress.done();
    });

    return (
        <Layout>
            <SideMenu></SideMenu>

            <Layout>
                <TopHeader></TopHeader>

                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflow: 'auto',
                    }}
                >

                    {/*路由出口*/}
                    <Spin size="large" spinning={isLoading}>
                        {Outlet}
                    </Spin>

                </Content>

            </Layout>
        </Layout>
    )
}

const mapStateToProps = state => {
    const {LoadingReducer: {isLoading}} = state;
    return {
        isLoading,
    }
}

export default connect(mapStateToProps)(NewsSandBox);