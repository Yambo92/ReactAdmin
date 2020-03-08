/*
商品分类路由组件
*/ 

import React, {useState, useEffect, useRef} from 'react'
import { Card, Table, Button, message, Modal, Form } from 'antd';
import {
     PlusOutlined,
     ArrowRightOutlined
     } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import {reqCategorys, reqUpdateCategory} from '../../api'

import AddForm from './add_form'
import UpdateForm from './update_form'

export const Category = () => {
    const [form] = Form.useForm();
    const [columns, setColumns] = useState([]); //表格列lists
    const [categorys, setCategorys] = useState([]); //表格数据lists
    const [subCategorys, setSubCategorys] = useState([]); //表格数据子列表lists
    const [parentId, setParentId] = useState("0"); //父分类id
    const [parentName, setParentName] = useState(''); //父分类名称
    const [loading, setLoading] = useState(true); //loading
    const [showStatus, setShowStatus] = useState(0); //添加或更新确认框是否显示 ， 0： 都不显示， 1：显示添加， 2：显示更新
    const categoryNameRef = useRef(null); //在整个生命周期中暂存变量，不要放到useState中，否则会re-render
    const updatedNameRef = useRef(null);
    /*获取数据*/
    const getCategorys = async (id) => {
        setLoading(true)
        const result = await reqCategorys(id)
        setLoading(false)
        if(result.status === 0){ //取出分类数据 可能是一级分类的也可能是二级分类的
            const categorys = result.data;
            if(parentId === '0'){
                setCategorys(categorys)
            }else{
                setSubCategorys(categorys)
            }
        }else{
            message.error('获取分类列表失败')
        }
    } 
    /*显示一级分类*/
    const showFirstCategory = () => {
        setParentId('0')
        setParentName('')
        getCategorys(parentId);
        setSubCategorys([])
    } 
    /* 获取子分类 */
    const showSubcategorys = (record) => {
        setParentId(record._id)
        setParentName(record.name)
        getCategorys(parentId);
    } 
    useEffect(() => {//初始化列表
        setColumns(initColumns())
    }, [parentId])
    useEffect(() => {//获取数据
         getCategorys(parentId);
    }, [parentId])
    
    /*点击取消按钮隐藏对话框*/
    const handleCancel = () => {
        setShowStatus(0)
    }
    /*点击添加按钮*/
    const showAddModal = () => {
        setShowStatus(1)
    } 
    /*确认添加分类对话框*/
    const addCategory = () => {
        setShowStatus(0)
    } 
    /*点击修改分类按钮*/
    const showUpdateModal = (records) => {
        //保存分类对象
        categoryNameRef.current = records
        setShowStatus(2)
    } 
    
    /*确认更新分类对话框*/ 
    const updateCategory = async () => {
        setShowStatus(0)
        //发请求更新数据
       const categoryId = categoryNameRef.current._id;
       const categoryName = form.getFieldValue('category'); //form实例在onChange的时候实时更新的，所以直接在这里就可以访问到modal中的form表单值。
       const result = await reqUpdateCategory(categoryId, categoryName)
       if(result.status === 0){
            //重新渲染表格
            getCategorys(parentId);
       }
        
    }
    //  card左侧的标题
    const title = parentId === '0' ?  '一级分类列表' : 
                    (
                        <span>
                            <LinkButton onClick={() => showFirstCategory()}>一级分类列表</LinkButton>
                            <ArrowRightOutlined style={{marginRight: 5}} />
                            {parentName}
                        </span>
                    )
    //card右侧的更多按钮
    const extra = (
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>添加</Button>
    )   
     /* 初始化所有列数组 */
     const initColumns = () => {
        return [
            {
              title: '分类名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '操作',
              key: 'action',
              width: 200,
              render: (text, record) => (
                <span>
                    <LinkButton onClick={() => showUpdateModal(record)}>修改分类</LinkButton>
                    {parentId === '0' ? <LinkButton onClick={() => showSubcategorys(record)}>查看子分类</LinkButton> : null}
                </span>
              )
            }
          ];
    } 
    return(
        <Card title={title} extra={extra} >
            <Table rowKey="_id" bordered={true}
                 dataSource={parentId === "0" ? categorys : subCategorys} columns={columns} loading={loading}
                 pagination={{
                    defaultPageSize: 5,
                    showQuickJumper: true,
                 }}
            />
            <Modal
                title="添加分类"
                visible={showStatus===1}
                onOk={addCategory}
                onCancel={handleCancel}
                >
                <AddForm />
            </Modal>
            <Modal
                forceRender //antd4 form （解决示例https://codesandbox.io/s/antd-reproduction-template-ibu5c）
                title="更新分类"
                visible={showStatus===2}
                onOk={updateCategory}
                onCancel={handleCancel}
                >
                <UpdateForm categoryName={categoryNameRef.current ? categoryNameRef.current.name : ''}
                             form={form} />
            </Modal>
      </Card>
    )
}

export default Category