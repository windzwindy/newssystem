import { Form, Input, Select } from "antd";
import { forwardRef, useEffect, useState } from "react";

const UserForm = forwardRef((props, ref) => {
    // 解构父组件传过来的属性
    const { regionList, roleList, isUpdateDisabled, isUpdate } = props;
    // 区域下拉列表禁用状态
    const [isDisabled, setIsDisabled] = useState(false);

    const { roleId, region } = JSON.parse(localStorage.getItem('token'));
    const roleObj = {
        "1": "superadmin",
        "2": "admin",
        "3": "editor",
    }

    // 监听 isUpdateDisabled 实现动态禁用
    useEffect(() => {
        setIsDisabled(isUpdateDisabled);
    }, [isUpdateDisabled]);

    const checkRegionDisabled = (item) => {
        // console.log(item)
        const { value } = item;
        if (isUpdate) {
            if (roleObj[roleId] === "superadmin") {
                return false;
            } else {
                return true;
            }
        } else {
            if (roleObj[roleId] === "superadmin") {
                return false;
            } else {
                return value !== region;
            }
        }
    }
    
    const checkRoleDisabled = ({ id }) => {
        return isUpdate ? (!(roleObj[roleId] === "superadmin")) : ((roleObj[roleId] === "superadmin") ? false : roleObj[id] !== "editor");
    }

    return (
        <Form ref={ref} layout="vertical" >
            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '不能为空' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '不能为空' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={[{ required: !isDisabled, message: '不能为空' }]}
            >
                <Select
                    disabled={isDisabled}
                    options={regionList.map(item => ({ value: item.value, label: item.title, key: item.id, disabled: checkRegionDisabled(item) }))}
                />

                {/* kerwin 写法 */}
                {/* <Select>
            {
              regionList.map(item=>
                <Option value={item.value} key={item.id}>{item.title}</Option>
              )
            }
          </Select> */}

            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: '不能为空' }]}
            >
                <Select onChange={(value) => {
                    // console.log(value)
                    if (value === 1) {
                        setIsDisabled(true)
                        ref.current.setFieldsValue({ region: "" })
                    }
                    else {
                        setIsDisabled(false)
                    }
                }} options={roleList.map(item => ({ value: item.id, label: item.roleName, key: item.id, disabled: checkRoleDisabled(item) }))} />
            </Form.Item>
        </Form>
    )
})

export default UserForm