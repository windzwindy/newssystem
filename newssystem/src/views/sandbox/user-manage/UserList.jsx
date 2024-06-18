import { Table, Button, Modal, Form, Switch, Input, Select } from "antd";
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import UserForm from "../../../components/user-manage/UserForm";
const { confirm } = Modal;

export default function UserList() {
  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
  const [current, setCurrent] = useState(null);

  const addForm = useRef(null);
  const updateForm = useRef(null);

  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor",
    }

    axios.get('/users?_expand=role').then(res => {
      const list = res.data;
      setDataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
      ]);
      // console.log(list)
    });
  }, [roleId, region, username]);

  useEffect(() => {
    axios.get('/regions').then(res => {
      setRegionList(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get('/roles').then(res => {
      setRoleList(res.data);
    });
  }, []);

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value,
        })),
        {
          text: '全球',
          value: '全球',
        },
      ],
      onFilter: (value, item) => {
        if (value === '全球') return item.region === '';
        else return item.region === value;
      },
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      },
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName;
      },
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}></Switch>
      },
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default} />
          <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => handleUpdate(item)} />
        </div>
      }
    },
  ];

  // 更改角色信息方法
  const handleUpdate = async (item) => {
    // 打开更新 Modal 框
    await setIsUpdateOpen(true);
    setTimeout(() => {
      if (item.roleId === 1) {
        // 禁用
        setIsUpdateDisabled(true);
      } else {
        // 取消禁用
        setIsUpdateDisabled(false);
      }

      // “打开后”自动填充当前角色选项值，所以需要同步进行
      updateForm.current.setFieldsValue(item);
    });

    setCurrent(item)
  }

  // 更改角色状态函数
  const handleChange = (item) => {
    // console.log(item);
    // 直接更改状态（不建议）
    item.roleState = !item.roleState;
    setDataSource([...dataSource]);
    // 发送请求更改后端数据
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState,
    });
  }

  // 删除选项函数
  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除？',
      icon: <ExclamationCircleFilled />,
      onOk() { deleteMethod(item) },
      onCancel() { },
    });
  }

  // 删除
  const deleteMethod = (item) => {
    // 本地更新
    setDataSource(dataSource.filter(data => data.id !== item.id));
    // 发送请求删除角色
    axios.delete(`/users/${item.id}`);
  }

  const addFormOK = () => {
    // console.log('ok',addForm);
    addForm.current.validateFields().then(value => {
      // console.log(value);
      // 关闭 Modal 框，可以在成功添加后再关闭
      setOpen(false);
      // 重置输入框
      addForm.current.resetFields();
      // 先 post 到后端，生成 id 后再设置 dataSource 以便后面的删除和更新
      axios.post(`/users`, {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        // console.log(res.data);
        setDataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0],
        }]);
      });
    }).catch(err => console.log(err));
  }

  const updateFormOK = () => {
    updateForm.current.validateFields().then(value => {
      // console.log(value);
      // 关闭 Modal 框
      setIsUpdateOpen(false);
      // 本地更新
      setDataSource(dataSource.map(item => {
        if (item.id === current.id) {
          return {
            ...item,
            ...value,
            role: roleList.filter(item => item.id === value.roleId)[0],
          }
        }
        return item;
      }));
      // 有 destroyOnClose 属性可以不写下面代码
      setIsUpdateDisabled(!isUpdateDisabled);

      axios.patch(`/users/${current.id}`, value);
    });
  }

  return (
    <div>
      <Button type="primary" onClick={() => {
        setOpen(true)
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />

      <Modal
        open={open}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => {
          setOpen(false)
        }}
        onOk={() => addFormOK()}
        destroyOnClose
      // modalRender={(dom) => dom}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>

      <Modal
        open={isUpdateOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => {
          setIsUpdateOpen(false);
          // 因为有了 destroyOnClose 所以不用写这条语句也可以
          setIsUpdateDisabled(isUpdateDisabled);
        }}
        onOk={() => updateFormOK()}
        destroyOnClose
      >
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>
      </Modal>
    </div>
  )
}
