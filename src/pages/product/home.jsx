
import React, {useState, useEffect, useRef} from 'react';
import {
    Card,
    Button,
    Table,
    Input,
    Select,
    message,
} from 'antd'
import {PlusOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'
import {useHistory} from 'react-router-dom'
const {Option} = Select

/*Product默认的子路由组件*/ 
const ProductHome = () => {
    const history = useHistory();
    const [products, setProducts] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageNum, setpageNum] = useState(1); //当前页码
    const [total, setTotal] = useState(0); //数据总数
    const [searchName, setSearchName] = useState(''); //搜索的关键词
    const [searchType, setSearchType] = useState('productName'); //按照那个字段搜索
    const [clickSearch, setClickSearch] = useState(false); //是否点击搜索按钮
    const [current, setCurrent] = useState(1); //分页器的当前页(需要在搜索关键词的时候重置为第一页)
    const pageRef = useRef(pageNum);
    const getProducts = async () => {//获取当前页产品列表方法
            setLoading(true)
            let result;
            //TODO在antd的table中执行事件的时候是访问不到最新的state
            //TODO暂时不知到为什么更新完产品状态后在这里直接使用pageNum， 他的状态一直都是1（第一页），导致无论在第几页更新的产品状态最后获取的数据都是第一页的。
            if(searchName){//如果搜索关键字有值则是关键字搜索， 否则是正常获取数据
                result = await reqSearchProducts({pageNum:pageRef.current, pageSize: PAGE_SIZE, searchName, searchType})
            }else{
                result = await reqProducts(pageRef.current, PAGE_SIZE)
            }
            setLoading(false)
            if(result.status === 0){
                const {total, list} = result.data;
                setTotal(total);
                setProducts(list)
            }
    }
    const updateStatus = async(productId, status) => { //更新指定的商品状态
            const result = await reqUpdateStatus({productId, status})
            if(result.status === 0){
                getProducts(); //更新成功后获取分页器当前页面的数据
                message.success('更新商品状态成功')
            }
    }
    const initialColumns = () => {
        return [
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                key: 'desc'
            },
            {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                render : (price, record) => '¥' + price
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (status, record) => {
                    return (
                        <span>
                            <Button type="primary" 
                                onClick={() => updateStatus(record._id, status===1 ? 2 : 1)} 
                            >{status === 1 ? '下架' : '上架'}</Button>
                            <span>{status ===1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                width: 100,
                render: (text, record) => {
                    return (
                        <span>
                            {/* 把record对象使用state传递给目标路由组件 */}
                            <LinkButton onClick={() => history.push('/product/detail', {record})}>详情</LinkButton>
                            <LinkButton onClick={() => history.push('/product/addupdate', record)}>修改</LinkButton>
                        </span>
                    )
                }
            }
        ];
    }
    const title=(
        <span>
            <Select value={searchType} onChange={value => setSearchType(value)}>
                <Option value="productName">按名称搜索</Option>
                <Option value="productDesc">按描述搜索</Option>
            </Select>
            <Input placeholder="关键字" style={{width:150, margin:'0 15px'}} value={searchName} onChange={e => setSearchName(e.target.value)} />
            <Button type="primary" onClick={() => setClickSearch(!clickSearch)}>搜索</Button>
        </span>
    )
    const extra=(
        <Button type="primary" onClick={() => history.push('/product/addupdate')}>
            <PlusOutlined />
            添加商品
        </Button>
    )
    useEffect(() => { //初始化表格列
        setColumns(initialColumns())
    }, []);
    useEffect(() => {//只要点击搜索按钮 就重置当前页面为第一页
        setpageNum(1)
        setCurrent(1)
    }, [clickSearch]);
    useEffect(() => { //获取商品分页列表
        getProducts();
    }, [pageNum, clickSearch]);

   
    return (
        <Card title={title} extra={extra} >
            <Table columns={columns} dataSource={products}
                bordered={true}  rowKey='_id' loading={loading}
                pagination={{
                    defaultPageSize: PAGE_SIZE,
                    current: current,
                    showQuickJumper: true,
                    total: total,
                    onChange: (page, pageSize) => {
                        setpageNum(page)
                        setCurrent(page)
                        pageRef.current = page;
                    }
                }}
            />
        </Card>
    );
}

export default ProductHome;
