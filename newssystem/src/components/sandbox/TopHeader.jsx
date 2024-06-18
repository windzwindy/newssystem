import {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Button, Layout, theme, Dropdown, Avatar, Space} from 'antd';
import {connect} from "react-redux";

const {Header} = Layout;

function TopHeader(props) {
    // console.log(props)
    const navigate = useNavigate();
    // 折叠按钮状态，和 dispatch 函数
    const {isCollapsed, changeCollapsed} = props;
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const {role: {roleName}, username} = JSON.parse(localStorage.getItem('token'));

    // const token = JSON.parse(localStorage.getItem('token'));
    // const role = token ? token.role : null;
    // const roleName = role ? role.roleName : null;
    // const username = token?.username;

    // const changeCollapsed = () => {
    // 改变折叠按钮状态
    // 可以用 useDispatch
    // }

    const items = [
        {
            key: '1',
            label: (
                <a>
                    {roleName}
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login', {replace: true});
                }}>
                    退出
                </a>
            ),
            danger: true,
        },
    ];

    return (
        <Header
            style={{
                padding: 0,
                background: colorBgContainer,
            }}
        >
            <Button
                type="text"
                icon={isCollapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                onClick={() => changeCollapsed()}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />

            <div style={{float: 'right'}}>
                <Space>
                    <span>欢迎<span style={{color: '#1677ff', margin: '0 3px'}}>{username}</span>回来</span>
                    <Dropdown menu={{items}}>
                        <Avatar style={{marginRight: "6px"}} size="large" icon={<UserOutlined/>}/>
                    </Dropdown>
                </Space>
            </div>
        </Header>
    )
}

/*
    connect(
        // mapStateToProps
        // mapDispatchToProps
    )(被包装的组件)
*/

const mapStateToProps = state => {
    // console.log(state);
    const {CollapsedReducer: {isCollapsed}} = state;
    return {
        isCollapsed,
    }
}

const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: 'change_collapsed',
            // payload: '',
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader);