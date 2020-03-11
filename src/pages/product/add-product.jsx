
import React, {useState, useEffect, useRef} from 'react';
import {useHistory} from 'react-router-dom'
import {ArrowLeftOutlined } from '@ant-design/icons';
import {
    Card,
    Form,
    Input,
    Cascader, 
    Button,
    message,
} from 'antd';
import LinkButton from '../../components/link-button'
import { useForm } from 'antd/lib/form/util';
import {reqCategorys, reqAddProduct, reqUpdateProduct} from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
const {TextArea} = Input;
/*Product添加和更新的子路由组件*/ 
const ProductAddUpdate = (props) => {
    const [options, setoptions] = useState([]); //初始化选择框
    const [product, setProduct] = useState(props.location.state || {});//初始化修改或添加产品的对象
    const history = useHistory();
    const [form] = useForm();
    const pictureRef = useRef();
    const richTextEditorRef = useRef();
    let categoryId = '0'
    let childoptions = []
    let isUpdate = !!props.location.state //判断location中是否有state来判断是否是更新还是添加
    let categoryList = []; //类别的id数组[一级id, 二级id]或[一级id]

    if(isUpdate){//更新商品
        if(product.pCategoryId==='0'){//如果商品属于一级类别
            categoryList.push(product.categoryId)
        }else{//如果商品属于二级类别
            categoryList.push(product.pCategoryId)
            categoryList.push(product.categoryId)
        }
    }
    const title=(
        <span>
            <LinkButton>
                <ArrowLeftOutlined 
                    style={{marginRight:"10px"}}
                    onClick={() => {history.goBack()}}
                />
            </LinkButton>
            <span>{isUpdate ? "修改商品" : '添加商品'}</span>
        </span>
    )
    //指定Form.Item布局
    const layout = {
        labelCol: {span:4}, //左侧label的宽度
        wrapperCol: {span:8} //右侧控件包裹的宽度
    }
    const validatePrice = (rule, value) => {
        if(value*1 > 0){
            return Promise.resolve()
        }else{
            return Promise.reject('商品价格必须大于0')
        }
            
    }
    const onChange = (value, selectedOptions) => {
        console.log(value, selectedOptions);
      };
    const loadData = async (selectedOptions) => { //如果是新增商品的时候商品类别级联动态获取二级类别
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true;
        //load options lazily
        categoryId = targetOption.value;
        const result = await getCategorys(categoryId);
        const childoptions = result.map(c => ({
            key:c._id,
            value:c._id,
            label:c.name,
            isLeaf: true
        }))
        targetOption.loading = false;
        targetOption.children = childoptions
        setoptions([...options])
    }
    const onFinish= async (values) => {
        const imgs = pictureRef.current.getImgs()
        const detail = richTextEditorRef.current.getDetail()
        // console.log('Success:', values)
        // console.log('pictures:', imgs)
        //  console.log('detail:', detail)
        let pCategoryId;
        let categoryId;
        if(values.category.length == 1){
            pCategoryId='0';
            categoryId=values.category[0];
        }else{
            pCategoryId=values.category[0];
            categoryId=values.category[1];
        }
        if(isUpdate){//调用更新接口
            const _id = product._id;
            const result = await reqUpdateProduct({...values, _id, imgs,pCategoryId,categoryId, detail})
         if(result.status === 0){
             message.success('商品信息更新成功！')
             history.goBack()
         }else{
             message.error('商品信息更新失败！')
         }
        }else{//调用新增接口
            
            const result = await reqAddProduct({...values, imgs,pCategoryId,categoryId, detail})

            if(result.status === 0){
                message.success('商品新增成功！')
                history.goBack()
            }else{
                message.error('商品新增失败！')
            }
        }
    }
    const onFinishFailed = errorInfo => {
        console.log('Failed: 校验失败');
        };
    const initOptions = async (categorys) => {
          const options = categorys.map(c => ({
                key:c._id,
                value:c._id,
                label:c.name,
                isLeaf: categoryId === '0' ? false : true
                }))
            if(categoryId === '0'){
                setoptions(options)
            }else{
                // setChildoptions(childoptions)
                childoptions = options
            }//如果是新增就到此结束
            //如果是一个二级分类的列表更新
            if(isUpdate && product.pCategoryId !== '0'){
                //获取二级分类列表
                const subCategorys = await getCategorys(product.pCategoryId)
                //生成二级分类列表
                
                const childOptions = subCategorys.map(c => ({
                    key:c._id,
                    value:c._id,
                    label:c.name,
                    isLeaf: true
                }))
                //找到当前商品对应的一级分类
                const targetOption = options.find(option => option.value === product.pCategoryId)
                //关联到对应的一级分类
                targetOption.children = childOptions
                setoptions([...options])
            }
    }
    
    //获取级联一级分类列表或二级分类列表
    const getCategorys = async(parentId) => {
        const result = await reqCategorys(parentId);
        if(result.status===0){
            const categorys = result.data
            if(parentId === '0'){ //只有变量parentId为0才调用初始化initOption
                initOptions(categorys)
            }else{
                // childoptions = categorys
                return categorys
            }
            
        }
    }
    
    useEffect(() => {
        getCategorys(categoryId);
    }, []);

    return (
        <Card title={title}>
            <Form {...layout} onFinish = {onFinish} onFinishFailed={onFinishFailed}
                initialValues={{
                    name: product.name,
                    desc: product.desc,
                    price: product.price,
                    describe: product.describe,
                    category: categoryList
                }}
            >
                <Form.Item 
                name="name"
                label="商品名称"
                rules={[{required: true, message: "商品名称不能为空"}]}>
                    <Input placeholder="请输入商品名称" />
                </Form.Item>
                <Form.Item
                 name="desc"
                 label="商品描述"
                 rules={[{required: true, message: "商品描述不能为空"}]}>
                    <TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }} />
                </Form.Item>
                <Form.Item 
                    name="price"
                    label="商品价格"
                    rules={[{
                            required: true,
                            validator: validatePrice
                         }]}>
                    <Input type="number" placeholder="请输入商品价格" addonAfter="元" />
                </Form.Item>
                <Form.Item 
                    name="category"
                    label="商品分类" 
                    rules={[{required: true, message: "商品价格不能为空"}]}>
                   <Cascader
                        options={options}
                        loadData={loadData}
                        onChange={onChange}
                        placeholder='请选择类别'                        
                    />
                </Form.Item>
                <Form.Item 
                    label="商品图片" 
                >
                   <PicturesWall ref={pictureRef} imgs={product.imgs} />
                </Form.Item>
                <Form.Item 
                    name="detail"
                    label="商品详情" 
                    labelCol={{span:2}} wrapperCol={{span:22}}
                >
                    <RichTextEditor ref={richTextEditorRef}  detail={product.detail} />
                </Form.Item>
                <Form.Item>
                        <Button type="primary" htmlType="submit">提交</Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default ProductAddUpdate;
