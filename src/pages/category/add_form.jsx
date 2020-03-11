import React, {useEffect, useRef} from 'react';
import {Form, Select, Input} from 'antd';
import PropTypes from 'prop-types';
const { Option } = Select;

const AddForm = (props) => {
    const {categorys, parentId, form} = props;

  
    return (
        <Form form={form}>
            <Form.Item 
                name="selectedCategoryId"
                label= "所属分类："
            >
                <Select  defaultValue={parentId}  style={{minWidth:"100px", width:"auto"}}>
                    <Option value="0">一级分类</Option>
                    {
                        categorys.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
                    }
                </Select>
            </Form.Item>
            <Form.Item 
                name="newCategory"
                label= "分类名称："
                rules={[
                    {required: true, message: "分类名称不能为空！"}
                ]}
            >
                <Input placeholder="请输入分类名称" style={{minWidth:"100px",width:"auto"}} />
            </Form.Item>
            
        </Form>
    );
}

AddForm.propTypes = {
    categorys: PropTypes.array.isRequired, //一级分类的数组
    parentId: PropTypes.string.isRequired, //父分类的ID
}

export default AddForm;
