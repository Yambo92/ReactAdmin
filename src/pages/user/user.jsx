/*
用户路由组件
*/ 

import React, {useState, useEffect, useRef,useForm} from 'react'
import {PAGE_SIZE} from '../../utils/constants'
import {
    Card,
    Button,
    Table,
    Modal,
    message,
    Form
} from 'antd'
import {formateDate} from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import {UserForm} from './user-form'
import {reqUserList, reqDeleteUser, reqAddUserWithRoleId, reqUpdateUserWithRoleId} from '../../api'
export const User = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [curUser, setCurUser] = useState({});
    const [roles, setRoles] = useState([]);
    const [modalStatus, setModalStatus] = useState(0);
    const [columns, setColumns] = useState([
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: "邮箱",
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: '注册时间',
            dataIndex: 'create_time',
            key: 'create_time',
            render: (time) => formateDate(time)
        },
        {
            title: '所属角色',
            dataIndex: 'role_id',
            key: 'role_id',
            render: (role_id) =>{
                return roleNameRef.current[role_id]
            } 
        },
        {
            title: '操作',
            render: (text, user) => (
                <span>
                    <LinkButton onClick={() => {
                        setCurUser(user)
                        setModalStatus(2)
                        }}>修改</LinkButton>
                    <LinkButton onClick={() => deleteUser(user)}>删除</LinkButton>
                </span>
            )
        }
    ]);
    const roleNameRef = useRef({});
    const title=<Button type="primary" onClick={() => setModalStatus(1)}>创建用户</Button>
    const addUser = async () => {
        try{
          const values = await form.validateFields()
        //   console.log('form:', values)
        const result = await reqAddUserWithRoleId({...values})
        if(result.status === 0){
            message.success('用户添加成功！')
            setModalStatus(0)
            setUsers(prevUsers => [...prevUsers, result.data])
        }else{
            message.error(result.message)
        }
          
        }catch(err){
            console.log(err)
        }
        
       
    }
    const updateUser = async() => {
        try{
            const values = await form.validateFields();
            const result = await reqUpdateUserWithRoleId({...values, _id: curUser._id})
            if(result.status === 0){
                message.success('更新成功！')
                setModalStatus(0)
                setCurUser(result.data)
                setUsers(prevUsers => prevUsers.map(item => {
                    if(item._id === result.data._id) return result.data
                    else return item
                }))
            }else{
                message.error(result.message);
                
            }
        }catch(err){
            console.log(err)
        }

    
    }
    const deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除用户${user.username}吗？`,
            onOk(){
                const delUser = async() => {
                    const result = await reqDeleteUser(user._id);
                    if(result.status === 0){
                        message.success('删除成功！')
                        setUsers((preUsers) => preUsers.filter((puser) => puser._id !== user._id ))
                    }else{
                        message.success('删除失败！')
                    }
                }
                delUser();
            },
        })
    }
    const onCancel = () => {
        setModalStatus(0)
    }

    useEffect(() => {
        const getUserList = async () => {
            const result = await reqUserList();
            if(result.status === 0){
                const {users, roles} = result.data;
                const roleNames = roles.reduce((pre, role) => {
                    pre[role._id] = role.name
                    return pre;
                },{})
                roleNameRef.current = roleNames;
                setUsers(users)
                setRoles(roles)
                
            }
        }
        getUserList();
    }, [])
   
    return(
        <Card title={title}>
            <Table
                bordered
                rowKey="_id"
                loading={loading}
                dataSource={users}
                columns={columns}
                pagination={{defaultPageSize:PAGE_SIZE, showQuickJumper: true}}
            />
            <Modal
                title="添加用户"
                visible={modalStatus === 1}
                onOk={addUser}
                onCancel = {onCancel}
            >
                <UserForm form={form} roles = {roles} />
            </Modal>
            <Modal
                title="修改用户"
                visible={modalStatus === 2}
                onOk={updateUser}
                onCancel = {onCancel}
            >
                <UserForm form={form} roles = {roles} curUser={curUser} />
            </Modal>
        </Card>
    )
}

export default User