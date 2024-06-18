import React, {useContext, useEffect, useRef, useState} from 'react'
import {Button, Table, Modal, Form, Input} from "antd";
import axios from "axios";
import {DeleteOutlined, ExclamationCircleFilled} from "@ant-design/icons";

const {confirm} = Modal;

export default function NewsCategory() {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        axios.get(`/categories`).then((res) => {
            setDataSource(res.data);
        })
    }, []);

    const handleSave = (record) => {
        // console.log(record);
        // 按回车或失去焦点后重新设置数据
        setDataSource(dataSource.map(item => {
            if (item.id === record.id) {
                return {
                    id: item.id,
                    title: record.title,
                    value: record.title,
                }
            }
            return item;
        }));

        // 同步后端数据
        axios.patch(`/categories/${record.id}`, {
            title: record.title,
            value: record.title,
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            editable: true,
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '栏目名称',
                handleSave,
            }),
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape='circle' icon={<DeleteOutlined/>}
                            onClick={() => confirmMethod(item)}/>
                </div>
            }
        }
    ];

    const confirmMethod = (item) => {
        confirm({
            title: '你确定要删除？',
            icon: <ExclamationCircleFilled/>,
            onOk() {
                deleteMethod(item);
            },
            onCancel() {
            },
        });
    };

    // 删除栏目
    const deleteMethod = (item) => {
        const {id} = item;
        setDataSource(dataSource.filter(data => data.id !== id));
        axios.delete(`/categories/${id}`);
    }

    const EditableContext = React.createContext(null);

    // 可编辑行
    const EditableRow = ({index, ...props}) => {
        // 拿到表格对象，跟之前用 ref 同理
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    // 可编辑单元格
    const EditableCell = ({
                              title,
                              editable,
                              children,
                              dataIndex,
                              record,
                              handleSave,
                              ...restProps
                          }) => {
        // 编辑状态
        const [editing, setEditing] = useState(false);
        // 编辑时输入框 ref 对象
        const inputRef = useRef(null);
        // 表格
        const form = useContext(EditableContext);
        // 编辑状态发生变化时，如果编辑状态为真则聚焦在 input 框上
        useEffect(() => {
            if (editing) {
                inputRef.current?.focus();
            }
        }, [editing]);
        // 切换编辑状态和正常状态
        const toggleEdit = () => {
            // 使输入状态发生改变，输入框聚焦，或失去焦点保存数据
            setEditing(!editing);
            // 聚焦或失去焦点时自动填充内容到编辑的单元格里
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };
        // 在输入框编辑后，按回车或者失去焦点就会触发 save 函数验证表单并保存数据
        const save = async () => {
            try {
                // 验证表单数据
                const values = await form.validateFields();
                // 切换编辑状态
                toggleEdit();
                // 传数据更改表格 state 和后端
                handleSave({
                    ...record,
                    ...values,
                });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };
        let childNode = children;
        // 如果单元格可编辑,就进行单元格特殊渲染工作
        if (editable) {
            childNode = editing ? (
                // 正在编辑中
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
                </Form.Item>
            ) : (
                // 编辑完成后
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };

    return (
        <div>
            <Table dataSource={dataSource}
                   columns={columns}
                   pagination={{
                       pageSize: 5,
                   }}
                   rowKey={item => item.id}
                   components={{
                       body: {
                           row: EditableRow,
                           cell: EditableCell,
                       }
                   }}
            />
        </div>
    )
}