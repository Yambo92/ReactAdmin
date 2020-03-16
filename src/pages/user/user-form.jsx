
import React, { useState, useEffect } from 'react';
import {Form, Input, Select} from 'antd'
const {Option} = Select
export const UserForm = (props) => {
    const {form, roles, curUser} = props 
    const formLayout = {
        labelCol: {span: 4},
        wrapperCol: {span: 15}
    }
    let user = curUser ? curUser : {}

    useEffect(() => {
        form.resetFields();
    })

    return (
        <Form {...formLayout} form={form}
        initialValues={{
            username: user.username,
            phone: user.phone,
            email: user.email,
            role_id: user.role_id,
        }}
        > 
            <Form.Item 
                label="用户名："
                name="username"
                rules={[
                    {required: true, message: '用户名不能为空！'},
                    {min:4, message:"用户名长度不能小于4"},
                    {max:12, message:"用户名长度不能大于12"},
                ]}
            >
                <Input placeholder="请输入用户名" />
            </Form.Item>
            {!curUser ? <Form.Item 
                label="密码："
                name="password"
                rules={[
                    {required: true, message: '密码不能为空！'},
                    {min:4, message:"密码长度不能小于4"},
                    {max:12, message:"密码长度不能大于12"},
                ]}
            >
                <Input type="password" placeholder="请输入密码!" />
            </Form.Item> : false} 
            <Form.Item 
                label="手机号："
                name="phone"
                rules={[
                    {required: true, message: '手机号不能为空!'},
                    {pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号码！'}
                ]}
            >
                <Input placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item 
                label="邮箱："
                name="email"
                rules={[
                    {type: 'email', message:'输入的邮箱格式不正确！'}
                ]}
            >
                <Input type="email" placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item 
                label="角色"
                name="role_id"
                rules={[
                    {required: true, message: '角色不能为空！'}
                ]}
            >
                <Select allowClear placeholder="请选择角色">
                    {
                        roles.map(role => <Option value={role._id} key={role._id}>{role.name}</Option>)
                    }
                </Select>
            </Form.Item>
        </Form>
    )
} 