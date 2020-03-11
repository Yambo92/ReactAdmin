
import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom'
import {Card, List} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqGetCategoryName} from '../../api'
/*Product详情的子路由组件*/ 
const ProductDetail = (props) => {
    const history = useHistory();
    const [cName1, setCname1] = useState('');//一级分类名称
    const [cName2, setCname2] = useState('');//二级分类名称
    // 读取传递进来的状态数据
    const {name, desc, price, detail, imgs, pCategoryId, categoryId} = props.location.state.record
    useEffect(() => {
        const getName = async () => {
            if(pCategoryId === '0'){ //则此商品是一级分类商品
                const result =  await reqGetCategoryName(categoryId);
                setCname1(result.data.name)
            }else{//此商品属于二级
                /*
                //通过多个await发送请求， 后面一个请求是在前一个成功后才返回
                const result1 =  await reqGetCategoryName(pCategoryId); //获取一级分类列表
                const result2 =  await reqGetCategoryName(categoryId); //获取二级分类列表
                setCname1(result1.data.name)
                setCname2(result2.data.name)
                */
               //Promise.all同时发送这两个请求
              const results = await Promise.all([reqGetCategoryName(pCategoryId), reqGetCategoryName(categoryId)])
                    setCname1(results[0].data.name)
                    setCname2(results[1].data.name)
            }          
        }
        getName();
    }, [])
    const title=(
        <span>
            <LinkButton>
                <ArrowLeftOutlined 
                    style={{marginRight:"10px"}}
                    onClick={() => {history.goBack()}}
                />
            </LinkButton>
           
            <span>商品详情</span>
        </span>
    )
    return (
        <Card title={title} className="product-detail">
            <List>
                <List.Item>
                    <span className="left">商品名称：</span>
                    <span className="right">{name}</span>
                </List.Item>
                <List.Item>
                    <span className="left">商品描述：</span>
                    <span className="right">{desc}</span>
                </List.Item>
                <List.Item>
                    <span className="left">商品价格：</span>
                    <span className="right">{price}</span>
                </List.Item>
                <List.Item>
                    <span className="left">所属分类：</span>
                    <span className="right">{cName1}  {cName2 ? '--> '+ cName2 : ''}</span>
                </List.Item>
                <List.Item>
                    <span className="left">商品图片：</span>
                    <span className="right">
                        {
                            imgs.map(img => (
                                <img className="product-img" key={img}
                                    src={BASE_IMG_URL + img} alt=""/>
                            ))
                        }
                    </span>
                </List.Item>
                <List.Item>
                    <span className="left">商品详情：</span>
                    <span className="right" dangerouslySetInnerHTML={{__html: detail}}>
                        
                    </span>
                </List.Item>
            </List>
        </Card>
    );
}

export default ProductDetail;
