import { Tag, Table, Button, Modal, Popover, Switch } from "antd";
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from "axios";
import { useEffect, useState } from "react";

const { confirm } = Modal;

export default function RightList() {

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {

    axios.get('/rights?_embed=children').then(res => {
      // console.log(res.data)
      const list = res.data;

      list.forEach(item => {
        if (item.children.length === 0) {
          // kerwin 写法
          // item.children = "";

          delete item.children;
        }
      });

      setDataSource(list);
    })

  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      },
    },
    {
      title: '权限名称',
      dataIndex: 'label',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />

          <Popover content={<div style={{ textAlign: "center" }}>

            <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)}></Switch>
          </div>} title="页面配置项" trigger={item.pagepermisson === undefined ? '' : 'click'}>

            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />

          </Popover>
        </div>
      }
    },
  ];

  // 开关选项方法
  const switchMethod = (item) => {
    // 直接改 dataSource （不建议...）
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    // console.log(item);
    setDataSource([...dataSource]);

    // 发送请求更改数据库中的数据
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    }
  }

  // 删除选项函数
  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除？',
      icon: <ExclamationCircleFilled />,
      // content: 'When clicked the OK button, this dialog will be closed after 1 second',
      onOk() {
        // console.log("ok");
        deleteMethod(item)
      },
      onCancel() {
        // console.log("cancel");
      },
    });
  }

  // 删除
  const deleteMethod = (item) => {
    // console.log(item);
    // 当前页面同步状态 + 后端同步
    if (item.grade === 1) { // 如果层级是第一级直接发送删除请求
      // 用 filter 过滤 不会改变原数组，再 setDataSource 改变原数组
      setDataSource(dataSource.filter(data => data.id !== item.id)); // 当前页面同步状态
      // 发送请求删除数据库中的数据
      axios.delete(`/rights/${item.id}`);
    } else {  // 否则是第二层，先找父层再找其 children 再删除，再发送请求删除数据库中的数据
      // console.log(item.rightId);
      // 找其父层数据
      let list = dataSource.filter(data => data.id === item.rightId);
      // console.log(list);
      // 过滤要删除的元素
      list[0].children = list[0].children.filter(data => data.id !== item.id);
      // dataSource 也受到直接影响了
      // console.log(list,dataSource);
      setDataSource([...dataSource]);
      // 发送请求删除数据
      axios.delete(`/children/${item.id}`);
    }

  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  )
}
