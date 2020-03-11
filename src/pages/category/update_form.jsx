import React,{useEffect} from 'react';
import {Form, Input} from 'antd'
import PropTypes from 'prop-types'

const UpdateForm = (props) => {
    const {categoryName, form} = props;
    useEffect(() => {
        return () => { //组件销毁的时候重置一组字段到 initialValues, 否则props变化的时候initialValues永远不变
            form.resetFields();
        }
    });
    const onChange = value => {
       // console.log(form.getFieldValue('category')) //form实例在onChange的时候实时更新的。
      };
    return (
        <Form form={form}
            initialValues={{
                category: categoryName
            }}
        >
            <Form.Item 
                name="category"
                rules={[
                    {required: true, message: "字段不能为空"}
                ]}
            >
                <Input onChange={onChange} />
            </Form.Item>
            
        </Form>
    );
}
UpdateForm.propTypes = {
    categoryName: PropTypes.string.isRequired
}
export default UpdateForm;
