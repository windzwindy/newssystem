import { Table, Button, Modal, Tree } from 'antd';
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
const { confirm } = Modal;

export default function RoleList() {
  const [dataSource, setDataSource] = useState([]);
  const [rightList, setRightList] = useState([]);
  const [currentRights, setCurrentRights] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      },
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
          <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => {
            setIsModalOpen(true);
            setCurrentRights(item.rights);
            setCurrentId(item.id)
          }} />
        </div>
      },
    },
  ]
  // 确定删除函数
  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除？',
      icon: <ExclamationCircleFilled />,
      onOk() { deleteMethod(item) },
      onCancel() { },
    });
  }
  // 删除方法
  const deleteMethod = (item) => {
    // console.log(item);
    setDataSource(dataSource.filter(data => data.id !== item.id));
    axios.delete(`/roles/${item.id}`);
  }
  // 请求数据
  useEffect(() => {
    axios.get(`/roles`).then(res => {
      // console.log(res.data)
      setDataSource(res.data);
    });
  }, []);
  // 请求数据
  useEffect(() => {
    axios.get(`/rights?_embed=children`).then(res => {
      // console.log(res.data)
      let list = res.data;
      // 删除 children 数组长度为 0 的元素中的 children 项
      list.forEach(item => {
        if (!item.children.length) delete item.children;
      });
      // 把数组及其孩子中的第一项中的 label 改为 title 并删除 label 项
      const handleList = (list) => {
        list.forEach(item => {
          if ("children" in item) handleList(item.children);
          item['title'] = item['label'];
          delete item['label'];
        });
      }
      // 处理请求回来的数据
      handleList(list);
      // console.log(list);
      setRightList(list);
    });
  }, []);
  // 点确定时隐藏对话框
  const handleOk = () => {
    setIsModalOpen(false);
    // console.log(currentRights);
    // 同步 dataSource
    setDataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights,
        }
      }
      return item;
    }))
    // 发送请求更改数据库 (patch)
    axios.patch(`/roles/${currentId}`, { rights: currentRights, });
  };
  // 点取消时隐藏对话框
  const handleCancel = () => { setIsModalOpen(false); };
  // 权限分配中的选中和取消
  const onCheck = (checkedKeys) => {
    // console.log(checkedKeys);
    setCurrentRights(checkedKeys.checked);
  };
  // 渲染页面
  return <div>
    <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>

    <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      <Tree
        checkable
        checkedKeys={currentRights}
        onCheck={onCheck}
        checkStrictly={true}
        treeData={rightList}
      />
    </Modal>
  </div>
}
