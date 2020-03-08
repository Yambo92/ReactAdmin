import React from 'react';
import {Form, Select, Input} from 'antd'

const { Option } = Select;

const AddForm = () => {
    return (
        <Form
            initialValues={{
                select: '0'
            }}
        >
            <Form.Item 
                name="select"
                label= "所属分类："
            >
                <Select>
                    <Option value="0">一级分类</Option>
                    <Option value="1">家用电器</Option>
                </Select>
            </Form.Item>
            <Form.Item 
                label= "分类名称："
            >
                <Input placeholder="请输入分类名称" />
            </Form.Item>
            
        </Form>
    );
}

export default AddForm;
