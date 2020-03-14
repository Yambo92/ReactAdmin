/*
角色路由组件
*/ 

import React,{useState, useEffect, useRef} from 'react'
import {Card, Button, Table,Modal, message} from 'antd'
import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'
import AddForm from './add-form';
import AuthForm from './auth-form';
import { useForm } from 'antd/lib/form/util';
import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dateUtils'
export const Role = () => {
    const [form] = useForm()
    const [loading, setloading] = useState(false);
    const [modalStatus, setModalStatus] = useState(0);
    const [selectionType, setSelectionType] = useState('radio');
    /**
    |--------------------------------------------------
    | 当状态在子组件中不适合操作的时候需要提升状态到父组件
    checkedKeys原属于auth-form组件的状态，由于1：在权限模态框点击确认的时候需要通过ref,
    使得父组件可以获取子组件中所有选中的权限（存储在子组件的checkedKeys状态中，很不方便）
    2：在点击取消的时候，无法消除掉用户在子组件的数结构中的操作，带来bug, 如果把子组件的树结构勾选
    状态放到父组件中存储，每次onCheck事件调用props.onCheck事件来更新勾选的树结构状态。当用户点击取消
    就可以直接在父组件中把checkedKeys状态置位初始状态，用户再次点进去就是初始状态了。 如果点击确认，那么就调用接口更新即可。
    |--------------------------------------------------
    */
    
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [columns, setcolumns] = useState([
        {
            title: '用户名称',
            key: 'name',
            dataIndex: 'name'
        },
        {
            title: '创建时间',
            key: 'create_time',
            dataIndex: 'create_time',
            render: (time) => (formateDate(time))
        },
        {
            title: '授权时间',
            key: 'auth_time',
            dataIndex: 'auth_time',
            render: (time) => (formateDate(time))
        },
        {
            title: '授权人',
            key: 'auth_name',
            dataIndex: 'auth_name'
        }
    ]);
    const [roles, setRoles] = useState([]);//所有角色列表
    const [role, setRole] = useState({});//选中的角色
    const treeRef = useRef([])
    const title=(
        <span>
            <Button type="primary" onClick={() => {setModalStatus(1)}}>创建角色</Button>&nbsp;&nbsp;
            <Button type="primary" disabled={!role._id} onClick={() => {setModalStatus(2)}}>设置角色权限</Button>
        </span>
    )
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: record => ({
          disabled: record.name === 'Disabled User',
          // Column configuration not to be checked
          name: record.name,
        }),
      };
     const onRow = record => {
        return {
          onClick: event => {// 点击行
                // console.log("record:",record)
                setRole(record)
                setCheckedKeys(record.menus)
          }, 
        };
      }
    const  hideModal = () => {
        if(modalStatus === 2){
            setCheckedKeys(role.menus)
        }
        setModalStatus(0)
      };
    const addRole = async() => {
        try{
            const values = await form.validateFields(['roleName'])
            const {roleName} = values
            setModalStatus(0)
            const result = await reqAddRole(roleName)
            if(result.status === 0){
                setRoles(prevRoles => {
                    return [...prevRoles, result.data]
                })
                message.success('角色添加成功！')
            }else{
                message.error('角色添加失败！')
            }
            
        }catch(err){
            console.log(err)
        }
       
    }

    const onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        setCheckedKeys(checkedKeys);
      };
    const updateRole = async() => {
        try{
            const username = memoryUtils.user.username;
            const {_id, } = role;
            const menus = treeRef.current.getCheckedTree();
            // console.log('checkedTree: ', result)
            const result = await reqUpdateRole({_id, menus, auth_name:username, auth_time:Date.now()})
            if(result.status === 0){
                setRole(result.data)
                setRoles((roles) => {
                    const newRoles = roles.map((role) => (
                        role._id === result.data._id ? result.data : role
                    ))
                    return newRoles
                })
                setModalStatus(0)
                message.success('权限设置成功！')
            }else{
                setModalStatus(0)
                message.error('权限设置失败！')
            }
            
        }catch(err){
            console.log(err)
        }
        
    }
    useEffect(() => {
        const getRoles = async() => {
            const result = await reqRoles();
            if(result.status === 0){
                setRoles(result.data)
            }
        }
        getRoles();
    }, []);
    return(
        <Card title={title}>
            <Table
                bordered
                rowKey="_id"
                loading={loading}
                dataSource = {roles}
                columns={columns}
                pagination={{
                    defaultPageSize: PAGE_SIZE
                }}
                onRow = {onRow}
                rowSelection={{
                    type: selectionType,
                    selectedRowKeys: [role._id],
                    ...rowSelection,
                  }}
            />
             <Modal
                title="添加角色"
                visible={modalStatus === 1 ? true : false}
                onOk={addRole}
                onCancel={hideModal}
                okText="确认"
                cancelText="取消"
                >
                <AddForm form={form} />
            </Modal>
        <Modal
          title="Modal"
          visible={modalStatus === 2 ? true : false}
          onOk={updateRole}
          onCancel={hideModal}
          okText="确认"
          cancelText="取消"
        >
          <AuthForm role={role} ref={treeRef} onCheck = {onCheck} checkedKeys={checkedKeys} />
        </Modal>
        </Card>
    )
}

export default Role