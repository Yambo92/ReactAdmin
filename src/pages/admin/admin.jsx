import React from 'react';
import memoryUtils from '../../utils/memoryUtils'
import { Redirect, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav'
import Header from "../../components/header"

import {Home} from '../home/home'
import {Category} from '../category/category'
import {Product} from '../product/product'
import {Role} from '../role/role'
import {User} from '../user/user'
import {Bar} from '../charts/bar'
import {Line} from '../charts/line'
import {Pie} from '../charts/pie'

const { Footer, Sider, Content } = Layout;

/*
后台管理的路由组件
*/
export const Admin = () => {
    const user = memoryUtils.user
    //如果内存中没有暂存user信息 ===》当前没有登录
    if(!user || !user._id){
        return <Redirect to="/login" />
    }
    return (
            <Layout style={{height: '100%'}}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{backgroundColor: "#fff"}}>
                        <Switch>
                            <Route path="/home" component={Home} />
                            <Route path="/category" component={Category} />
                            <Route path="/product" component={Product} />
                            <Route path="/user" component={User} />
                            <Route path="/role" component={Role} />
                            <Route path="/pie" component={Pie} />
                            <Route path="/line" component={Line} />
                            <Route path="/bar" component={Bar} />
                            <Redirect to="/home" />
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center', color: '#ccc'}}>
                        推荐使用谷歌浏览器，获得更佳体验。
                    </Footer>
                </Layout>
            </Layout>
    );
}

export default Admin;
