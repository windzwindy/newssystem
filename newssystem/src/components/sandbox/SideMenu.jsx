import {
    UserOutlined,
} from '@ant-design/icons';
import {Layout, Menu} from 'antd';
import './index.css';

const {Sider} = Layout;
import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {connect} from "react-redux";

// 模拟数组结构
/* const menuList = [
  {
    key: "/home",
    icon: <UserOutlined />,
    label: "首页",
  },
  {
    key: "/user-manage",
    icon: <UserOutlined />,
    label: "用户管理",
    children: [
      {
        key: "/user-manage/list",
        icon: <UserOutlined />,
        label: "用户列表",
      },
    ],
  },
  {
    key: "/right-manage",
    icon: <UserOutlined />,
    label: "权限列表",
    children: [
      {
        key: "/right-manage/role/list",
        icon: <UserOutlined />,
        label: "角色列表",
      },
      {
        key: "/right-manage/right/list",
        icon: <UserOutlined />,
        label: "权限列表",
      },
    ],
  },
] */

const iconList = {
    "/home": <UserOutlined/>,
    "/user-manage": <UserOutlined/>,
    "/user-manage/list": <UserOutlined/>,
    "/right-manage": <UserOutlined/>,
    "/right-manage/role/list": <UserOutlined/>,
    "/right-manage/right/list": <UserOutlined/>,
    // ......
}

function SideMenu(props) {
    const [menu, setMenu] = useState([])
    const navigate = useNavigate();
    // const [collapsed, setCollapsed] = useState(false);
    const {isCollapsed} = props;
    const {pathname} = useLocation();
    // console.log(pathnamw)
    // 动态侧边栏高亮选中
    const selectedKeys = [pathname];
    const openKeys = ['/' + pathname.split('/')[1]];

    useEffect(() => {
        const {role: {rights}} = JSON.parse(localStorage.getItem('token'));
        // json-server 模拟的数据地址
        // json-server db.json --port 5000
        axios.get('/rights?_embed=children').then(res => {
            // console.log(res.data)
            let list = res.data;

            // 如果查询出来的 children 数组长度为 0 则删除
            list.forEach(item => {
                (!item.children.length) && (delete item.children)
            });

            // 处理 List
            const handleList = (arr) => {
                // 处理后的数组
                let newList = []
                // 对原数组进行遍历
                arr.forEach(item => {
                    let newObj = {}
                    // 从数组中的每一个对象解构 id, label, key 出来
                    let {id, label, key} = item;
                    // 如果数组中的每一个对象中有 pagepermisson 对象且为 1 则放进新对象中
                    // Login 页面完成后还要从 localStorage 中取数据判断 rights
                    if ("pagepermisson" in item && item.pagepermisson && rights.includes(key)) {
                        newObj['id'] = id;
                        newObj['label'] = label;
                        newObj['key'] = key;
                        // 给对象加图标
                        if (iconList[key]) newObj['icon'] = iconList[key]
                    }
                    // 如果数组中有 children 数组则递归调用 handleList 方法
                    if ("children" in item) {
                        // 递归调用
                        let children = handleList(item.children);
                        // 如果 children 数组长度为 0 则不添加
                        if (children.length !== 0) {
                            // 调用后把返回的结果放进 newObj 中
                            newObj['children'] = children
                        }
                    }
                    // 如果上面两个判断都不成立，即无 pagepermisson 也无 children
                    // 则不存进处理后的数组中，防止出现空对象
                    // 一般是 children 调用了 handleList 函数才会出现空对象
                    if (JSON.stringify(newObj) !== "{}") newList.push(newObj)
                })
                return newList
            }

            list = handleList(list)
            // console.log(list)

            setMenu(list)
        })
    }, []);


    // kerwin 写的代码，未测试过

    // const { role: { rights } } = JSON.parse(localStorage.getItem('token'));

    /* const checkPagePermission = (item) => {
      return item.pagepermisson && rights.includes(item.key)
    } */

    /* const renderMenu = (menuList) => {
      return menuList.map(item => {
        if (item.children?.length > 0 && checkPagePermission(item)) {
          return <SubMenu key={item.key} icon={iconList[item.key]} label={item.title}>
            {renderMenu(item.children)}
          </SubMenu>
        }

        return checkPagePermission() && <Menu.Item key={item.key} icon={item.icon} onClick={()=>{
          props.history.push(item.key)
        }}>{item.title}</Menu.Item>
      })
    } */

    return (
        <Sider trigger={null} collapsible collapsed={isCollapsed}>
            <div style={{display: "flex", height: "100%", flexDirection: "column"}}>
                <div className="logo">全球新闻发布管理系统</div>
                <div style={{flex: 1, "overflow": "auto"}}>
                    <Menu theme="dark" mode="inline" selectedKeys={selectedKeys} defaultOpenKeys={openKeys} items={menu}
                          onClick={(e) => {
                              const {key} = e;
                              navigate(key, {replace: true})
                          }}>
                        {/* {renderMenu(menuList)} */}
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}

const mapStateToProps = state => {
    // console.log(state);
    const {CollapsedReducer: {isCollapsed}} = state;
    return {
        isCollapsed,
    }
}

export default connect(mapStateToProps)(SideMenu)