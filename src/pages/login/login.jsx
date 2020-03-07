import React, { useState, useEffect } from 'react';
import {useHistory, Redirect} from 'react-router-dom';
import './login.scss';
import logo from '../../assets/images/logo.png';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {reqLogin} from "../../api";
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from "../../utils/storageUtils"
/*
登录的路由组件
*/
export const Login = () => {

	let history = useHistory();

	//判断用户是否登录， 如果已经登录就重定向
	const user = memoryUtils.user
	if(user && user._id){
		return <Redirect to="/" />
	}

	//hooks函数组件中生成的 formInstance
	const [form] = Form.useForm();
	//校验成功并提交的数据
	const onFinish = async (values) => {
			//请求登录
			const {username, password} = values
			const result = await reqLogin(username, password)  //{status:0, data: user} or {status:1, msg:'xxxx'}
			if(result.status === 0){
				message.success('登录成功')

				const user = result.data;
				memoryUtils.user = user; //保存用户到内存中
				storageUtils.saveUser(user); //保存用户到本地localStorage中 
				//跳转到管理界面 (由于是登录成功，所以是要用history.replace 而不是 history.push 因为登录后不需要让用户再次回退到登录页面)
				history.replace('/');
			}else{
				message.error(result.msg)
			}
	}
	const onFinishFailed = errorInfo => {
    console.log('Failed: 校验失败');
	};
	//自定义校验password字段规则
	const validatePwd = (rule, value) => {
		// console.log('validatePwd: ', rule, value)
		if(!value){
			return Promise.reject('密码必须输入')
		} else if(value.length < 4){
			return Promise.reject('密码长度不能小于4')
		} else if(value.length > 12){
			return Promise.reject('密码长度不能大于12')
		}else if(!/^[a-zA-Z0-9_]+$/.test(value)){
			return Promise.reject('密码必须为数字字母或下划线')
		}else{
			return Promise.resolve()
		}
	}
	return (
			<div className="login">
				<header className="login-header">
					<img src={logo} alt="logo"/>
					<h1>React项目：后台管理系统</h1>
				</header>
				<section className="login-content">
					<h2>用户登录</h2>
						<Form
							name="normal_login"
							className="login-form"
							onFinish = {onFinish}
							onFinishFailed = {onFinishFailed}
							initialValues={{ username: 'admin' }} //指定字段的初始值
							>
								{/* 
									1:必须输入
									2：必须大于等于4位
									3： 必须小于等于12位
									4： 密码必须是英文,数字或下划线组成
								*/}
							<Form.Item
								name="username"
								//声明式验证：直接使用别人定义好的验证规则进行验证
								rules={[
									{required: true, whitespace: true,	message: '请输入用户名!'},
									{min:4, message: '用户名不可小于4个字符'},
									{max:12, message: '用户名不可大于12个字符'},
									{pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是字母数字或下划线'}
								]}
							>
									<Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
							</Form.Item>
							<Form.Item
									name="password"
									rules={[
										{validator: validatePwd}
									]}
							>
								<Input
								prefix={<LockOutlined className="site-form-item-icon" />}
								type="password"
								placeholder="密码"
								/>
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit" className="login-form-button">
								登录
								</Button>
							</Form.Item>
						</Form>
				</section>
			</div>
	);
	
}

export default Login;
