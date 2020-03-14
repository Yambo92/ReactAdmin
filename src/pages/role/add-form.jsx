/*添加角色*/ 
import React,{useEffect} from 'react';
import {
    Form,
    Input
} from 'antd'

const AddForm = (props) => {
    const {form} = props
    useEffect(() => {
      form.resetFields();
    });
    return (
        <Form  form = {form} >
            <Form.Item 
                name="roleName"
                label="角色名称："
                labelCol= {{span:4}}
                wrapperCol={{span:18}}
                rules={[{required: true, message: '请填写角色名称！'}]}
            >
                <Input />
            </Form.Item>
        </Form>
    );
}

export default AddForm;
